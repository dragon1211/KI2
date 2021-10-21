import React, { useEffect, useState } from 'react';
import Notification from '../../component/notification';
import { useHistory } from 'react-router-dom'
const ProfileWithdrawal = () => {
  const history = useHistory();
  const fatherId = document.getElementById('father_id').value;
  async function handleClick() {
    try {
      axios.delete(`/api/fathers/delete/${fatherId}`)
        .then(response => {
          if(response.data.status_code == 200) {
            axios.delete(`/api/email-activations/deleteRelationFather/${fatherId}`)
              .then(response => {
                if(response.data.status_code == 200) {
                } else {
                }
              });

            axios.delete(`/api/father-relations/deleteRelationFather/${fatherId}`)
              .then(response => {
                if(response.data.status_code == 200){
                } else {
                }
              });

            axios.delete(`/api/meetings/deleteRelationFather/${fatherId}`)
              .then(response => {
                if(response.data.status_code == 200){
                } else {
                }
              });
          } 
        });
        
      history.push({
        pathname: '/p-account/profile/withdrawal/complete',
        state: {}
      });
    } catch (error) {
      console.log('error', error);
    }
  }

	return (
    <div className="l-content">
      <div className="l-content-w560">
        <div className="l-content__ttl">
          <div className="l-content__ttl__left">
            <h2>退会確認</h2>
          </div>
          <Notification />
        </div>

        <div className="l-content-wrap">
          <section className="edit-container">
            <div className="edit-wrap">
              <div className="edit-content">

                <form action="" className="edit-form">
                  <div className="edit-set-bg">
                    <p>本当に退会してもよろしいでしょうか？</p>
                  </div>
                  
                  <button 
                    onClick={e => {
                      e.preventDefault();
                      handleClick();
                     
                    }}
                    type="button" className="btn-edit btn-default btn-h70 btn-r14 btn-yellow">退会する</button>
                </form>

              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
	)
}

export default ProfileWithdrawal;