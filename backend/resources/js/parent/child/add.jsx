import React, { useEffect, useState } from 'react';
import Notification from '../../component/notification';
import Alert from '../../component/alert';


const ChildAdd = () => {
  const [_success, setSuccess] = useState('');
  const [identity, setIdentity] = useState('');
  const [textColor, setTextColor] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [messageAlert, setMessageAlert] = useState(null);
  const fatherId = document.getElementById('father_id').value;

  async function handleClick() {
    try {
      if(identity == '') {
        return;
      }
      const formdata = new FormData();
      formdata.append('identity', identity);
      formdata.append('father_id', fatherId);

      axios.post('/fathers/father-relations/register', formdata)
        .then(response => {
          if(response.data.status_code==200){
            // const formdata2 = new FormData();
            // formdata2.append('father_id ', fatherId);
            // axios.post('/api/children/registerTemporary', formdata2)
            //   .then(response2 => {
            //     if(response2.data.status_code==200){
            //     } 
            //   });
          } else if(response.data.status_code==400){
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
          <Notification />
        </div>

        <div className="l-content-wrap">
          <section className="edit-container">
            <div className="edit-wrap">
              <div className="edit-content">

                <form action="" className="edit-form">
                  <div className="edit-set">
                    <label className="control-label" htmlFor="tel">追加する子のIDを入力</label>
                    <input type="text" name="identity" onChange={e=>setIdentity(e.target.value)} value={identity} 
                      className="input-default input-tel input-h60 input-w480" id="identity" />
                  </div>
                  <button 
                    onClick={e => {
                      e.preventDefault();
                      handleClick();
                    }}
                    type="button" 
                    className="btn-edit btn-default btn-h70 btn-r14 btn-yellow">追加</button>
                </form>
                <div style={{color:"#0dcaf0",display:"flex", justifyContent:"center", alignItems:"center", paddingTop:10}} >
                  <a href="#">招待用URLをコピーする</a>
                </div>
                <div style={{color:"#0dcaf0",display:"flex", justifyContent:"center", alignItems:"center", paddingTop:10}}>
                  <a href="#">招待用URLをLINEで追信</a>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
      { _success && <Alert type="success">{_success}</Alert> }
    </div>
	)
}

export default ChildAdd;