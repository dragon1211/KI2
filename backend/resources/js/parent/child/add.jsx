import React, { useEffect, useState } from 'react';
import { LoadingButton } from '@material-ui/lab';
import axios from 'axios';
import Alert from '../../component/alert';
import Notification from '../notification';
import copy from 'clipboard-copy';


const ChildAdd = () => {
  const [notice, setNotice] = useState(localStorage.getItem('notice'));
  const [identity, setIdentity] = useState('');

  const [_success, setSuccess] = useState('');
  const [_400error, set400Error] = useState('');
  const [_422errors, set422Errors] = useState({identity: ''});
  const [submit, setSubmit] = useState(false);
  const father_id = document.getElementById('father_id').value;

  const handleSubmit = (e) => {
      e.preventDefault();
      set422Errors({identity: ''});
      const formdata = new FormData();
      formdata.append('identity', identity);
      formdata.append('father_id', father_id);
      setSubmit(true);
      axios.post('/api/fathers/relations/register', formdata)
      .then(response => {
        setSubmit(false);
        setNotice(response.data.notice);
        switch(response.data.status_code){
          case 200: setSuccess(response.data.success_messages); break;
          case 400: set400Error(response.data.error_messages);  break;
          case 422: set422Errors(response.data.error_messages);  break;
        }
      });
  }

  const copyInviteURL = () => {
    const inviteText = "https://kikikan.xyz/c-account/register-temporary";
    copy(inviteText);
    setSuccess('招待用URLをコピーしました。');
  }

  const copyLineText = () => {
    const lineText = "「KIKI」の招待が届いています。%0Aまずは以下より仮登録を行ってください。%0Ahttps%3A%2F%2Fkikikan.jp%2Fregister-temporary%2Fc-account%0A%0A▼公式サイトはこちら%0Ahttps%3A%2F%2Fkikikan.jp";
    copy(lineText);
    setSuccess('招待用URLをLINEで追信しました。');
    window.open('http://line.me/R/msg/text/?'+lineText);
  }

	return (
    <div className="l-content">
      <div className="l-content-w560">
        <div className="l-content__ttl">
          <div className="l-content__ttl__left">
            <h2>子追加</h2>
          </div>
          <Notification  notice={notice}/>
        </div>

        <div className="l-content-wrap">
          <section className="edit-container">
            <div className="edit-wrap">
              <div className="edit-content">

                <form className="edit-form" onSubmit={handleSubmit}>
                  <div className="edit-set">
                    <label className="control-label" htmlFor="identify">追加する子のIDを入力</label>
                    <input type="text" 
                      name="identity"
                      id="identity" 
                      value={identity} 
                      onChange={e=>setIdentity(e.target.value)} 
                      className={`input-default input-title input-h60 input-w480 ${  _422errors.identity && 'is-invalid c-input__target'} `} />
                    {
                      _422errors.identity &&
                        <span className="l-alert__text--error ft-16 ft-md-14">
                            {_422errors.identity}
                        </span> 
                    }
                  </div>
                  <LoadingButton 
                      type="submit" fullWidth
                      loading={submit}
                      className="btn-edit btn-default btn-h75 bg-yellow rounded-20"
                      style={{marginTop:'50px'}}>
                      <span className={`ft-18 ft-xs-16 font-weight-bold ${!submit && 'text-black'}`}>追加</span>
                  </LoadingButton>
                </form>
                <div style={{color:"#49A3FC",display:"flex", justifyContent:"center", alignItems:"center", paddingTop:40}} >
                  <a onClick={copyInviteURL}>招待用URLをコピーする</a>
                </div>
                <div style={{color:"#49A3FC",display:"flex", justifyContent:"center", alignItems:"center", paddingTop:20}}>
                  <a onClick={copyLineText}>招待用URLをLINEで追信</a>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
      { _success && <Alert type="success" hide={()=>setSuccess('')}>{_success}</Alert> }
      { _400error && <Alert type="fail" hide={()=>set400Error('')}>{_400error}</Alert> }
    </div>
	)
}

export default ChildAdd;