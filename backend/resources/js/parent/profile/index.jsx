import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom'

const Profile = () => {
  const [child, setChild] = useState(null);
  const history = useHistory();
  useEffect(() => {
    axios.get('/api/children/detail/1', {params: { father_id: 1 }}).then((response) => {
      if(response.data.status_code==200){
        console.log(response.data.params[0]);
        setChild(response.data.params[0]);
      } else if(response.data.status_code==400){
        //TODO
      }
    
    });
  }, []);

  if (!child) return null;

	return (
    <div className="l-content">
      <div className="l-content-w560">
        <div className="l-content__ttl">
          <div className="l-content__ttl__left">
            <h2>プロフィール</h2>
          </div>
          <div className="p-notification">
            <div className="p-notification-icon">
              <div className="p-notification-icon-wrap">
                <div className="count">1</div>
                <div className="p-notification-icon-bg"></div>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22.742 19.855" className="icon svg-icon svg-fill svg-y50" >
                  <g fill="none" stroke="#080808" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" data-name="Icon feather-alert-triangle" transform="translate(0.777 0.75)">
                    <path d="M11.188,5.322,2.6,19.659A2.028,2.028,0,0,0,4.334,22.7H21.51a2.028,2.028,0,0,0,1.734-3.042L14.656,5.322a2.028,2.028,0,0,0-3.468,0Z" data-name="パス 3" transform="translate(-2.328 -4.346)"/>
                    <path d="M18,13.5v6.91" data-name="パス 4" transform="translate(-7.406 -8.547)"/><path d="M18,25.5h0" data-name="パス 5" transform="translate(-7.406 -11.2)"/>
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
                  <div className="profile-camera">
                    <label className="btn-default btn-camera btn-shadow">
                      <input id="profile-file" type="file" className="profile-thumb-img" />
                      <i className="icon icon-camera"></i>
                    </label>
                  </div>
                </div>
                <p className="profile-name">{ child.last_name }　{ child.first_name }</p>
                <div className="profile-info">
                  <div className="profile-info__item">
                    <p className="profile-info__icon">
                      <img src="../assets/img/icon/mail.svg" alt="メール" />
                    </p>
                    <p className="txt">{ child.email }</p>
                  </div>
                  <div className="profile-info__item">
                    <p className="profile-info__icon">
                      <img src="../assets/img/icon/phone.svg" alt="電話" />
                    </p>
                    <p className="txt">{ child.tel }</p>
                  </div>
                  <div className="profile-info__item">
                    <p className="txt">{ child.company }</p>
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
                  <button type="button" className="a-icon txt-link">ログアウト</button>
                </div>

                <div className="p-profile-txtLink">
                  <button type="button" className="a-icon txt-link">退会する</button>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
	)
}

export default Profile;