import React, { useEffect, useState } from 'react';
import ModalAlert from '../../component/modal_alert';
import ja from "date-fns/locale/ja";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
registerLocale("ja", ja);
import axios from 'axios';
import moment from 'moment';

const ChildEdit = (props) => {
  const [showAlert, setShowAlert] = useState(false);
  const [textColor, setTextColor] = useState(null);
  const [messageAlert, setMessageAlert] = useState(null);
  const [hireDate, setHireDate] = useState(null);
  const fatherId = document.getElementById('father_id').value;

  useEffect(() => {
    axios.get(`/api/children/detail/${props.match.params?.id}`, {params: { father_id: fatherId }}).then((response) => {
      if(response.data.status_code==200){
        if(response.data.params[0]?.father_relation?.hire_at) {
          let hire_at = moment(response.data.params[0]?.father_relation?.hire_at).toDate();
          setHireDate(hire_at);
        }
      } else if(response.data.status_code==400){
        //TODO
      }
    
    });
  }, []);

  async function handleClick() {
    try {
      const formdata = new FormData();
      formdata.append('father_id', fatherId);
      formdata.append('child_id', props.match.params?.id);
      formdata.append('hire_at', hireDate);
      axios.post(`/api/father-relations/updateHireDate/${props.match.params?.id}`, formdata)
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
  
  async function handleCloseAlert() {
    setShowAlert(false);
  };

	return (
    <div className="l-content">
      <div className="l-content-w560">
        <div className="l-content__ttl">
          <div className="l-content__ttl__left">
            <h2>入社日を変更</h2>
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
                    <label className="control-label" htmlFor="hireDate">入社日</label>
                    {/* <input type="text" name="hireDate" value="" className="input-default input-hiredate input-h60 input-w480" id="hireDate" />
                    <i className="icon icon-calendar"></i> */}
                    <div>
                    <DatePicker 
                      selected={hireDate} 
                      className="input-default input-hiredate input-h60 input-w480"
                      onChange={date => setHireDate(date)} 
                      dateFormat="yyyy/MM/dd"
                      locale="ja"
                      minDate={new Date()} 
                    />
                    </div>
                  </div>
                  
                  <button 
                    onClick={e => {
                      e.preventDefault();
                      handleClick();
                    }}
                    type="button" 
                    className="btn-edit btn-default btn-h70 btn-r14 btn-yellow">変更内容を保存する</button>
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

export default ChildEdit;