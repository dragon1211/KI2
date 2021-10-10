import React, { useEffect, useState } from 'react';
import ModalAlert from '../../component/modal_alert';

const ChildAdd = () => {
  const [tel, setTel] = useState('');
  const [textColor, setTextColor] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [messageAlert, setMessageAlert] = useState(null);

  async function handleClick() {
    try {
      if(tel == '') {
        return;
      }
      const formdata = new FormData();
      formdata.append('tel', tel);

      axios.post('/api/children/checkTel', formdata)
        .then(response => {
          if(response.data.status_code==201){
            const formdata2 = new FormData();
            formdata2.append('father_id ', 1);
            axios.post('/api/children/registerTemporary', formdata2)
              .then(response2 => {
                if(response2.data.status_code==200){
                  const formdata3 = new FormData();
                  formdata3.append('send_id ', 1);
                  formdata3.append('receive_id', tel);
                  formdata3.append('message', "危機管理アプリに招待URLが届きました。1時間以内に、URLから本登録を行ってください。https://○○○.com/register/c-account/{token}'");
                  axios.post('/api/smss/register', formdata3)
                    .then(response3 => {
                      if(response3.data.status_code==200){
                        setMessageAlert(response.data.success_messages);
                        setTextColor("black");
                      } 
                    });
                } 
              });
          } else if(response.data.status_code==200){
            formdata.append('father_id', 1);
            axios.post('/api//father-relations/register', formdata)
              .then(response => {
                if(response.data.status_code==200){
                  setMessageAlert(response.data.success_messages);
                  setTextColor("black");
                } else {
                  setMessageAlert(response.data.success_messages);
                }
              });
          }
        });
    } catch (error) {
      console.log('error', error);
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
            <h2>子追加</h2>
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
          <section className="edit-container">
            <div className="edit-wrap">
              <div className="edit-content">

                <form action="" className="edit-form">
                  <div className="edit-set">
                    <label className="control-label" htmlFor="tel">追加する子の電話番号を入力</label>
                    <input type="tel" name="tel" onChange={e=>setTel(e.target.value)} value={tel} className="input-default input-tel input-h60 input-w480" id="tel" />
                  </div>
                  <button 
                    onClick={e => {
                      e.preventDefault();
                      handleClick();
                    }}
                    type="button" 
                    className="btn-edit btn-default btn-h70 btn-r14 btn-yellow">追加 or 招待</button>
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

export default ChildAdd;