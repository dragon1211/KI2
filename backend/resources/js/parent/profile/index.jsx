import React, { useEffect, useState } from 'react';
import Notification from '../../component/notification';
import ModalAlert from '../../component/modal_alert';
import axios from 'axios';
import { useHistory } from 'react-router-dom'

const Profile = () => {
  const [father, setFather] = useState(null);
  const history = useHistory();
  const fatherId = document.getElementById('father_id').value;
  const [image, setImage] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [messageAlert, setMessageAlert] = useState(null);
  const [textColor, setTextColor] = useState(null);
  
  useEffect(() => {
    axios.get(`/api/fathers/detail/${fatherId}`).then((response) => {
      if(response.data.status_code==200){
        //console.log(response.data.params[0]);
        setFather(response.data.params[0]);
        setImage(response.data.params[0]?.image);
      } else if(response.data.status_code==400){
        //TODO
      }
    
    });
  }, []);

  if (!father) return null;

  const handleImageChange = (e) => {
    e.preventDefault();
    let reader = new FileReader();
    let _file = e.target.files[0];
    reader.readAsDataURL(_file);
    reader.onloadend = () => {
        setImage(reader.result);
    };

    //upload image
    try {
      const formdata = new FormData();
      formdata.append('father_id', fatherId);
      formdata.append('image', _file);
      axios.put("/api/fathers/updateImage", formdata)
        .then(response => {
          if(response.data.status_code == 200){
            setMessageAlert(response.data.success_messages);
            setTextColor("black");
          } else {
            setMessageAlert(response.data.success_messages);
          }
          setShowAlert(true);
        });
    } catch (error) {
      console.log('error', error);
    }
  };

  async function handleCloseAlert() {
    setShowAlert(false);
  };

	return (
    <div className="l-content">
      <div className="l-content-w560">
        <div className="l-content__ttl">
          <div className="l-content__ttl__left">
            <h2>プロフィール</h2>
          </div>
          <Notification />
        </div>

        <div className="l-content-wrap">
          <div className="profile-container">
            <div className="profile-wrap">
              <div className="profile-content">
                <div className="profile-thumb">
                  {/* <label> */}
                    {/* <input id="profile-file" type="file" className="profile-thumb-img" onChange={(e) => handleImageChange(e)} /> */}
                    <img src={ image } id="profile-file-preview" className="profile-thumb__image" alt="" />
                  {/* </label> */}
                  <div className="profile-camera">
                    <label className="btn-default btn-camera btn-shadow">
                      <input id="profile-file" type="file" className="profile-thumb-img"  accept=".png, .jpg, .jpeg" onChange={(e) => handleImageChange(e)} />
                      <i className="icon icon-camera"></i>
                    </label>
                  </div>
                </div>
                <p className="profile-name">{ father.last_name }　{ father.first_name }</p>
                <div className="profile-info">
                  <div className="profile-info__item">
                    <p className="profile-info__icon">
                      <img src="/assets/img/icon/mail.svg" alt="メール" />
                    </p>
                    <p className="txt">{ father.email }</p>
                  </div>
                  <div className="profile-info__item">
                    <p className="profile-info__icon">
                      <img src="/assets/img/icon/phone.svg" alt="電話" />
                    </p>
                    <p className="txt">{ father.tel }</p>
                  </div>
                  <div className="profile-info__item">
                    <p className="profile-info__icon">
                      <img src="/assets/img/icon/building.svg" alt="会社名"/>
                    </p>
                    <p className="txt">{ father.company }</p>
                  </div>
                </div>
                <div className="p-profile-btn">
                  <a 
                    onClick={e => {
                      e.preventDefault();
                      history.push({
                        pathname: '/p-account/profile/edit/1',
                        state: {}
                      });
                    }}
                    data-v-ade1d018="" 
                    className="btn-default btn-yellow btn-profile btn-r8 btn-h52">
                      <span>プロフィールを変更する</span>
                  </a>
                </div>

                <div className="p-profile-btn">
                  <a 
                    onClick={e => {
                      e.preventDefault();
                      history.push({
                        pathname: '/p-account/profile/edit/password/1',
                        state: {}
                      });
                    }}
                    data-v-ade1d018="" 
                    className="btn-default btn-yellow btn-password btn-r8 btn-h52">
                      <span>パスワードを変更する</span>
                  </a>
                </div>

                <div className="p-profile-txtLink">
                  <a href="/login/p-account">
                    <button type="button" className="a-icon txt-link">ログアウト</button>
                  </a>
                </div>

                <div className="p-profile-txtLink">
                  <button 
                    onClick={e => {
                      e.preventDefault();
                      history.push({
                        pathname: '/p-account/profile/withdrawal',
                        state: {}
                      });
                    }}
                    type="button" className="a-icon txt-link">退会する</button>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
      <ModalAlert 
        show={showAlert}
        message={messageAlert}
        textColor={textColor}
        handleClose={handleCloseAlert} 
      />
    </div>
	)
}

export default Profile;