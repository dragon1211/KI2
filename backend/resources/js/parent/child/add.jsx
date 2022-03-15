import React, { useRef, useState, useEffect, useContext } from 'react';
import { LoadingButton } from '@material-ui/lab';

import { HeaderContext } from '../../context';
import Alert from '../../component/alert';
import Notification from '../../component/notification';
import PageLoader from '../../component/page_loader';
import copy from 'copy-to-clipboard';


const ParentChildAdd = () => {
  const [notice, setNotice] = useState(-1);
  const father_id = localStorage.getItem('father_id');

  const [loaded, setLoaded] = useState(true);

  const [identity, setIdentity] = useState('');
  const [_success, setSuccess] = useState('');
  const [_400error, set400Error] = useState('');
  const [_401error, set401Error] = useState('');
  const [_422errors, set422Errors] = useState({identity: ''});
  const [submit, setSubmit] = useState(false);

  const isMountedRef = useRef(true);
  const { isAuthenticate } = useContext(HeaderContext);

  const inviteurl =  '「KIKI」の招待が届いています。' + '\n' +
  'まずは以下より仮登録を行ってください。' + '\n' +
  '※スマホ本体を最新の状態にアップデートしてからURLをクリックしてください。' + '\n\n' +
  document.getElementById('inviteurl').value + '\n\n' +
  '▼公式サイトはこちら' + '\n' +
  'https://kikikan.jp';

  const lineText =
      `「KIKI」の招待が届いています。%0Aまずは以下より仮登録を行ってください。
      %0A%0A※スマホ本体を最新の状態にアップデートしてからURLをクリックしてください。
      %0A%0A${document.getElementById('inviteurl_html').value}%0A%0A▼公式サイトはこちら%0A${document.getElementById('siteurl').value}`;

  useEffect(() => {
    isMountedRef.current = false;
    return()=>{
      isMountedRef.current = true;
    }
  }, [])

  const handleSubmit = (e) => {
      e.preventDefault();

      if(isAuthenticate()){
        set422Errors({identity: ''});
        set401Error('');
        const formdata = new FormData();
        formdata.append('identity', identity);
        formdata.append('father_id', father_id);
        setSubmit(true);
  
        axios.post('/api/fathers/relations/register', formdata)
        .then(response => {
          if(isMountedRef.current) return;
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
  }



  const handleCheckRelations = (type) => {

    if(isAuthenticate()){
      set401Error('');
      setLoaded(false);
  
      if(type == 'invite'){
        if(!copy(inviteurl, {debug: true})){
          set400Error('コピー失敗しました。');
          return;
        }
      }
  
      axios.get('/api/fathers/relations/check', {params:{father_id: father_id}})
      .then(response=>{
        if(isMountedRef.current) return;
  
        switch(response.data.status_code){
          case 200: {
            if(type == 'invite') setSuccess('コピー成功しました。');
            else if(type == 'line')
              window.location.href = `http://line.naver.jp/R/msg/text/?${lineText}`;
            break;
          }
          case 400: set400Error(response.data.error_messages); break;
          case 401: set401Error(response.data.error_messages); set400Error(response.data.error_messages); break;
        }
        setNotice(response.data.notice);
        setLoaded(true);
      })
      .catch(err=>console.log(err));
    }
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
        {
          !loaded &&  <PageLoader/>
        }
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
                  <a onClick={()=>handleCheckRelations('invite')}>招待用URLをコピーする</a>
                </div>
                <div style={{color:"#49A3FC",display:"flex", justifyContent:"center", alignItems:"center", paddingTop:20}}>
                  <a onClick={()=>handleCheckRelations('line')}>招待用URLをLINEで送信</a>
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
