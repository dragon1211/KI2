import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { LoadingButton } from '@material-ui/lab';

import Notification from '../../component/notification';
import Alert from '../../component/alert';


const ProfileEdit = () => {

    const history = useHistory();

    const [first_name, setFirstName] = useState('');
    const [last_name, setLastName] = useState('');  
    const [identify, setIdentify] = useState('');  
    const [email, setEmail] = useState('');
    const [tel, setTel] = useState('');
    const [company, setCompany] = useState('');
    const [image, setImage] = useState(''); 

    const [errors, setErrors] = useState({
        first_name:'',
        last_name:'',
        identify:'',
        email:'',
        tel:'',
        image:'',
        company:''
    })
    const [err_msg, setErrMsg] = useState({status:'', msg:''})

    const [submitStatus, setSubmitStatus] = useState('')

    
    const validateForm = () => {
        let errors = {};
        let formIsValid = true;

        if (email.length == 0) { formIsValid = false; errors["email"] = 'Required'; }
        else {
          //regular expression for email validation
            var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
            if (!pattern.test(email)) {
                formIsValid = false;
                errors["email"] = 'Required';
            }
            else {
                errors['email'] = '';
            }
        }

        if(!image){ formIsValid = false;  errors['image'] = 'Required';  }
        else errors['image'] = '';

        if(first_name.length == 0){ formIsValid = false;  errors['first_name'] = 'Required';  }
        else errors['first_name'] = '';

        if(identify.length == 0){ formIsValid = false;  errors['identify'] = 'Required';  }
        else errors['identify'] = '';

        if(last_name.length == 0){ formIsValid = false;  errors['last_name'] = 'Required';  }
        else errors['last_name'] = '';

        if(tel.length == 0){ formIsValid = false;  errors['tel'] = 'Required';  }
        else errors['tel'] = '';

        if(company.length == 0){ formIsValid = false;  errors['company'] = 'Required';  }
        else errors['company'] = '';

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
        formdata.append('identify', identify);
        formdata.append('email', email);
        formdata.append('tel', tel);
        formdata.append('company', company);
        formdata.append('image', image);
        // axios.post('/api/children/updateProfile/{identify}', formdata)
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
                    <h2>プロフィール編集</h2>
                </div>
                <Notification/>
            </div>

            <div className="l-content-wrap">
                <section className="profile-container">
                    <div className="profile-wrap">
                        <div className="profile-content">
                            <form onSubmit={handleSubmit} noValidate>
                                                        
                                <div className="edit-set">
                                    <label htmlFor="first_name"  className="control-label ft-12"> 姓 </label>
                                    <input type="text" name="first_name" id="first_name"  className={`input-default input-nameSei ${ errors['first_name'].length != 0 && "is-invalid c-input__target" }`}  value={first_name} onChange={e=>setFirstName(e.target.value)}/>
                                    {
                                        errors['first_name'].length != 0 &&
                                            <span className="l-alert__text--error ft-16 ft-md-14">
                                                {errors['first_name']}
                                            </span>
                                    }
                                </div>

                                <div className="edit-set">
                                    <label htmlFor="last_name" className="control-label ft-12"> 名 </label>
                                    <input type="text" name="last_name" id="last_name"  className={`input-default input-nameSei ${ errors['last_name'].length != 0 && "is-invalid c-input__target" }`} value={last_name} onChange={e=>setLastName(e.target.value)}/>
                                    {
                                        errors['last_name'].length != 0 &&
                                            <span className="l-alert__text--error ft-16 ft-md-14">
                                                {errors['last_name']}
                                            </span>
                                    }
                                </div>

                                <div className="edit-set">
                                    <label htmlFor="identify" className="control-label ft-12"> ID </label>
                                    <input type="text" name="identify" id="identify"  className={`input-default input-nameSei ${ errors['identify'].length != 0 && "is-invalid c-input__target" }`} value={identify} onChange={e=>setIdentify(e.target.value)}/>
                                    {
                                        errors['identify'].length != 0 &&
                                            <span className="l-alert__text--error ft-16 ft-md-14">
                                                {errors['identify']}
                                            </span>
                                    }
                                </div>

                                <div className="edit-set">
                                    <label htmlFor="email"   className="control-label ft-12"> メールアドレス </label>
                                    <input type="email" name="email" id="email"  className = {`input-default input-nameSei ${ errors['email'].length != 0 && "is-invalid c-input__target" }`}  value={email} onChange={e=>setEmail(e.target.value)}/>
                                    {
                                        errors['email'].length != 0 && 
                                            <span className="l-alert__text--error ft-16 ft-md-14">
                                                {errors['email']}
                                            </span>
                                    }
                                </div>

                                <div className="edit-set">
                                    <label htmlFor="tel" className="control-label ft-12"> 電話番号 </label>
                                    <input type="text" name="tel" id="tel"  className = {`input-default input-nameSei ${ errors['tel'].length != 0 && "is-invalid c-input__target" }`}  value={tel} onChange={e=>setTel(e.target.value)}/>
                                    {
                                        errors['tel'].length != 0 &&
                                            <span className="l-alert__text--error ft-16 ft-md-14">
                                                {errors['tel']}
                                            </span>
                                    }
                                </div>

                                <div className="edit-set">
                                    <label htmlFor="company"   className="control-label ft-12"> 会社名（下請けの場合のみ） </label>
                                    <input type="text" name="company" id="company"  className = {`input-default input-nameSei ${ errors['company'].length != 0 && "is-invalid c-input__target" }`}  value={company} onChange={e=>setCompany(e.target.value)}/>
                                    {
                                        errors['company'].length != 0 &&
                                            <span className="l-alert__text--error ft-16 ft-md-14">
                                                {errors['company']}
                                            </span>
                                    }
                                </div>
                                
                                <div className="mt-5">
                                    <LoadingButton type="submit" fullWidth className="p-4 rounded-20 ft-15 font-weight-bold text-black bg-color-2">
                                        <span>プロフィールを更新</span>
                                    </LoadingButton>
                                </div>
                                {
                                    submitStatus == 'success' && <Alert type="success">Submit Success!</Alert>
                                }
                                {
                                    submitStatus == 'failed' && <Alert type="fail">Submit Failed!</Alert>
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