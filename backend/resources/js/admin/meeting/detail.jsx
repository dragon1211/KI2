import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom'
import moment from 'moment';
import axios from 'axios';

import ModalConfirm from '../../component/modal_confirm';
import ModalAlert from '../../component/modal_alert';
import Notification from '../../component/notification';

const MeetingDetail = (props) => {
  const history = useHistory();
  const [show, setShow] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [messageAlert, setMessageAlert] = useState(null);
  const [typeAlert, setTypeAlert] = useState(null);
  const [meeting, setMeeting] = useState(null);
  useEffect(() => {

    axios.get(`/api/admin/fathers/meetings/detail/${props.match.params?.meeting_id}`, {params: { father_id: 1 }}).then((response) => {
      if(response.data.status_code==200){
        console.log(response.data.params[0]);
        setMeeting(response.data.params[0]);
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
      axios.delete(`/api/meetings/delete/${props.match.params?.meeting_id}`)
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

  async function handleCloseAlert() {
    setShowAlert(false);
  };

  if (!meeting) return null;

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
              <div className="p-article-wrap">
                <article className="p-article__body">
                  <div className="p-article__content">       
                    <div className="meeting-member">
                      <div className="meeting-member-wrap">
                        <div data-url="login.html" className="meeting-member-link">
                          <ul className="meeting-member-count">
                            <li className="numerator">3</li>
                            <li className="denominator">4</li>
                          </ul>
  
                          <ul className="meeting-member-list" role="list">
                            <li className="meeting-member__item" role="listitem">
                              <div className="avatar">
                                <img alt="name" className="avatar-img" src="../../../assets/img/avatar/avatar-sample01@2x.png" />
                              </div>
                            </li>
                            <li className="meeting-member__item" role="listitem">
                              <div className="avatar">
                                <img alt="name" className="avatar-img" src="../../../assets/img/avatar/avatar-sample02@2x.png" />
                              </div>
                            </li>
                            <li className="meeting-member__item" role="listitem">
                              <div className="avatar">
                                <img alt="name" className="avatar-img" src="../../../assets/img/avatar/avatar-sample03@2x.png" />
                              </div>
                            </li>
                          </ul>

                          <div className="meeting-member__read">
                            <p>3人既読</p>
                          </div>
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
                        <a onClick={showModal} className="btn-default btn-yellow btn-pdf btn-r8 btn-h48">削除</a>
                      </li>
                    </ul>
                   
                    <div className="p-article__context">
  
                      <div className="p-file-list">
                        <div className="p-file-for">
                          <figure><img src="../../../assets/img/dummy/post-dummy01.jpg" alt="" /></figure>
                        </div>
                        <div className="p-file-nav">
                          <figure><img src="../../../assets/img/dummy/post-dummy01.jpg" alt="" /></figure>
                          <figure><img src="../../../assets/img/dummy/post-dummy02.jpg" alt="" /></figure>
                          <figure><img src="../../../assets/img/dummy/post-dummy03.jpg" alt="" /></figure>
                          <figure><img src="../../../assets/img/dummy/post-dummy04.jpg" alt="" /></figure>
                          <figure><img src="../../../assets/img/dummy/post-dummy05.jpg" alt="" /></figure>
                          <figure><img src="../../../assets/img/dummy/post-dummy01.jpg" alt="" /></figure>
                          <figure><img src="../../../assets/img/dummy/post-dummy02.jpg" alt="" /></figure>
                          <figure><img src="../../../assets/img/dummy/post-dummy03.jpg" alt="" /></figure>
                          <figure><img src="../../../assets/img/dummy/post-dummy04.jpg" alt="" /></figure>
                          <figure><img src="../../../assets/img/dummy/post-dummy05.jpg" alt="" /></figure>
                          <figure><img src="../../../assets/img/dummy/post-dummy03.jpg" alt="" /></figure>
                          <figure><img src="../../../assets/img/dummy/post-dummy04.jpg" alt="" /></figure>
                          <figure><img src="../../../assets/img/dummy/post-dummy05.jpg" alt="" /></figure>
                        </div>
                      </div>
  
                      <div className="p-article__pdf">
                        <div className="p-article__pdf__btn">
                          <a data-v-ade1d018="" className="btn-default btn-yellow btn-pdf btn-r8 btn-h52">
                            <span>PDFを確認する</span>
                          </a>
                        </div>
                        <button type="button" aria-label="お気に入り" data-tooltip="お気に入り" aria-pressed="false" className="icon a-icon like-icon icon-star icon-star-wrap a-icon-size_medium" style={{border:'1px solid #f0de00'}}></button>
                      </div>
                   
                      <p className="p-article__txt">{ meeting.text }</p>
                    </div>
                  </div>
                </article>
              </div>
            </div>
          </div>
        </div>
        <ModalConfirm 
          show={show} 
          message={"本当に削除しても\nよろしいでしょうか？"}
          handleClose={handleClose} 
          handleAccept={handleAccept} 
        />
        <ModalAlert 
          show={showAlert}
          message={messageAlert}
          type={typeAlert}
          handleClose={handleCloseAlert} 
        />
      </div>  
	)
}

export default MeetingDetail;