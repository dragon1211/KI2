import React, { useState } from 'react';
import { LoadingButton } from '@material-ui/lab';
import Alert from '../../component/alert';
import Notification from '../../component/notification';
import copy from 'clipboard-copy';


const ParentChildAdd = () => {
  const [notice, setNotice] = useState(localStorage.getItem('notice'));
  const father_id = localStorage.getItem('kiki_acc_id');
  
  const [identity, setIdentity] = useState('');

  const [_success, setSuccess] = useState('');
  const [_400error, set400Error] = useState('');
  const [_401error, set401Error] = useState('');
  const [_422errors, set422Errors] = useState({identity: ''});
  const [submit, setSubmit] = useState(false);

  const handleSubmit = async (e) => {
      e.preventDefault();
      set422Errors({identity: ''});
      set401Error('');
      const formdata = new FormData();
      formdata.append('identity', identity);
      formdata.append('father_id', father_id);
      setSubmit(true);

      await axios.post('/api/fathers/relations/register', formdata)
        .then(response => {
          setSubmit(false);
          setNotice(response.data.notice);
          switch(response.data.status_code){
            case 200: setSuccess(response.data.success_messages); break;
            case 400: set400Error(response.data.error_messages);  break;
            case 401: set401Error(response.data.error_messages); set400Error(response.data.error_messages);  break;
            case 422: window.scrollTo(0, 0); set422Errors(response.data.error_messages);  break;
          }
        });
  }

  const copyInviteURL = () => {
    const inviteText = document.getElementById('inviteurl').value;
    copy(inviteText);
    setSuccess('招待用URLをコピーしました。');
  }

  const copyLineText = () => {
    const inviteUrl = document.getElementById('inviteurl_html').value;
    const siteUrl = document.getElementById('siteurl').value;
    const lineText = `「KIKI」の招待が届いています。%0Aまずは以下より仮登録を行ってください。%0A%0A※スマホ本体を最新の状態にアップデートしてからURLをクリックしてください。%0A%0A${inviteUrl}%0A%0A▼公式サイトはこちら%0A${siteUrl}`;
    setSuccess('招待用URLをLINEで追信しました。');
    location.href = 'http://line.me/R/msg/text/?'+lineText;
  }

  const contactMailText = 'mailto:56@zotman.jp?subject=KIKIメンバー追加について&body='+
                          '名前%3A%0A電話番号%3A%0AログインID%3A%0Aログインパスワード%3A%0A追加したいメンバー数%3A%0A「その他お問合せ内容」'

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
                {
                  _401error &&
                  <span className="mb-40-px l-alert__text--error ft-18 ft-md-16 ">
                      追加する場合は<a href={contactMailText} target='_blank' style={{ color:'#4CA6FF', textDecoration:'initial !important' }}>こちらよりお問い合わせ</a>お願いします。
                  </span>
                }
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

export default ParentChildAdd;
