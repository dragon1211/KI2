import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { LoadingButton } from '@material-ui/lab';

import axios from 'axios';

import Notification from '../../component/notification';
import Alert from '../../component/alert';


const ChildPasswordEdit = () => {

    const history = useHistory();

    const [pwd, setPwd] = useState('');
    const [confirm_pwd, setConfirmPwd] = useState('');

    const [errors, setErrors] = useState({pwd:'', confirm_pwd:''})
    const [err_msg, setErrMsg] = useState({status:'', msg:''})

    const [submitStatus, setSubmitStatus] = useState('')

    
    const validateForm = () => {
        let errors = {};
        let formIsValid = true;
        
        if(pwd.length == 0){ formIsValid = false;  errors['pwd'] = 'Required'; }
        else errors['pwd'] = '';

        if(confirm_pwd.length == 0){ formIsValid = false;  errors['confirm_pwd'] = 'Required'; }
        else errors['confirm_pwd'] = '';

        setErrors(errors);
        return formIsValid;
    }

    

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrMsg({status:'', msg:''});
        
        if(!validateForm()) return;

        const formdata = new FormData();
        formdata.append('first_name', first_name);
        formdata.append('last_name', last_name);
        formdata.append('email', email);
        formdata.append('password', password);
        formdata.append('company', company);
        formdata.append('image', image);
        // axios.post('/api/children/profile/edit/password/{child_id}', formdata)
        // .then(response => {
        //     if(response.data.status_code==200){
        //         setSubmitStatus('success);
        //     }
        //     else if(response.data.status_code==400){
        //         setSubmitStatus('failed);
        //     }
        // })
        // .catch(err=>console.log(err))
    }


    
	return (
        <div className="l-content">
            <div className="l-content-w560">
                <div className="l-content__ttl">
                    <div className="l-content__ttl__left">
                        <h2>パスワード編集</h2>
                    </div>
                </div>

                <div className="l-content-wrap">
                    <section className="profile-container">
                        <div className="profile-wrap">
                            <div className="mx-5">
                                <form onSubmit={handleSubmit} noValidate>
                                                            
                                    <div className="edit-set">
                                        <label htmlFor="pwd"   className="control-label ft-14 ft-md-12"> 
                                            新しいパスワード 
                                        </label>
                                        <input type="password" name="pwd" id="pwd" className={`input-default ${ errors['pwd'].length != 0 && "is-invalid  c-input__target" }`}
                                            value={pwd} onChange={e=>setPwd(e.target.value)} autoFocus/>
                                        {   
                                            errors['pwd'].length != 0 && 
                                                <span className="l-alert__text--error ft-16 ft-md-14">
                                                    {errors['pwd']}
                                                </span> 
                                        }
                                    </div>

                                    <div className="edit-set">
                                        <label htmlFor="confirm_pwd"   className="control-label ft-14 ft-md-12"> 
                                            確認用新しいパスワード
                                        </label>
                                        <input type="password" name="confirm_pwd" id="confirm_pwd" className={`input-default ${ errors['confirm_pwd'].length != 0 && "is-invalid  c-input__target" }`}  
                                            value={confirm_pwd} onChange={e=>setConfirmPwd(e.target.value)}/>
                                        {   
                                            errors['confirm_pwd'].length != 0 && 
                                                <span className="l-alert__text--error ft-16 ft-md-14">
                                                    {errors['confirm_pwd']}
                                                </span> 
                                        }
                                    </div>
                                    
                                    <div className="mt-5">
                                        <LoadingButton type="submit" fullWidth className="p-3 rounded-15 font-weight-bold text-black bg-color-2">
                                            <span className="ft-16">パスワードを更新</span>
                                        </LoadingButton>
                                    </div>
                                    {
                                        submitStatus == 'success' && <Alert type="success">Submit Success!</Alert>
                                    }
                                    {
                                        submitStatus == 'fail' && <Alert type="fail">Submit Failed!</Alert>
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


export default ChildPasswordEdit;