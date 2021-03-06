import { useRef, useEffect, useState, useContext } from 'react';
import { LoadingButton } from '@material-ui/lab';

import { HeaderContext } from '../../context';
import Notification from '../../component/notification';
import Alert from '../../component/alert';
import PageLoader from '../../component/page_loader';
import { useNavigate } from 'react-router-dom';

const ParentProfileEdit = () => {

  const navigator = useNavigate();
  const { isAuthenticate } = useContext(HeaderContext);

  const father_id = localStorage.getItem('father_id');
  const [notice, setNotice] = useState(-1);

  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [tel, setTel] = useState('');
  const [profile, setProfile] = useState('');
  const [params, setParams] = useState(null);

  const [_success, setSuccess] = useState('');
  const [_400error, set400Error] = useState('');
  const [_404error, set404Error] = useState('');
  const [_422errors, set422Errors] = useState({
    company: '',
    email:'',
    tel:'',
    profile:''
  })
  const [loaded, setLoaded] = useState(false);
  const [submit, setSubmit] = useState(false);

  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = false;
    if(isAuthenticate()){
      setLoaded(false);
      axios.get(`/api/fathers/detail/${father_id}`)
        .then(response => {
          if(isMountedRef.current) return;
  
          setLoaded(true);
          setNotice(response.data.notice);
          if(response.data.status_code==200) {
            setParams(response.data.params);
            setCompany(response.data.params?.company);
            setEmail(response.data.params?.email);
            setTel(response.data.params?.tel);
            setProfile(response.data.params.profile ? response.data.params.profile: '');
          }
          else {
            set400Error("失敗しました。");
          } 
        })
        .catch(err=>{
          if(isMountedRef.current) return;
  
          setLoaded(true);
          setNotice(err.response.data.notice);
          if(err.response.status==404){
              set404Error(err.response.data.message);
          }
        })
    }
    return () => {
      isMountedRef.current = true;
    }
  }, []);


  const handleSubmit = (e) => {
    e.preventDefault();
    if(isAuthenticate()){
      set422Errors({ company:'', email: '',  tel: '',  profile:'' });
      const request = {
        company: company,
        email: email,
        tel: tel,
        profile: profile
      }
      setSubmit(true);
      axios.put(`/api/fathers/updateProfile/${father_id}`, request)
      .then(response => {
        if(isMountedRef.current) return;
        
        setNotice(response.data.notice);
        setSubmit(false);
        switch(response.data.status_code){
          case 200:{
            navigator('/p-account/profile', { state: response.data.success_messages });
            break;
          } 
          case 400: set400Error(response.data.error_messages); break;
          case 422: window.scrollTo(0, 0); set422Errors(response.data.error_messages); break;
        }
      });
    }
  }

  
	return (
    <div className="l-content">
      <div className="l-content-w560">
        <div className="l-content__ttl">
          <div className="l-content__ttl__left">
            <h2>プロフィール編集</h2>
          </div>
          <Notification notice={notice}/>
        </div>

        <div className="l-content-wrap">
          <section className="edit-container">
          {
            !loaded && <PageLoader/>
          }
          {
            loaded && params &&
            <div className="edit-wrap">
              <div className="edit-content">
                <form className="edit-form" onSubmit={handleSubmit}>

                  <div className="edit-set">
                    <label className="control-label" htmlFor="nameSei">会社名</label>
                    <input type="text" name="nameSei" value={ company } onChange={e=>setCompany(e.target.value)} 
                      className={`input-default input-nameSei input-h60 input-w480 ${ _422errors.company && "is-invalid c-input__target" }`} id="company" />
                    {
                      _422errors.company &&
                          <span className="l-alert__text--error ft-16 ft-md-14">
                              { _422errors.company }
                          </span>
                    }
                  </div>

                  <div className="edit-set">
                    <label className="control-label" htmlFor="mail">メールアドレス</label>
                    <input type="email" name="mail" value={ email } onChange={e=>setEmail(e.target.value)} 
                      className={`input-default input-mail input-h60 input-w480 ${ _422errors.email && "is-invalid c-input__target" } `} id="mail" />
                    {
                      _422errors.email &&
                          <span className="l-alert__text--error ft-16 ft-md-14">
                              { _422errors.email }
                          </span>
                    }
                  </div>

                  <div className="edit-set">
                    <label className="control-label" htmlFor="tel">電話番号</label>
                    <input type="tel" name="tel" value={ tel } onChange={e=>setTel(e.target.value)} 
                      className={`input-default input-tel input-h60 input-w480 ${ _422errors.tel && "is-invalid c-input__target" } `} id="tel" />
                    {
                      _422errors.tel &&
                          <span className="l-alert__text--error ft-16 ft-md-14">
                              { _422errors.tel }
                          </span>
                    }
                  </div>

                  <div className="edit-set">
                    <label className="control-label" htmlFor="profile_textarea">プロフィール</label>
                    <textarea name="profile" value={ profile } onChange={e=>setProfile(e.target.value)} rows="8" 
                      className={`textarea-default ${ _422errors.profile && "is-invalid c-input__target" } `} id="profile_textarea" />
                    {
                      _422errors.profile &&
                          <span className="l-alert__text--error ft-16 ft-md-14">
                              { _422errors.profile }
                          </span>
                    }
                  </div>
                  
                  <LoadingButton type="submit" 
                    loading={submit} 
                    fullWidth 
                    className="btn-edit btn-default btn-h75 bg-yellow rounded-20"> 
                    <span className={`ft-16 font-weight-bold ${!submit && 'text-black'}`}>
                        プロフィールを更新
                    </span> 
                  </LoadingButton>

                </form>
              </div>
            </div>
          }
          { _400error && <Alert type="fail" hide={()=>set400Error('')}>{_400error}</Alert> } 
          { _success && <Alert type="success" hide={()=>setSuccess('') }>{_success}</Alert> }
          { _404error && 
              <Alert type="fail" hide={()=>{
                  set404Error('');
                  navigator('/p-account/profile', { state: ''});
              }}>
              {_404error}
              </Alert>
          }
          </section>
        </div>
      </div>
    </div>
	)
}

export default ParentProfileEdit;