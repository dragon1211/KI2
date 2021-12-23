import React, { useRef, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { LoadingButton } from '@material-ui/lab';

import Alert from '../../component/alert';
import PageLoader from '../../component/page_loader';


const ChildEdit = (props) => {

    const history = useHistory();

    const [first_name, setFirstName] = useState('');
    const [last_name, setLastName] = useState('');  
    const [identity, setIdentity] = useState('');  
    const [email, setEmail] = useState('');
    const [tel, setTelephone] = useState('');
    const [company, setCompany] = useState('');
    const [child, setChild] = useState(null);

    const [_422errors, set422Errors] = useState({
        first_name:'',
        last_name:'',
        identity:'',
        email:'',
        tel:'',
        company:''
    })
    const [_400error, set400Error] = useState('');
    const [_success, setSuccess] = useState('');

    const [submit, setSubmit] = useState(false);
    const [loaded, setLoaded] = useState(false);

    const isMountedRef = useRef(true);
    
    useEffect(() => {
        isMountedRef.current = false;
        setLoaded(false);
        axios.get(`/api/admin/children/detail/${props.match.params?.child_id}`)
        .then(response => {
            setLoaded(true);
            if(response.data.status_code==200)
            {
                var child = response.data.params;
                setChild(child);
                if(child){
                    setFirstName(child.first_name);
                    setLastName(child.last_name);
                    setIdentity(child.identity);
                    setEmail(child.email);
                    setTelephone(child.tel);
                    setCompany(child.company);
                }
            }
            else {
                set400Error("失敗しました。");
            }
        })
    },[]);


    const handleSubmit = (e) => {
        e.preventDefault();
        set422Errors({
            first_name:'',
            last_name:'',
            identity:'',
            email:'',
            tel:'',
            company:''
        });
        setSubmit(true);
        var request = {
            first_name: first_name,
            last_name: last_name,
            identity: identity,
            email: email,
            tel: tel,
            company: company
        };
        axios.put(`/api/admin/children/updateProfile/${props.match.params?.child_id}`, request)
        .then(response => {
            setSubmit(false);
            switch(response.data.status_code){
                case 200: {
                    history.push({
                    pathname: `/admin/child/detail/${props.match.params?.child_id}`,
                    state: response.data.success_messages});
                    break;
                }
                case 400: set400Error(response.data.error_messages); break;
                case 422: window.scrollTo(0, 0); set422Errors(response.data.error_messages); break;
            }
        })
    }


    
	return (
    <div className="l-content">
        <div className="l-content-w560">
            <div className="l-content__ttl">
                <div className="l-content__ttl__left">
                    <h2>プロフィール編集</h2>
                </div>
            </div>

            <div className="l-content-wrap">
                <section className="edit-container">
                    {
                        !loaded && <PageLoader />
                    }
                    {
                        loaded && child &&
                        <div className="edit-wrap">
                            <div className="edit-content">
                                <form onSubmit={handleSubmit} className="edit-form">

                                    <div className="edit-set">
                                        <label htmlFor="identity" className="control-label ft-12"> ID </label>
                                        <input type="text" name="identity" id="identity"  className={`input-default input-nameSei input-h60 ${ _422errors.identity && "is-invalid c-input__target" }`} value={identity} onChange={e=>setIdentity(e.target.value)}/>
                                        {
                                            _422errors.identity &&
                                                <span className="l-alert__text--error ft-16 ft-md-14">
                                                    { _422errors.identity }
                                                </span>
                                        }
                                    </div>
                                                            
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
                                        <label htmlFor="email"   className="control-label ft-12"> メールアドレス </label>
                                        <input type="email" name="email" id="email"  className = {`input-default input-nameSei input-h60 ${ _422errors.email && "is-invalid c-input__target" }`}  value={email} onChange={e=>setEmail(e.target.value)}/>
                                        {
                                            _422errors.email && 
                                                <span className="l-alert__text--error ft-16 ft-md-14">
                                                    { _422errors.email }
                                                </span>
                                        }
                                    </div>

                                    <div className="edit-set">
                                        <label htmlFor="tel" className="control-label ft-12"> 電話番号 </label>
                                        <input type="tel" name="tel" id="tel"  className = {`input-default input-nameSei input-h60 ${ _422errors.tel && "is-invalid c-input__target" }`}  value={tel} onChange={e=>setTelephone(e.target.value)}/>
                                        {
                                            _422errors.tel &&
                                                <span className="l-alert__text--error ft-16 ft-md-14">
                                                    { _422errors.tel }
                                                </span>
                                        }
                                    </div>

                                    <div className="edit-set">
                                        <label htmlFor="company"   className="control-label ft-12"> 所屈している会社名を記載 </label>
                                        <input type="text" name="company" id="company"  className = {`input-default input-nameSei input-h60 ${ _422errors.company && "is-invalid c-input__target" }`}  value={company} onChange={e=>setCompany(e.target.value)}/>
                                        {
                                            _422errors.company &&
                                                <span className="l-alert__text--error ft-16 ft-md-14">
                                                    { _422errors.company }
                                                </span>
                                        }
                                    </div>
                                    
                                    <LoadingButton type="submit" fullWidth 
                                        loading={submit}
                                        className="btn-edit btn-default btn-h75 bg-yellow rounded-20">
                                        <span className={`ft-18 ft-xs-16 font-weight-bold ${!submit && 'text-black'}`}>プロフィールを更新</span>
                                    </LoadingButton>
                                </form>
                            </div>
                        </div>
                    }
                    { _400error && <Alert type="fail" hide={()=>set400Error('')}> {_400error} </Alert> } 
                    { _success && <Alert type="success" hide={()=>setSuccess('')}> {_success} </Alert> }
                </section>   
            </div>
        </div>
    </div>
    )
}


export default ChildEdit;