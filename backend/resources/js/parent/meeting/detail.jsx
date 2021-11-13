import React, { useEffect, useState } from 'react';
import moment from 'moment';
import axios from 'axios';
import ModalSettingNotify from '../../component/modal_setting_notify';
import { ToastContainer, toast } from 'react-toastify';
import ModalMemo from '../../component/modal_memo';
import ModalConfirm from '../../component/modal_confirm';
import ModalAlert from '../../component/modal_alert';
import ModalPdf from '../../component/modal_pdf';
import Notification from '../../component/notification';
import { useHistory } from 'react-router-dom';
import { CircularProgress  } from '@material-ui/core';


const MeetingDetail = (props) => {

  const history = useHistory();
  const [loaded, setLoaded] = useState(false);
  const [show, setShow] = useState(false);
  const [showArea, setShowArea] = useState(false);
  const [showMemo, setShowMemo] = useState(false);
  const [showNotify, setShowNotify] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [showPdf, setShowPdf] = useState(false);
  const [messageAlert, setMessageAlert] = useState(null);
  const [typeAlert, setTypeAlert] = useState(null);
  const [meeting, setMeeting] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const state = history.location.state

  useEffect(() => {
    let father_id = document.getElementById('father_id').value;
    setLoaded(false);
    axios.get(`/api/fathers/meetings/detail/${props.match.params?.id}`, {params: { father_id: father_id}})
    .then((response) => {
      setLoaded(true);
      if(response.data.status_code==200){
        console.log(response.data.params);
        setMeeting(response.data.params);
        setThumbnail(response.data.params.meeting_image[0]?.image);
      } else if(response.data.status_code==400){
        //TODO
      }   
    });
  }, []);

  async function showModal() {
    setShow(true);
  };

  async function handleClose() {
    setShow(false);
  };

  async function handleAccept() {
    try {
      axios.delete(`/api/meetings/delete/${props.match.params?.id}`)
        .then(response => {
          if(response.data.status_code == 200){
              axios.delete(`/api/meeting-images/deleteRelationMeeting/${props.match.params?.id}`)
                .then(response => {});
              axios.delete(`/api/meeting-approvals/deleteRelationMeeting/${props.match.params?.id}`)
                .then(response => {
                  setMessageAlert("ミーティングの削除に成功しました！");
                  setTypeAlert("success");
                });
          } else {
            setMessageAlert("ミーティングの削除に失敗しました。");
            setTypeAlert("danger");
          }
          setShowAlert(true);
        });
      setShow(false);
    } catch (error) {
      console.log('error', error);
    }
  };
  
  async function showModalMemo() {
    setShowMemo(true);
  };

  async function showModalArea() {
    setShowArea(true);
  };

  async function showModalNotify() {
    setShowNotify(true);
  };

  async function handleCloseNotify() {
    setShowNotify(false);
  };
  
  async function handleClosePdf() {
    setShowPdf(false);
  };

  async function handleCloseMemo() {
    setShowMemo(false);
  };

  async function handleAcceptNotify() {
    try {
      axios.post(`/api/children/listOfMeetingNotifyUnapprovel/${props.match.params?.id}`)
        .then(response => {
          if(response.data.status_code == 200){
              axios.delete(`/api/smss/register/${props.match.params?.id}`)
                .then(response => {
                });
          }
        });
      setShowNotify(false);
    } catch (error) {
      console.log('error', error);
    }
  };

  async function handleCloseAlert() {
    setShowAlert(false);
  };

  async function handleFavorite(meetingId, currentFavorite) {
    const formdata = new FormData();
    formdata.append('meeting_id', meetingId);
    formdata.append('is_favorite', currentFavorite == 1 ? 0 : 1);
    axios.post('/api/meetings/registerFavorite', formdata).then((response) => {})

    const updatedItem = {
      ...meeting,
      is_favorite: currentFavorite == 1 ? 0 : 1,
    };
    setMeeting(updatedItem);
  };

  if (!meeting) return null;

	return (
      <div className="l-content">
        <ToastContainer />
        <div className="l-content-w560">
          <div className="l-content__ttl">
            <div className="l-content__ttl__left">
              <h2>ミーティング詳細</h2>
            </div>
            <Notification />
          </div>
          {
            !loaded &&
              <CircularProgress color="secondary" className="css-loader"/>
          }
          {
            loaded &&
            <div className="l-content-wrap">
              <div className="p-article">
                <div className="p-article-wrap">
                  <article className="p-article__body">
                    <div className="p-article__content">       
                      <div className="meeting-member">
                        <div className="meeting-member-wrap">
                          <div onClick={showModalArea} data-url="login.html" className="meeting-member-link">
                            <ul className="meeting-member-count">
                              <li className="numerator">{meeting?.meeting_approvals.length}</li>
                              <li className="denominator">{meeting?.meeting_approvals.length}</li>
                            </ul>
    
                            <ul className="meeting-member-list" role="list">
                              { meeting?.meeting_approvals.map((v, inx) => {
                                  return (<li className="meeting-member__item" role="listitem">
                                    <div className="avatar">
                                      <img alt="name" className="avatar-img" src={v?.child.image} />
                                    </div>
                                  </li>);
                              }) }
                            </ul>

                            <div className="meeting-member__read">
                              <p>{meeting?.meeting_approvals.length}人既読</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <h3 className="meeting-ttl">{ meeting.title }</h3>
                      <time dateTime="2021-07-30" className="meeting-time">
                        <span className="meeting-date">{ moment(meeting.updated_at).format('YYYY/MM/DD HH:mm') || '' }</span>
                      </time>
                      <ul className="p-article-btn-list">
                        <li className="p-article-btn__item">
                          <a 
                            onClick={e => {
                              e.preventDefault();
                              history.push({
                                pathname: `/p-account/meeting/edit/${props.match.params?.id}`,
                                state: {}
                              });
                            }} 
                            className="btn-default btn-yellow btn-pdf btn-r8 btn-h48">
                            編集
                          </a>
                        </li>
                        <li className="p-article-btn__item">
                          <a onClick={showModal} className="btn-default btn-yellow btn-pdf btn-r8 btn-h48">削除</a>
                        </li>
                        <li className="p-article-btn__item">
                          <a
                            onClick={e => {
                              e.preventDefault();
                              history.push({
                                pathname: '/p-account/meeting/new',
                                state: {}
                              });
                            }} 
                            className="btn-default btn-yellow btn-pdf btn-r8 btn-h48">複製</a>
                        </li>
                        <li className="p-article-btn__item">
                          <a onClick={showModalNotify} className="btn-default btn-yellow btn-pdf btn-r8 btn-h48">再通知</a>
                        </li>
                      </ul>
                    
                      <div className="p-article__context">
    
                        <div className="p-file-list">
                          <div className="p-file-for">
                            <figure><img src={thumbnail} alt="" /></figure>
                          </div>
                          <div className="p-file-nav">
                            { meeting?.meeting_image.map((v, inx) => {
                              return ( <figure onClick={e => { setThumbnail(v.image);}} ><img src={v.image} alt="" /></figure> );
                            }) }
                          </div>
                        </div>

                        <div className="p-article__pdf">
                          <div className="p-article__pdf__btn">
                            <a 
                                onClick={e => {
                                  e.preventDefault();
                                  setShowPdf(true); 
                                }} 
                                className="btn-default btn-yellow btn-pdf btn-r8 btn-h52">
                              <span>PDFを確認する</span>
                            </a>
                          </div>
                          <button type="button" onClick={showModalMemo}  aria-label="メモ" data-tooltip="メモ" aria-pressed="false" style={{marginRight:10}} className="icon a-icon like-icon icon-starFill-wrap a-icon-size_medium"></button>
                          <button type="button" 
                            onClick={e => {
                              e.preventDefault();
                              handleFavorite(meeting.id, meeting.is_favorite);
                            }} 
                            aria-label="お気に入り" data-tooltip="お気に入り" aria-pressed="false" className={`icon a-icon like-icon  ${meeting.is_favorite == 1 ? "icon-starFill icon-starFill-wrap" : "icon-star icon-star-wrap"} a-icon-size_medium`}></button>
                        </div>
                    
                        <p className="p-article__txt">{ meeting.text }</p>
                      </div>
                    </div>
                  </article>
                </div>
              </div>
            </div>
          }
        </div>
        <ModalSettingNotify 
          show={showArea}
          meetingId={meeting.id}
          // message={"本当に削除しても\nよろしいでしょうか？"}
          // handleClose={handleClose} 
          // handleAccept={handleAccept} 
        />
        <ModalMemo 
          show={showMemo}
          title={"メモ"}
          content={meeting?.memo}
          handleClose={handleCloseMemo} 
        />
        <ModalConfirm 
          show={show} 
          message={"本当に削除しても\nよろしいでしょうか？"}
          handleClose={handleClose} 
          handleAccept={handleAccept} 
        />
        <ModalConfirm 
          show={showNotify} 
          message={"本当に再通知しても\nよろしいでしょうか？"}
          handleClose={handleCloseNotify} 
          handleAccept={handleAcceptNotify} 
        />
        <ModalAlert 
          show={showAlert}
          message={messageAlert}
          type={typeAlert}
          handleClose={handleCloseAlert} 
        />
        <ModalPdf 
          show={showPdf}
          pdfPath={meeting.pdf ?? '/pdf/test.pdf'}
          handleClose={handleClosePdf} 
        />
      </div>  
	)
}

export default MeetingDetail;