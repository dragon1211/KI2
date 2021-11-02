import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { Button } from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
import axios from 'axios';

import IconButton from "@material-ui/core/IconButton";


const SignUp = () => {
    const [first_name, setFirstName] = useState('');
    const [last_name, setLastName] = useState('');  
    const [identify, setIdentify] = useState('');  
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [company, setCompany] = useState('');
    const [image, setImage] = useState(''); 

    const [errors, setErrors] = useState({
        first_name:'',
        last_name:'',
        identify:'',
        email:'',
        password:'',
        image:'',
        company:''
    })
    const [err_msg, setErrMsg] = useState({status:'', msg:''})

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrMsg({status:'', msg:''});
        
        if(!validateForm()) return;

        const formdata = new FormData();
        formdata.append('first_name', first_name);
        formdata.append('last_name', last_name);
        formdata.append('identify', identify);
        formdata.append('email', email);
        formdata.append('password', password);
        formdata.append('company', company);
        formdata.append('image', image);
        // axios.post('/api/children/registerMain', formdata)
        // .then(response => {
        //     if(response.data.status_code==200){
        //         window.location.href = '/register/c-account/complete';
        //     }
        //     else if(response.data.status_code==400){
        //         window.location.href = '/register/c-account/error';
        //     }
        //     else if(response.data.status_code==500){
        //         window.location.href = '/unknown-error';
        //     }
        // })
        //.catch(err=>console.log(err))
    }

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

        if(last_name.length == 0){ formIsValid = false;  errors['last_name'] = 'Required';  }
        else errors['last_name'] = '';

        if(identify.length == 0){ formIsValid = false;  errors['identify'] = 'Required';  }
        else errors['identify'] = '';

        if(password.length < 8){ formIsValid = false;  errors['password'] = 'Required';  }
        else errors['password'] = '';

        if(company.length == 0){ formIsValid = false;  errors['company'] = 'Required';  }
        else errors['company'] = '';

        setErrors(errors);
        return formIsValid;
    }

    const handleImageChange = (e) => {

        e.preventDefault();
        let reader = new FileReader();
        let _file = e.target.files[0];

        reader.readAsDataURL(_file);

        reader.onloadend = () => {
            setImage(reader.result);
        };
    };

	return (
        <form onSubmit={handleSubmit} noValidate>
            <p className="text-center font-weight-bold ft-20">本登録</p>
            {
                err_msg.status.length != 0 && 
                    <span className={`l-alert__text--${err_msg.status} ft-16 ft-md-14`}>
                        {err_msg.msg}
                    </span>
            }
            <div className="mt-25-px">
                <input type="file" id="avatar" name="avatar" className="d-none" accept=".png, .jpg, .jpeg" onChange={(e) => handleImageChange(e)}/>
                <div className={`avatar-wrapper  ${ errors['image'].length != 0 && "is-invalid c-input__target" }` }>
                    <label htmlFor="avatar" className='avatar-label'>
                        <IconButton color="primary" aria-label="upload picture" component="span" className="bg-yellow shadow-sm">
                            <img src="/assets/img/icon/camera.svg" width="16" height="16"/>
                        </IconButton>
                    </label>
                    {  
                        image && 
                            <img src={image} alt="" width ="100%" height="100%" style={{borderRadius:'50%'}}/>  
                    }
                </div>
                {   
                    errors['image'].length != 0  && 
                        <span className="l-alert__text--error ft-16 ft-md-14">
                            { errors['image']}
                        </span>  
                }
            </div>
            
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
                <label htmlFor="password" className="control-label ft-12"> パスワード </label>
                <input type="password" name="password" id="password"  className = {`input-default input-nameSei ${ errors['password'].length != 0 && "is-invalid c-input__target" }`}  value={password} onChange={e=>setPassword(e.target.value)}/>
                {
                    errors['password'].length != 0 &&
                        <span className="l-alert__text--error ft-16 ft-md-14">
                            {errors['password']}
                        </span>
                }
            </div>

            <div className="edit-set">
                <label htmlFor="company"   className="control-label ft-12"> 所屈している会社名を記載 </label>
                <input type="text" name="company" id="company"  className = {`input-default input-nameSei input-h60 input-w480 ${ errors['company'].length != 0 && "is-invalid c-input__target" }`}  value={company} onChange={e=>setCompany(e.target.value)}/>
                {
                    errors['company'].length != 0 &&
                        <span className="l-alert__text--error ft-16 ft-md-14">
                            {errors['company']}
                        </span>
                }
            </div>
            
            <div className="mt-5">
                <LoadingButton type="submit" fullWidth className="p-4 rounded-20 ft-15 font-weight-bold text-black bg-yellow">
                    本登録
                </LoadingButton>
            </div>
        </form>
	)
}



export default SignUp;