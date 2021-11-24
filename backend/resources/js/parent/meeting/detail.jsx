import React, { useEffect, useState } from 'react';
import moment from 'moment';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { useHistory, Link } from 'react-router-dom';
import { CircularProgress  } from '@material-ui/core';

import ModalMemo from '../../component/modal_memo';
import ModalConfirm from '../../component/modal_confirm';
import ModalPdf from '../../component/pdf/modal_pdf';
import Notification from '../notification';
import ModalSettingNotify from '../../component/modal_setting_notify';
import Alert from '../../component/alert';


const MeetingDetail = (props) => {

  const history = useHistory();
  const [loaded, setLoaded] = useState(false);
  const [submit_delete, setSubmitDelete] = useState(false);
  const [submit_notify, setSubmitNotify] = useState(false);
  const [notice, setNotice] = useState(localStorage.getItem('notice'));
  const [_success, setSuccess] = useState(props.history.location.state);
  const [_400error, set400Error] = useState('');
  
  const [showDelete, setShowDelete] = useState(false);
  const [showSettingNotify, setShowSettingNotify] = useState(false);
  const [showMemo, setShowMemo] = useState(false);
  const [showNotify, setShowNotify] = useState(false);
  const [showPdf, setShowPdf] = useState(false);

  const [meeting, setMeeting] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);

  useEffect(() => {
    let father_id = document.getElementById('father_id').value;
    setLoaded(false);
    axios.get(`/api/fathers/meetings/detail/${props.match.params?.meeting_id}`, {params: { father_id: father_id}})
    .then((response) => {
      setLoaded(true);
      setNotice(response.data.notice);
      if(response.data.status_code==200){
        var list = response.data.params;
        var total=0, num=0;
        for(var i in list.approval)
        {
          if(list.approval[i].approval_at) num ++;   
          total ++;
        }
        setMeeting({...list, denominator:total, numerator:num});
        setThumbnail(response.data.params.meeting_image[0]?.image);
      }
      else {
        set400Error("失敗しました。");
      } 
    });
  }, []);

  //-------------------------------------------------------------
  useEffect(()=>{
    var navbar_list = document.getElementsByClassName("mypage-nav-list__item");
    for(let i=0; i<navbar_list.length; i++)
        navbar_list[i].classList.remove('nav-active');
    document.getElementsByClassName("-meeting")[0].classList.add('nav-active');
  },[]);


  const handleAcceptDelete = () => {
    setSubmitDelete(true);
    axios.delete(`/api/fathers/meetings/delete/${props.match.params?.meeting_id}`)
    .then(response => {
      setNotice(response.data.notice);
      setSubmitDelete(false);
      setShowDelete(false);
      switch(response.data.status_code){
        case 200: {
          history.push({ pathname: "/p-account/meeting",
            state: "ミーティングの削除に成功しました！" });  
          break;
        }
        case 400: set400Error('ミーティングの削除に失敗しました。'); break;
      }
    });
  };
  

  async function handleFavorite(meetingId, currentFavorite) {
    const formdata = new FormData();
    formdata.append('meeting_id', meetingId);
    formdata.append('is_favorite', currentFavorite == 1 ? 0 : 1);
    axios.post('/api/fathers/meetings/registerFavorite', formdata)
    .then(response => {setNotice(response.data.notice)})
    const updatedItem = {
      ...meeting,
      is_favorite: currentFavorite == 1 ? 0 : 1,
    };
    setMeeting(updatedItem);
  };

  const handleNotifyAllChild = () => {
      setSubmitNotify(true);
      axios.get('/api/fathers/meeting/approvals/listChildrenOfUnapprovel', {params:{meeting_id: props.match.params?.meeting_id}})
      .then(response => {
        setNotice(response.data.notice);
        if(response.data.status_code == 200){
          var list = response.data.params;
          const tel_list = [];
          for(var i in list){
            tel_list.push(list[i].child.tel);
          }
          const formdata = new FormData();
          formdata.append('tel', JSON.stringify(tel_list));
          formdata.append('meeting_id', props.match.params.meeting_id);
          axios.post('/api/fathers/approvalNotification', formdata)
          .then(response=>{
            setSubmitNotify(false);
            setShowNotify(false);
            switch(response.data.status_code){
              case 200: setSuccess('SMSの送信に成功しました!'); break;
              case 400: set400Error('SMSの送信に失敗しました。'); break;
            }
          })
        }
      });
  }


  return (
      <div className="l-content">
        <div className="l-content-w560">
          <div className="l-content__ttl">
            <div className="l-content__ttl__left">
              <h2>ミーティング詳細</h2>
            </div>
            <Notification notice={notice}/>
          </div>
          {
            !loaded && 
              <CircularProgress className="css-loader"/>
          }
          {
            loaded && meeting &&
            <div className="l-content-wrap">
              <div className="p-article">
                <div className="p-article-wrap">
                  <article className="p-article__body">
                    <div className="p-article__content">       
                      <div className="meeting-member">
                        <div className="meeting-member-wrap">
                          <div className="meeting-member-link">
                            <ul className="meeting-member-count">
                              <li className="numerator">{meeting?.numerator}</li>
                              <li className="denominator">{meeting?.denominator}</li>
                            </ul>
    
                            <ul className="meeting-member-list" role="list" onClick={()=>setShowSettingNotify(true)} >
                              { 
                                meeting.approval?.map((v, inx) =>
                                  <li className="meeting-member__item" role="listitem" key={inx}>
                                    <div className="avatar">
                                      <img alt="name" className="avatar-img" src={v?.child.image} />
                                    </div>
                                  </li>
                                ) 
                              }
                            </ul>
                          </div>
                        </div>
                      </div>
                      <h3 className="meeting-ttl">{ meeting?.title }</h3>
                      <time dateTime="2021-07-30" className="meeting-time">
                        <span className="meeting-date">{ moment(meeting?.updated_at).format('YYYY/MM/DD') }</span>
                      </time>
                      <ul className="p-article-btn-list">
                        <li className="p-article-btn__item">
                          <Link to={`/p-account/meeting/edit/${props.match.params?.meeting_id}`}
                              className="btn-default btn-yellow btn-pdf btn-r8 btn-h48">編集</Link>
                        </li>
                        <li className="p-article-btn__item">
                          <a onClick={()=>setShowDelete(true)} className="btn-default btn-yellow btn-pdf btn-r8 btn-h48">削除</a>
                        </li>
                        <li className="p-article-btn__item">
                          <a onClick={()=>
                            history.push({ 
                              pathname: "/p-account/meeting/new",  
                              state: meeting 
                            })}
                            className="btn-default btn-yellow btn-pdf btn-r8 btn-h48">複製</a>
                        </li>
                        <li className="p-article-btn__item">
                          <a onClick={()=>setShowNotify(true)} className="btn-default btn-yellow btn-pdf btn-r8 btn-h48">再通知</a>
                        </li>
                      </ul>
                    
                      <div className="p-article__context">
    
                        <div className="p-file-list">
                          <div className="p-file-for">
                              <figure>
                              {  thumbnail &&  <img src={thumbnail} alt="thumbnail"/>  }
                              </figure>
                          </div>
                          <div className="p-file-nav">
                          { 
                            meeting.meeting_image.map((v, inx) => 
                              <figure onClick={() => setThumbnail(v.image)}  key={inx}>
                                <img src={v.image} alt="" />
                              </figure> 
                            ) 
                          }
                          </div>
                        </div>

                        <div className="p-article__pdf">
                          <div className="p-article__pdf__btn">
                            <a onClick={e => setShowPdf(true)}
                                className="btn-default btn-yellow btn-pdf btn-r8 btn-h52">
                              <span>PDFを確認する</span>
                            </a>
                          </div>
                          <button type="button" onClick={()=>setShowMemo(true)}  
                            aria-label="メモ" 
                            data-tooltip="メモ" 
                            aria-pressed="false" 
                            style={{marginRight:10}} 
                            className="icon a-icon text-icon icon-text icon-starFill-wrap a-icon-size_medium"></button>
                          <button type="button" 
                            onClick={e => handleFavorite(meeting.id, meeting.is_favorite)} 
                            aria-label="お気に入り" data-tooltip="お気に入り" aria-pressed="false" className={`icon a-icon like-icon  ${meeting.is_favorite == 1 ? "icon-starFill icon-starFill-wrap" : "icon-star icon-star-wrap"} a-icon-size_medium`}></button>
                        </div>
                        <p className="p-article__txt">{ meeting.text }</p>
                      </div>
                    </div>
                  </article>
                </div>
              </div>
              <ModalSettingNotify 
                show={showSettingNotify}
                meetingId={meeting.id}
                handleClose={()=>setShowSettingNotify(false)} 
              />
              <ModalMemo 
                show={showMemo}
                title={"メモ"}
                content={meeting?.memo}
                handleClose={()=>setShowMemo(false)} 
              />
              <ModalConfirm 
                show={showDelete} 
                message={"本当に削除しても\nよろしいでしょうか？"}
                handleClose={()=>setShowDelete(false)} 
                handleAccept={handleAcceptDelete} 
                loading={submit_delete}
              />
              <ModalConfirm 
                show={showNotify}
                message={"未承知の方に再通知しますが\nよろしいでしょうか？"}
                handleClose={()=>setShowNotify(false)} 
                handleAccept={handleNotifyAllChild} 
                loading = {submit_notify}
              />
              <ModalPdf 
                show={showPdf}
                pdfPath={meeting.pdf ?? '/pdf/test.pdf'}
                handleClose={()=>setShowPdf(false)} 
              />
            </div>
          }
        </div>
        { _400error && <Alert type="fail"  hide={()=>set400Error('')}>{_400error}</Alert> }
        { _success && <Alert type="success"  hide={()=>setSuccess('')}>{_success}</Alert> }
      </div>  
	)
}

export default MeetingDetail;