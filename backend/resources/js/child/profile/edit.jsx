import React, { useRef, useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoadingButton } from '@material-ui/lab';

import { HeaderContext } from '../../context';
import Notification from '../../component/notification';
import Alert from '../../component/alert';
import PageLoader from '../../component/page_loader';


const ChildProfileEdit = () => {

    const { isAuthenticate } = useContext(HeaderContext);
    const navigator = useNavigate();

    const child_id = localStorage.getItem('child_id');
    const [notice, setNotice] = useState(-1);

    const [first_name, setFirstName] = useState('');
    const [last_name, setLastName] = useState('');  
    const [identity, setIdentity] = useState('');  
    const [email, setEmail] = useState('');
    const [tel, setTel] = useState('');
    const [company, setCompany] = useState('');
    const [profile, setProfile] = useState(null);

    const [_422errors, set422Errors] = useState({
        first_name:'',
        last_name:'',
        identity:'',
        email:'',
        tel:'',
        company:''
    })
    const [_success, setSuccess] = useState('');
    const [_400error, set400Error] = useState('');
    const [_404error, set404Error] = useState('');

    const [submit, setSubmit] = useState(false);
    const [loaded, setLoaded] = useState(false);

    const isMountedRef = useRef(true);
    

    useEffect(() => {
        isMountedRef.current = false;
        if(isAuthenticate()){
            setLoaded(false);
    
            axios.get('/api/children/detail/'+child_id)
            .then(response => {
                if(isMountedRef.current) return;
                
                setLoaded(true);
                setNotice(response.data.notice);
                if(response.data.status_code==200){
                    let params = response.data.params;
                    setProfile(params);
                    setFirstName(params.first_name);
                    setLastName(params.last_name);
                    setEmail(params.email);
                    setTel(params.tel);
                    setIdentity(params.identity);
                    setCompany(params.company? params.company: '');
                }else {
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
            isMountedRef.current = true
        }
    },[]);


    const handleSubmit = (e) => {
        e.preventDefault();
        if(isAuthenticate()){
            set422Errors({
                first_name:'',
                last_name:'',
                identity:'',
                email:'',
                tel:'',
                company:''
            });
            const formdata = new FormData();
            formdata.append('first_name', first_name);
            formdata.append('last_name', last_name);
            formdata.append('identity', identity);
            formdata.append('email', email);
            formdata.append('tel', tel);
            formdata.append('company', company);
            const post = {
                first_name: first_name,
                last_name: last_name,
                identity: identity,
                email: email,
                tel: tel,
                company: company
            }
            setSubmit(true);
            axios.put('/api/children/updateProfile/'+ child_id, post)
            .then(response => {
                if(isMountedRef.current) return;
                
                setSubmit(false);
                setNotice(response.data.notice);
                switch(response.data.status_code){
                    case 200: {
                        navigator('/c-account/profile', { state: response.data.success_messages});
                        break;
                    }
                    case 400: set400Error(response.data.error_messages); break;
                    case 422: window.scrollTo(0, 0); set422Errors(response.data.error_messages); break;
                }
            })
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
                    !loaded && <PageLoader />
                }
                {
                    loaded && profile &&
                    <div className="edit-wrap">
                        <div className="edit-content">
                            <form onSubmit={handleSubmit} className="edit-form">

                                <div className="edit-set">
                                    <label htmlFor="last_name"  className="control-label ft-12"> 姓 </label>
                                    <input type="text" name="last_name" id="last_name"  className={`input-default input-nameSei input-h60 ${ _422errors.last_name && "is-invalid c-input__target" }`}  value={last_name} onChange={e=>setLastName(e.target.value)}/>
                                    {
                                        _422errors.last_name &&
                                            <span className="l-alert__text--error ft-16 ft-md-14">
                                                { _422errors.last_name }
                                            </span>
                                    }
                                </div>

                                <div className="edit-set">
                                    <label htmlFor="first_name" className="control-label ft-12"> 名 </label>
                                    <input type="text" name="first_name" id="first_name"  className={`input-default input-nameSei input-h60 ${ _422errors.first_name && "is-invalid c-input__target" }`} value={first_name} onChange={e=>setFirstName(e.target.value)}/>
                                    {
                                        _422errors.first_name &&
                                            <span className="l-alert__text--error ft-16 ft-md-14">
                                                { _422errors.first_name }
                                            </span>
                                    }
                                </div>

                                <div className="edit-set">
                                    <label htmlFor="identity" className="control-label ft-12"> ID </label>
                                    <input type="text" name="identity" id="identity"  className={`input-default input-nameSei ${ _422errors.identity && "is-invalid c-input__target" }`} value={identity} onChange={e=>setIdentity(e.target.value)}/>
                                    {
                                        _422errors.identity &&
                                            <span className="l-alert__text--error ft-16 ft-md-14">
                                                { _422errors.identity }
                                            </span>
                                    }
                                </div>

                                <div className="edit-set">
                                    <label htmlFor="email"   className="control-label ft-12"> メールアドレス </label>
                                    <input type="email" name="email" id="email"  className = {`input-default input-nameSei ${ _422errors.email && "is-invalid c-input__target" }`}  value={email} onChange={e=>setEmail(e.target.value)}/>
                                    {
                                        _422errors.email && 
                                            <span className="l-alert__text--error ft-16 ft-md-14">
                                                {_422errors.email}
                                            </span>
                                    }
                                </div>

                                <div className="edit-set">
                                    <label htmlFor="tel" className="control-label ft-12"> 電話番号 </label>
                                    <input type="text" name="tel" id="tel"  className = {`input-default input-nameSei ${ _422errors.tel && "is-invalid c-input__target" }`}  value={tel} onChange={e=>setTel(e.target.value)}/>
                                    {
                                        _422errors.tel &&
                                            <span className="l-alert__text--error ft-16 ft-md-14">
                                                { _422errors.tel }
                                            </span>
                                    }
                                </div>

                                <div className="edit-set">
                                    <label htmlFor="company"   className="control-label ft-12"> 会社名（下請けの場合のみ） </label>
                                    <input type="text" name="company" id="company"  className = {`input-default input-nameSei ${ _422errors.company && "is-invalid c-input__target" }`}  value={company} onChange={e=>setCompany(e.target.value)}/>
                                    {
                                        _422errors.company &&
                                            <span className="l-alert__text--error ft-16 ft-md-14">
                                                { _422errors.company }
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
                {  _400error && <Alert type="fail" hide={()=>set400Error('')}>{_400error}</Alert> } 
                {  _success &&  <Alert type="success" hide={()=>setSuccess('')}>{_success}</Alert> }
                {  _404error && 
                    <Alert type="fail" hide={()=>{
                        navigator('/c-account/profile');
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


export default ChildProfileEdit;