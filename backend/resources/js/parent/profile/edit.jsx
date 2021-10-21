import React, { useEffect, useState } from 'react';
import Notification from '../../component/notification';
import ModalAlert from '../../component/modal_alert';

const ProfileEdit = () => {
  const [father, setFather] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [tel, setTel] = useState('');
  const [profile, setProfile] = useState('');
  const fatherId = document.getElementById('father_id').value;
  const [showAlert, setShowAlert] = useState(false);
  const [messageAlert, setMessageAlert] = useState(null);
  const [textColor, setTextColor] = useState(null);

  const [errors, setErrors] = useState({
      firstName:'',
      lastName:'',
      email:'',
      tel:'',
      profile:''
  })

  useEffect(() => {
    axios.get(`/api/fathers/detail/${fatherId}`).then((response) => {
      if(response.data.status_code==200) {
        console.log(response.data.params[0]);
        setFather(response.data.params[0]);
        setEmail(response.data.params[0]?.email);
        setTel(response.data.params[0]?.tel);
        setProfile(response.data.params[0]?.profile);
      } else if(response.data.status_code==400){
        //TODO
      }
    
    });
  }, []);

  async function handleClick() {
    setErrors({
      firstName:'',
      lastName:'',
      email: email ? '' : 'error',
      tel: tel ? '' : 'error',
      profile:''
    });

    if(email && tel) {
      try {
        const formdata = new FormData();
        formdata.append('father_id', fatherId);
        formdata.append('first_name', firstName);
        formdata.append('last_name', lastName);
        formdata.append('email', email);
        formdata.append('tel', tel);
        formdata.append('profile', profile);
        axios.put(`/api/fathers/updateProfile/${fatherId}`, formdata)
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
            <h2>プロフィール編集</h2>
          </div>
          <Notification />
        </div>

        <div className="l-content-wrap">
          <div className="edit-container">
            <div className="edit-wrap">
              <div className="edit-content">

                <form action="" className="edit-form">
                  <div className="edit-set">
                    <label className="control-label" htmlFor="nameSei">姓</label>
                    <input type="text" name="nameSei" value={ lastName } onChange={e=>setLastName(e.target.value)} 
                      className={`input-default input-nameSei input-h60 input-w480 ${ errors['firstName'] != '' && "validation_error"}`} id="nameSei" />
                  </div>
                  <div className="edit-set">
                    <label className="control-label" htmlFor="nameMei">名</label>
                    <input type="text" name="nameMei" value={ firstName } onChange={e=>setFirstName(e.target.value)} 
                      className={`input-default input-nameMei input-h60 input-w480 ${ errors['lastName'] != '' && "validation_error"}`} id="nameMei" />
                  </div>
                  <div className="edit-set">
                    <label className="control-label" htmlFor="mail">メールアドレス</label>
                    <input type="email" name="mail" value={ email } onChange={e=>setEmail(e.target.value)} 
                      className={`input-default input-mail input-h60 input-w480 ${ errors['email'] != '' && "validation_error"}`} id="mail" />
                  </div>
                  <div className="edit-set">
                    <label className="control-label" htmlFor="tel">電話番号</label>
                    <input type="tel" name="tel" value={ tel } onChange={e=>setTel(e.target.value)} 
                      className={`input-default input-tel input-h60 input-w480 ${ errors['tel'] != '' && "validation_error"}`} id="tel" />
                  </div>
                  <div className="edit-set">
                    <label className="control-label" htmlFor="profile_textarea">プロフィール</label>
                    <textarea name="profile" value={ profile } onChange={e=>setProfile(e.target.value)} rows="8" 
                      className={`textarea-default ${ errors['profile'] != '' && "validation_error"}`} id="profile_textarea" />
                  </div>
                  
                  <button 
                    type="button" 
                    onClick={e => {
                      e.preventDefault();
                      handleClick();
                    }}
                    className="btn-edit btn-default btn-h70 btn-r14 btn-yellow">プロフィール更新</button>
                </form>

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

export default ProfileEdit;