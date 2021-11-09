import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { LoadingButton } from '@material-ui/lab';

import Notification from '../../component/notification';
import Alert from '../../component/alert';
import { CircularProgress  } from '@material-ui/core';


const ProfileEdit = () => {

    const history = useHistory();

    const [first_name, setFirstName] = useState('');
    const [last_name, setLastName] = useState('');  
    const [identity, setIdentity] = useState('');  
    const [email, setEmail] = useState('');
    const [tel, setTel] = useState('');
    const [company, setCompany] = useState('');

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

    
    useEffect(() => {
        setLoaded(false);
        let child_id = document.getElementById('child_id').value;
        axios.get('/api/children/detail/'+child_id)
        .then(response => {
            setLoaded(true);
            if(response.data.status_code==200){
                let params = response.data.params;
                setFirstName(params.first_name);
                setLastName(params.last_name);
                setEmail(params.email);
                setTel(params.tel);
                setIdentity(params.identity);
                if(params.company)setCompany(params.company);
            }
        })
        .catch(err=>console.log(err))
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
        let child_id =document.getElementById('child_id').value;
        axios.put('/api/children/updateProfile/'+child_id, post)
        .then(response => {
            setSubmit(false);
            switch(response.data.status_code){
                case 200: setSuccess(response.data.success_messages); break;
                case 400: set400Error(response.data.error_messages); break;
                case 422: set422Errors(response.data.error_messages); break;
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
                <Notification/>
            </div>

            <div className="l-content-wrap">
                <section className="profile-container">
                    {
                        !loaded &&
                            <CircularProgress color="secondary" className="css-loader"/>
                    }
                    <div className="profile-wrap">
                        <div className="profile-content">
                            <form onSubmit={handleSubmit} noValidate>

                                <div className="edit-set">
                                    <label htmlFor="first_name"  className="control-label ft-12"> 姓 </label>
                                    <input type="text" name="first_name" id="first_name"  className={`input-default input-nameSei ${ _422errors.first_name && "is-invalid c-input__target" }`}  value={first_name} onChange={e=>setFirstName(e.target.value)}/>
                                    {
                                        _422errors.first_name &&
                                            <span className="l-alert__text--error ft-16 ft-md-14">
                                                { _422errors.first_name }
                                            </span>
                                    }
                                </div>

                                <div className="edit-set">
                                    <label htmlFor="last_name" className="control-label ft-12"> 名 </label>
                                    <input type="text" name="last_name" id="last_name"  className={`input-default input-nameSei ${ _422errors.last_name && "is-invalid c-input__target" }`} value={last_name} onChange={e=>setLastName(e.target.value)}/>
                                    {
                                        _422errors.last_name &&
                                            <span className="l-alert__text--error ft-16 ft-md-14">
                                                { _422errors.last_name }
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
                                
                                <div className="mt-5">
                                    <LoadingButton type="submit" 
                                        loading={submit} 
                                        fullWidth 
                                        className="btn-edit btn-default btn-h75 bg-yellow rounded-20"> 
                                        <span className={`ft-16 font-weight-bold ${!submit && 'text-black'}`}>
                                            プロフィールを更新
                                        </span> 
                                    </LoadingButton>
                                </div>
                                {
                                    _400error && 
                                        <Alert type="fail" hide={()=>set400Error('')}>{_400error}</Alert>
                                } 
                                {
                                    _success && 
                                    <Alert type="success" 
                                    hide={()=>  
                                        history.push({
                                        pathname: `/c-account/profile`,
                                        state: {}
                                    })}>{_success}</Alert>
                                }
                            </form>
                        </div>
                    </div>
                </section>   
            </div>
        </div>
    </div>
    )
}


export default ProfileEdit;