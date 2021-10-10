import React, { useEffect, useState } from 'react';

const ProfileEdit = () => {
	return (
    <div className="l-content">
      <div className="l-content-w560">
        <div className="l-content__ttl">
          <div className="l-content__ttl__left">
            <h2>プロフィール編集</h2>
          </div>
          <div className="p-notification">
            <div className="p-notification-icon">
              <div className="p-notification-icon-wrap">
                <div className="count">1</div>
                <div className="p-notification-icon-bg"></div>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22.742 19.855" className="icon svg-icon svg-fill svg-y50" ><g fill="none" stroke="#080808" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" data-name="Icon feather-alert-triangle" transform="translate(0.777 0.75)"><path d="M11.188,5.322,2.6,19.659A2.028,2.028,0,0,0,4.334,22.7H21.51a2.028,2.028,0,0,0,1.734-3.042L14.656,5.322a2.028,2.028,0,0,0-3.468,0Z" data-name="パス 3" transform="translate(-2.328 -4.346)"/><path d="M18,13.5v6.91" data-name="パス 4" transform="translate(-7.406 -8.547)"/><path d="M18,25.5h0" data-name="パス 5" transform="translate(-7.406 -11.2)"/></g></svg>
              </div>
            </div>
          </div>
        </div>

        <div className="l-content-wrap">
          <div className="edit-container">
            <div className="edit-wrap">
              <div className="edit-content">

                <form action="" className="edit-form">
                  <div className="edit-set">
                    <label className="control-label" htmlFor="nameSei">姓</label>
                    <input type="text" name="nameSei" value="" className="input-default input-nameSei input-h60 input-w480" id="nameSei" />
                  </div>
                  <div className="edit-set">
                    <label className="control-label" htmlFor="nameMei">名</label>
                    <input type="text" name="nameMei" value="" className="input-default input-nameMei input-h60 input-w480" id="nameMei" />
                  </div>
                  <div className="edit-set">
                    <label className="control-label" htmlFor="mail">メールアドレス</label>
                    <input type="email" name="mail" value="" className="input-default input-mail input-h60 input-w480" id="mail" />
                  </div>
                  <div className="edit-set">
                    <label className="control-label" htmlFor="tel">電話番号</label>
                    <input type="tel" name="tel" value="" className="input-default input-tel input-h60 input-w480" id="tel" />
                  </div>
                  <div className="edit-set">
                    <label className="control-label" htmlFor="profile_textarea">プロフィール</label>
                    <textarea name="data[UserProfile][description]" rows="8" className="textarea-default" id="profile_textarea"></textarea>
                  </div>
                  
                  <button type="button" className="btn-edit btn-default btn-h70 btn-r14 btn-yellow">プロフィール更新</button>
                </form>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
	)
}

export default ProfileEdit;