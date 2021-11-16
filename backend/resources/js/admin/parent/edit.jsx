import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { LoadingButton } from '@material-ui/lab';
import { CircularProgress  } from '@material-ui/core';
import Alert from '../../component/alert';

const ParentEdit = (props) => {

    const history = useHistory();

    const [company, setCompany] = useState('');
    const [email, setEmail] = useState('');
    const [tel, setTelephone] = useState('');
    const [profile, setProfile] = useState('');  

    const [_422errors, set422Errors] = useState({
        company:'',
        email:'',
        tel:'',
        profile:'',
    });
    const [_400error, set400Error] = useState('');
    const [_success, setSuccess] = useState('');

    const [submit, setSubmit] = useState(false);
    const [loaded, setLoaded] = useState(false);


    useEffect(() => {
        setLoaded(false);
        axios.get(`/api/admin/fathers/detail/${props.match.params?.father_id}`)
        .then(response => {
            setLoaded(true);
            if(response.data.status_code==200){
                var parent = response.data.params;
                if(parent){
                    setCompany(parent?.company);
                    setEmail(parent.email);
                    setTelephone(parent.tel)
                    setProfile(parent.profile);  
                }
            }
        })
    },[]);

    
    const handleSubmit = (e) => {
        e.preventDefault();
        set422Errors({
            company:'',
            email:'',
            tel:'',
            profile:'',
        });
        setSubmit(true);
        var request = {
            company: company,
            email: email,
            tel: tel,
            profile: profile,
        };
        axios.put(`/api/admin/fathers/updateProfile/${props.match.params?.father_id}`, request)
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
            </div>

            <div className="l-content-wrap">
                <section className="profile-container position-relative">
                    {
                        !loaded &&
                            <CircularProgress color="secondary" style={{top:'30%', left:'calc(50% - 22px)', color:'green', position:'absolute', zIndex:'10'}}/>
                    }
                    <div className="profile-wrap">
                        <div className="mx-5">
                            <form onSubmit={handleSubmit} noValidate>
                                <div className="edit-set">
                                    <label htmlFor="company"   className="control-label ft-12"> 会社名</label>
                                    <input type="text" name="company" id="company"  className = {`input-default input-nameSei input-h60 ${ _422errors.company && "is-invalid c-input__target" }`}  value={company} onChange={e=>setCompany(e.target.value)}/>
                                    {
                                        _422errors.company &&
                                            <span className="l-alert__text--error ft-16 ft-md-14">
                                                { _422errors.company }
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
                                    <input type="text" name="tel" id="tel"  className = {`input-default input-nameSei input-h60 ${ _422errors.tel && "is-invalid c-input__target" }`}  value={tel} onChange={e=>setTelephone(e.target.value)}/>
                                    {
                                        _422errors.tel &&
                                            <span className="l-alert__text--error ft-16 ft-md-14">
                                                { _422errors.tel }
                                            </span>
                                    }
                                </div>

                                <div className="edit-set">
                                    <label htmlFor="profile" className="control-label ft-12"> プロフィール </label>
                                    <textarea  name="profile" id="profile" rows="8" className = {`textarea-default ${ _422errors.profile && "is-invalid c-input__target" }`}  value={profile} onChange={e=>setProfile(e.target.value)}/>
                                    {
                                        _422errors.profile &&
                                            <span className="l-alert__text--error ft-16 ft-md-14">
                                                { _422errors.profile }
                                            </span>
                                    }
                                </div>

                                <div className="mt-5">
                                    <LoadingButton type="submit" fullWidth 
                                        className="btn-edit btn-default btn-h60 bg-yellow rounded-15"
                                        loading={submit}>
                                        <span className={`ft-18 font-weight-bold ${!submit && 'text-black'}`}>プロフィールを更新</span>
                                    </LoadingButton>
                                </div>
                                {
                                    _400error && <Alert type="fail" hide={()=>set400Error('')}>{_400error}</Alert>
                                } 
                                {
                                    _success && 
                                    <Alert type="success" 
                                    hide={()=>  
                                        history.push({
                                        pathname: `/admin/parent/detail/${props.match.params?.father_id}`,
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


export default ParentEdit;