import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom'
import moment from 'moment';
import axios from 'axios';
import { CircularProgress  } from '@material-ui/core';

import Alert from '../../component/alert';
import ModalPdf from '../../component/pdf/modal_pdf';
import ModalMemo from '../../component/modal_memo';
import ModalConfirm from '../../component/modal_confirm';


const MeetingDetail = (props) => {

  const history = useHistory();
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [submit, setSubmit] = useState(false);
  const [meeting, setMeeting] = useState(null);
  const [thumbnail, setThumbnail] = useState('');

  const [_400error, set400Error] = useState('');
  const [_success, setSuccess] = useState('');
  
  const [showPdf, setShowPdf] = useState(false);
  const [showMemo, setShowMemo] = useState(false);
  
  
  useEffect(() => {
    setLoaded(false);
    axios.get(`/api/admin/meetings/detail/${props.match.params?.meeting_id}`)
    .then((response) => {
      setLoaded(true);
      if(response.data.status_code==200){
        var list = response.data.params;
        var total=0, num=0;
        if(list.approval){
          for(var i in list.approval)
          {
            if(list.approval[i].approval_at) num ++;
            total ++;
          }
        }
        setMeeting({...list, denominator:total, numerator:num});
        if(list.meeting_image.length > 0) setThumbnail(list.meeting_image[0].image);
      } 
    });
  }, []);

  async function openModal() {
    setOpen(true);
  };

  async function closeModal() {
    setOpen(false);
  };

  async function handleAcceptDelete() {
    try {
      setSubmit(true);
      axios.delete(`/api/admin/meetings/delete/${props.match.params?.meeting_id}`)
        .then(response => {
          closeModal();
          setSubmit(false);
          if(response.data.status_code == 200){
              setSuccess('削除に成功しました！');
          } else {
              set400Error("削除に失敗しました。");
          }
        });
    } catch (error) {
      console.log('error', error);
    }
  };


	return (
      <div className="l-content">
        <div className="l-content-w560">
          <div className="l-content__ttl">
            <div className="l-content__ttl__left">
              <h2>ミーティング詳細</h2>
            </div>
          </div>
  
          <div className="l-content-wrap">
            <div className="p-article">
              <div className="p-article-wrap position-relative" style={{ minHeight:'500px'}}>
              {
                !loaded &&
                  <CircularProgress color="secondary" style={{top:'150px',  left:'calc(50% - 22px)', color:'green', position:'absolute'}}/>
              }
              {
                loaded && 
                (
                  meeting ? 
                  <article className="p-article__body">
                    <div className="p-article__content">       
                      <div className="meeting-member">
                        <div className="meeting-member-wrap">
                          <div data-url="login.html" className="meeting-member-link">
                            <ul className="meeting-member-count">
                              <li className="numerator">{meeting.numerator}</li>
                              <li className="denominator">{meeting.denominator}</li>
                            </ul>
    
                            <ul className="meeting-member-list" role="list">
                              {
                                meeting.approval?.map((x, k)=>
                                  <li className="meeting-member__item" role="listitem" key={k}>
                                    <div className="avatar">
                                      <img alt="name" className="avatar-img" src={x.child.image} />
                                    </div>
                                  </li>
                                )
                              }
                            </ul>
                          </div>
                        </div>
                      </div>
                      <h3 className="meeting-ttl">{ meeting.title }</h3>
                      <time dateTime="2021-07-30" className="meeting-time">
                        <span className="meeting-date">{ moment(meeting.updated_at).format('YYYY/MM/DD') || '' }</span>
                      </time>
                      <ul className="p-article-btn-list">
                        <li className="p-article__pdf__btn">
                          <a 
                            onClick={e => {
                              e.preventDefault();
                              history.push({
                                pathname: `/admin/meeting/edit/${props.match.params?.meeting_id}`,
                                state: {}
                              });
                            }} 
                            className="btn-default btn-yellow btn-pdf btn-r8 btn-h48">
                            編集
                          </a>
                        </li>
                        <li className="p-article__pdf__btn mr-0">
                          <a onClick={openModal} className="btn-default btn-yellow btn-pdf btn-r8 btn-h48">削除</a>
                        </li>
                      </ul>
                    
                      <div className="p-article__context">
    
                        <div className="p-file-list">
                          <div className="p-file-for">
                            <figure>
                                {
                                    thumbnail && 
                                    <img src={thumbnail} alt="thumbnail"/>
                                }
                            </figure>
                          </div>
                          <div className="p-file-nav">
                            {
                              meeting.meeting_image?.map((x, k)=>
                                <figure key={k}>
                                  <img src={x.image} alt={x.image} onClick={e=>setThumbnail(x.image)}/>
                                </figure>
                              )
                            }
                            {
                              [...Array(10-meeting.meeting_image.length)].map((x, k)=>
                                <figure key={k}></figure>
                              )
                            }
                          </div>
                        </div>
    
                        <div className="p-article__pdf">
                          <div className="p-article__pdf__btn">
                            <a data-v-ade1d018="" className="btn-default btn-yellow btn-pdf btn-r8 btn-h52" onClick={e=>setShowPdf(true)}>
                              <span>PDFを確認する</span>
                            </a>
                          </div>
                          <button type="button" 
                            aria-label="お気に入り" data-tooltip="お気に入り" 
                            aria-pressed="false" 
                            className="icon a-icon text-icon icon-text icon-starFill-wrap a-icon-size_medium" 
                            style={{border:'1px solid #f0de00'}}
                            onClick = {()=>setShowMemo(true)} />
                        </div>
                    
                        <p className="p-article__txt">{ meeting.text }</p>
                      </div>
                    </div>
                    <ModalMemo 
                      show={showMemo}
                      title={"メモ"}
                      content={meeting?.memo}
                      handleClose={()=>setShowMemo(false)} 
                    />
                    <ModalPdf 
                      show={showPdf}
                      pdfPath={meeting.pdf ?? '/pdf/test.pdf'}
                      handleClose={()=>setShowPdf(false)} 
                    />
                  </article>
                  : <p className="text-center pt-5">データが存在していません。</p>
                )
              }
           
              </div>
            </div>
          </div>
        </div>
        <ModalConfirm 
          show={open} 
          message={"本当に削除しても\nよろしいでしょうか？"}
          handleClose={closeModal} 
          handleAccept={handleAcceptDelete} 
          loading={submit}
        />
        {
          _400error && <Alert type="fail" hide={()=>set400Error('')}>{_400error}</Alert>
        } 
        {
          _success && 
            <Alert type="success" 
              hide={()=>  
                history.push({
                pathname: "/admin/meeting",
                state: {}
            })}>{_success}</Alert>
        }
    </div>  
	)
}

export default MeetingDetail;