import React, { useEffect, useState } from 'react';
import moment from 'moment';
import axios from 'axios';
import ModalConfirm from '../../component/modal_confirm';
import { useHistory } from 'react-router-dom';
import Alert from '../../component/alert';

const ChildDetail = (props) => {
  const [_success, setSuccess] = useState('');
  const [child, setChild] = useState(null);
  const [show, setShow] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [messageAlert, setMessageAlert] = useState(null);
  const fatherId = document.getElementById('father_id').value;
  const history = useHistory();

  useEffect(() => {
    axios.get(`/api/children/detail/${props.match.params?.id}`, {params: { father_id: fatherId }}).then((response) => {
      if(response.data.status_code==200){
        console.log(response.data.params[0]);
        setChild(response.data.params[0]);
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
      axios.delete(`/api/children/delete/${props.match.params?.id}`)
        .then(response => {
          if(response.data.status_code == 200){
            // setMessageAlert("子の削除に成功しました！");
            history.push({
              pathname: "/p-account/child",
              state: {message : "子の削除に成功しました！"}
            });
          } else {
            setMessageAlert("子の削除に失敗しました。");
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

  if (!child) return null;

	return (
    <div className="l-content">
      <div className="l-content-w560">
        <div className="l-content__ttl">
          <div className="l-content__ttl__left">
            <h2>子詳細</h2>
          </div>
          <div className="p-notification">
            <div className="p-notification-icon">
              <div className="p-notification-icon-wrap">
                <div className="count">1</div>
                <div className="p-notification-icon-bg"></div>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22.742 19.855" className="icon svg-icon svg-fill svg-y50" >
                  <g fill="none" stroke="#080808" strokeLinecap="round" strokeLinejoin="round"  data-name="Icon feather-alert-triangle" transform="translate(0.777 0.75)">
                    <path d="M11.188,5.322,2.6,19.659A2.028,2.028,0,0,0,4.334,22.7H21.51a2.028,2.028,0,0,0,1.734-3.042L14.656,5.322a2.028,2.028,0,0,0-3.468,0Z" data-name="パス 3" transform="translate(-2.328 -4.346)"/>
                    <path d="M18,13.5v6.91" data-name="パス 4" transform="translate(-7.406 -8.547)"/>
                    <path d="M18,25.5h0" data-name="パス 5" transform="translate(-7.406 -11.2)"/>
                  </g>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="l-content-wrap">
          <div className="profile-container">
            <div className="profile-wrap">
              <div className="profile-content">
                <div className="profile-thumb">
                  {/* <label> */}
                    <input id="profile-file" type="file" className="profile-thumb-img" />
                    <img src={ child.image } id="profile-file-preview" className="profile-thumb__image" alt="" />
                  {/* </label> */}
                </div>
                <p className="profile-name">{ child.last_name }　{ child.first_name }</p>
                <div className="profile-info">
                  <div className="profile-info__item">
                    <p className="profile-info__icon">
                      <img src="../../../assets/img/icon/mail.svg" alt="メール" />
                    </p>
                    <p className="txt"><a href={"mailto:" + child.email}>{ child.email }</a></p>
                  </div>
                  <div className="profile-info__item">
                    <p className="profile-info__icon">
                      <img src="../../../assets/img/icon/phone.svg" alt="電話" />
                    </p>
                    <p className="txt"><a href={"tel:" + child.tel}>{ child.tel }</a></p>
                  </div>
                  <div className="profile-info__item">
                    <p className="profile-info__icon">
                      <img src="../../../assets/img/icon/building.svg" alt="会社名" />
                    </p>
                    <p className="txt">{ child.company }</p>
                  </div>
                  <div className="profile-info__item">
                    <p className="profile-info__icon">
                      <img src="../../../assets/img/icon/calendar.svg" alt="日付" />
                    </p>
                    <p className="txt">{ moment(child.father_relation?.hire_at).format('YYYY/MM/DD HH:mm') || '' }</p>
                  </div>
                </div>

                <div className="p-profile-btn">
                  <a 
                    onClick={e => {
                      e.preventDefault();
                      history.push({
                        pathname: `/p-account/child/edit/hire-date/${props.match.params?.id}`,
                        state: {}
                      });
                    }}
                    data-v-ade1d018="" 
                    className="btn-default btn-yellow btn-profile btn-r8 btn-h52">
                      <span>入社日を変更</span>
                  </a>
                </div>

                <div className="p-profile-txtLink">
                  <button type="button"  onClick={showModal} className="a-icon txt-link">削除する</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ModalConfirm 
        show={show} 
        message={"全てのミーティングの情報から \n 消えますがよろしいでしょうか。"}
        handleClose={handleClose} 
        handleAccept={handleAccept} 
      />
      { _success && <Alert type="success">{_success}</Alert> }
    </div>
	)
}

export default ChildDetail;