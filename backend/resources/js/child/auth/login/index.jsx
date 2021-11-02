import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { Button } from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
import axios from 'axios';



const Login = () => {
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');

    const [errors, setErrors] = useState({phone:'', password:''})
    const [err_msg, setErrMsg] = useState({status:'', msg:''})

    const handleSubmit = (e) => {
        e.preventDefault();

        setErrMsg({status:'', msg:''});

        if(!validateForm()) return;
        const formdata = new FormData();
        formdata.append('tel', phone);
        formdata.append('password', password);
        // axios.post('/api/children/login/', formdata)
        // .then(response => {
        //     if(response.data.status_code==200){
        //         window.location.href = '/c-account/meating';
        //     }
        //     elseif(response.data.status_code == 400)
        //     {
        //         setErrMsg({status:'error', msg:"ログインに失敗しました。<br>10回連続で失敗すると、一定期間ログインできなくなります。"})
        //     }
        //     elseif(response.data.status_code == 422)
        //     {

        //     }
        // })
        // .catch(err=>console.log(err))
    }

    const validateForm = () => {
        let errors = {};
        let formIsValid = true;
        
        if(phone.length == 0){ formIsValid = false;  errors['phone'] = 'Required'; }
        else errors['phone'] = '';

        if(password.length == 0){ formIsValid = false;  errors['password'] = 'Required'; }
        else errors['password'] = '';

        setErrors(errors);
        return formIsValid;
    }

	return (
        <form onSubmit={handleSubmit} noValidate>
           
           <h1 className="text-center font-weight-bold ft-25 pb-40-px">ログイン</h1>
            {
                err_msg.status.length != 0 && 
                <div className="mt-40-px">
                    <span className={`l-alert__text--${err_msg.status} ft-16 ft-md-14`}>
                        {err_msg.msg}
                    </span>
                </div>
            }
            
            <div className="edit-set">
                <label htmlFor="phone"   className="control-label ft-14 ft-md-12"> 電話番号 </label>
                <input type="text" name="phone" id="phone" className={`input-default ${ errors['phone'] && "is-invalid  c-input__target" }`}  value={phone} onChange={e=>setPhone(e.target.value)} autoFocus/>
                {   
                    errors['phone'].length != 0 && 
                        <span className="l-alert__text--error ft-16 ft-md-14">
                            {errors['phone']}
                        </span> 
                }
            </div>

            <div className="edit-set">
                <label htmlFor="password"   className="control-label ft-14 ft-md-12"> パスワード </label>
                <input type="password" name="password" id="password" className={`input-default ${ errors['password'] && "is-invalid  c-input__target" }`}  value={password} onChange={e=>setPassword(e.target.value)} autoFocus/>
                {  
                    errors['password'].length != 0 && 
                        <span className="l-alert__text--error ft-16 ft-md-14">
                            {errors['password']}
                        </span> 
                }
            </div>

            <div className="edit-set">
                <div className="c-input__checkbox text-center">
                    <label htmlFor="remember_me" className="m-0 ft-15 ft-md-13">
                        <span>ログイン情報を保持する</span>
                        <input  id="remember_me"  name="remember"  type="checkbox"  value="remember"/>
                        <div className="color-box"></div>
                    </label>
                </div>
            </div>

                
            <div className="mt-4">
                <LoadingButton type="submit" fullWidth className="p-4 rounded-20 ft-15 ft-md-13 font-weight-bold text-black bg-yellow">
                    ログイン
                </LoadingButton>
            </div>

            <div className="mt-4 text-center">
                <a href="/forgot-password/c-account" className="ft-15 ft-md-13 text-black text-decoration-none scale-1">
                    パスワード紛失の方はコチラ
                </a>
            </div>
        </form>
	)
}



export default Login;