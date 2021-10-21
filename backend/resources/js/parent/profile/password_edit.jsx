import React, { useEffect, useState } from 'react';
import Notification from '../../component/notification';
import ModalAlert from '../../component/modal_alert';

const ProfilePasswordEdit = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const fatherId = document.getElementById('father_id').value;
  const [showAlert, setShowAlert] = useState(false);
  const [messageAlert, setMessageAlert] = useState(null);
  const [textColor, setTextColor] = useState(null);

  const [errors, setErrors] = useState({
    confirmPassword:'',
    newPassword:'',
  })
  async function handleClick() {
    setErrors({
      confirmPassword: confirmPassword ? '' : 'error',
      newPassword: newPassword ? '' : 'error',
    });

    if(confirmPassword && newPassword) {
      try {
        const formdata = new FormData();
        formdata.append('father_id', fatherId);
        formdata.append('password', newPassword);
        formdata.append('password_confirmation', confirmPassword);
        axios.put(`/api/fathers/updatePassword/${fatherId}`, formdata)
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
    }
  }

  async function handleCloseAlert() {
    setShowAlert(false);
  };

	return (
    <div className="l-content">
      <div className="l-content-w560">
        <div className="l-content__ttl">
          <div className="l-content__ttl__left">
            <h2>パスワード編集</h2>
          </div>
          <Notification />
        </div>

        <div className="l-content-wrap">
          <section className="edit-container">
            <div className="edit-wrap">
              <div className="edit-content">

                <form action="" className="edit-form">
                  <div className="edit-set">
                    <label className="control-label" htmlFor="new_password">パスワード</label>
                    <input type="password" name="new_password" value={ newPassword } onChange={e=>setNewPassword(e.target.value)} 
                      className={`input-default input-new-password input-h60 input-w480 ${ errors['newPassword'] != '' && "validation_error"}`} id="new_password" />
                  </div>
                  <div className="edit-set">
                    <label className="control-label" htmlFor="confirm_password">確認用 新しいパスワード</label>
                    <input type="password" name="confirm_password" value={ confirmPassword } onChange={e=>setConfirmPassword(e.target.value)}
                      className={`input-default input-confirm-password input-h60 input-w480 ${ errors['newPassword'] != '' && "validation_error"}`} id="confirm_password" />
                  </div>
                  
                  <button 
                    type="button" 
                    onClick={e => {
                      e.preventDefault();
                      handleClick();
                    }}
                    className="btn-edit btn-default btn-h70 btn-r14 btn-yellow">パスワード更新</button>
                </form>

              </div>
            </div>
          </section>
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

export default ProfilePasswordEdit;