import React, { useEffect, useState } from 'react';
import Notification from '../../component/notification';

const ProfileWithdrawalComplete = () => {
	return (
    <div className="l-content">
      <div className="l-content-w560">
        <div className="l-content__ttl">
          <div className="l-content__ttl__left">
            <h2>退会完了</h2>
          </div>
          <Notification />
        </div>

        <div className="l-content-wrap">
          <section className="edit-container">
            <div className="edit-wrap">
              <div className="edit-content">

                <div className="edit-set-bg">
                  <p>退会完了しました。<br />今後とも、危機管理をよろしくお願いいたします。</p>
                </div>
                
                <div className="edit-txtLink">
                  <a href="/p-account">
                    <button type="button" className="a-icon txt-link">トップページへ戻る</button>
                  </a>  
                </div>

              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
	)
}

export default ProfileWithdrawalComplete;