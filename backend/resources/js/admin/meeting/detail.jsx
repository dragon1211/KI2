import { useEffect, useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import moment from 'moment';
import axios from 'axios';
import { CircularProgress  } from '@material-ui/core';

import Alert from '../../component/alert';
import ModalPdf from '../../component/pdf/modal_pdf';
import ModalMemo from '../../component/modal_memo';
import ModalConfirm from '../../component/modal_confirm';


const MeetingDetail = (props) => {

  const history = useHistory();
  const [loaded, setLoaded] = useState(false);
  const [submit, setSubmit] = useState(false);
  const [meeting, setMeeting] = useState(null);
  const [thumbnail, setThumbnail] = useState('');
  
  const [_400error, set400Error] = useState('');
  const [_success, setSuccess] = useState(props.history.location.state);
  
  const [show_confirm_modal, setShowConfirmModal] = useState(false);
  const [show_pdf_modal, setShowPDFModal] = useState(false);
  const [show_memo_modal, setShowMemoModal] = useState(false);
  
  
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
      else {
        set400Error("失敗しました。");
      }
    });
  }, []);


  async function handleAcceptDelete() {
    setSubmit(true);
    axios.delete(`/api/admin/meetings/delete/${props.match.params?.meeting_id}`)
    .then(response => {
      setShowConfirmModal(false);
      setSubmit(false);
      switch(response.data.status_code){
        case 200:{
          history.push({pathname: '/admin/meeting',  state: '削除に成功しました！'});
          break;
        }
        case 400: set400Error("削除に失敗しました。"); break;
      } 
    });
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
              <div className="p-article-wrap" style={{ minHeight:'700px'}}>
              {
                !loaded &&
                  <CircularProgress className="css-loader"/>
              }
              {
                loaded && meeting &&
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
                              {
                                if(x.approval_at)
                                return(
                                <li className="meeting-member__item" role="listitem" key={k}>
                                  <div className="avatar">
                                    <img alt="name" className="avatar-img" src={x.child.image} />
                                  </div>
                                </li>)
                              })
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
                        <Link to={`/admin/meeting/edit/${props.match.params?.meeting_id}`}
                          className="btn-default btn-yellow btn-pdf btn-r8 btn-h48">
                          編集
                        </Link>
                      </li>
                      <li className="p-article__pdf__btn mr-0">
                        <a className="btn-default btn-yellow btn-pdf btn-r8 btn-h48"
                          onClick={()=>setShowConfirmModal(true)}> 
                          削除
                        </a>
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
                        </div>
                      </div>
  
                      <div className="p-article__pdf">
                        <div className="p-article__pdf__btn">
                          {
                            meeting.pdf ?
                            <a className="btn-default btn-yellow btn-pdf btn-r8 btn-h52" 
                              href={meeting.pdf} target='_blank'>
                              <span>PDFを確認する</span>
                            </a>
                            :
                            <a data-v-ade1d018="" className="btn-default btn-yellow btn-pdf btn-r8 btn-h52 btn-disabled">
                              <span>PDFを確認する</span>
                            </a>
                          }
                        </div>
                        {
                          meeting.memo ?
                          <button type="button" 
                            aria-label="お気に入り" data-tooltip="お気に入り" 
                            aria-pressed="false" 
                            className="icon a-icon like-icon icon-textFill icon-textFill-wrap a-icon-size_medium mr-0"
                            onClick = {()=>setShowMemoModal(true)} />
                          :
                          <button type="button" 
                            aria-label="お気に入り" data-tooltip="お気に入り" 
                            aria-pressed="false" 
                            className="icon a-icon like-icon icon-text icon-text-wrap a-icon-size_medium mr-0"/>
                        }
                      </div>
                  
                      <p className="p-article__txt">{ meeting.text }</p>
                    </div>
                  </div>
                  <ModalMemo 
                    show={show_memo_modal}
                    title={"メモ"}
                    content={meeting?.memo}
                    handleClose={()=>setShowMemoModal(false)} 
                  />
                  <ModalPdf 
                    show={show_pdf_modal}
                    pdfPath={meeting.pdf}
                    handleClose={()=>setShowPDFModal(false)} 
                  />
                </article>
              }
              </div>
            </div>
          </div>
        </div>
        <ModalConfirm 
          show={show_confirm_modal} 
          message={"本当に削除しても\nよろしいでしょうか？"}
          handleClose={()=>setShowConfirmModal(false)} 
          handleAccept={handleAcceptDelete} 
          loading={submit}
        />
        { _400error && <Alert type="fail" hide={()=>set400Error('')}> {_400error} </Alert> } 
        { _success && <Alert type="success" hide={()=>setSuccess('')}> {_success} </Alert> }
    </div>  
	)
}

export default MeetingDetail;