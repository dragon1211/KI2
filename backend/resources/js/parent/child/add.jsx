import React, { useRef, useState, useEffect } from 'react';
import { LoadingButton } from '@material-ui/lab';
import Alert from '../../component/alert';
import Notification from '../../component/notification';
import PageLoader from '../../component/page_loader';
import copy from 'copy-to-clipboard';
import {
  Box,
  Dialog,
  DialogTitle,
  Slide,
  Typography
} from '@mui/material';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});


const LineModal = ({ show, handleClose }) => {

  const inviteurl =  '「KIKI」の招待が届いています。' + '\n' +
  'まずは以下より仮登録を行ってください。' + '\n' +
  '※スマホ本体を最新の状態にアップデートしてからURLをクリックしてください。' + '\n\n' +
  document.getElementById('inviteurl').value + '\n\n' +
  '▼公式サイトはこちら' + '\n' +
  'https://kikikan.jp';

  const inviteUrl = document.getElementById('inviteurl_html').value;
  const siteUrl = document.getElementById('siteurl').value;
  const lineText =
      `「KIKI」の招待が届いています。%0Aまずは以下より仮登録を行ってください。
      %0A%0A※スマホ本体を最新の状態にアップデートしてからURLをクリックしてください。
      %0A%0A${inviteUrl}%0A%0A▼公式サイトはこちら%0A${siteUrl}`;

  const [_success, setSuccess] = useState('');
  const [_400error, set400Error] = useState('');

  const copyInviteURL = () => {
    if(copy(inviteurl, {debug: true}))
    {
      setSuccess('招待用URLをコピーしました。');
    } else {
      set400Error('コピー失敗しました。');
    }
  }

	return (
    <Dialog
      open={show}
      TransitionComponent={Transition}
      keepMounted
      aria-describedby="alert-dialog-slide-description"
      onClose={()=>{
        setSuccess('');
        set400Error('');
        handleClose();
      }}
    >
      <DialogTitle sx={{padding:'20px 10px',textAlign:'center', borderBottom:'1px solid rgb(239 236 236)'}}>
          <span className="ft-16 text-center font-weight-bold">招待用URL</span>
      </DialogTitle>
      <Box sx={{ p:'10px', pb:'10px'}}>
          <Typography component='p' sx={{ minHeight:'175px', whiteSpace:'pre-wrap', bgcolor:'#F0F0F0', p:'10px' }} className="ft-14 text-black">
              {inviteurl}
          </Typography>
      </Box>
      <Box sx={{ p:'10px', pt:'0px' }}>
        <ul className="invite-btn__wrapper">
          <li><a className="copy-btn" onClick={copyInviteURL}>コピー</a></li>
          <li><a className="line-btn" href={`http://line.naver.jp/R/msg/text/?${lineText}`}>送信</a></li>
        </ul>
      </Box>
      { _success && <Alert type="success" hide={()=>setSuccess('')}>{_success}</Alert> }
      { _400error && <Alert type="fail" hide={()=>set400Error('')}>{_400error}</Alert> }
    </Dialog>
	)
}


const ParentChildAdd = () => {
  const [notice, setNotice] = useState(localStorage.getItem('notice'));
  const father_id = localStorage.getItem('kiki_acc_id');

  const [loaded, setLoaded] = useState(true);

  const [identity, setIdentity] = useState('');
  const [_success, setSuccess] = useState('');
  const [_400error, set400Error] = useState('');
  const [_401error, set401Error] = useState('');
  const [_422errors, set422Errors] = useState({identity: ''});
  const [submit, setSubmit] = useState(false);

  const [_copyFlag, setCopyFlag] = useState(false);
  const [show_lineModal, setShowLineModal] = useState(false);

  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = false;
    return()=>{
      isMountedRef.current = true;
    }
  }, [])

  const handleSubmit = (e) => {
      e.preventDefault();
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



  const handleCheckRelations = () => {
    set401Error('');
    setLoaded(false);
    axios.get('/api/fathers/relations/check')
    .then(response=>{
      if(isMountedRef.current) return;

      switch(response.data.status_code){
        case 200: {
          setShowLineModal(true);
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
                  <a onClick={()=>handleCheckRelations()}>招待用URLをコピーする</a>
                </div>
                <div style={{color:"#49A3FC",display:"flex", justifyContent:"center", alignItems:"center", paddingTop:20}}>
                  <a onClick={()=>handleCheckRelations()}>招待用URLをLINEで送信</a>
                </div>
              </div>
            </div>
          </section>
          <LineModal
            show={show_lineModal}
            handleClose={()=>setShowLineModal(false)}
          />
        </div>
      </div>
      { _success && <Alert type="success" hide={()=>setSuccess('')}>{_success}</Alert> }
      { _400error && <Alert type="fail" hide={()=>set400Error('')}>{_400error}</Alert> }
    </div>
	)
}

export default ParentChildAdd;
