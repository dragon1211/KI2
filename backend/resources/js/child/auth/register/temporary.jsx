import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { Button } from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
import axios from 'axios';



const SignUpTemporary = () => {
    const [phone, setPhone] = useState('');

    const [errors, setErrors] = useState({phone:''})
    const [err_msg, setErrMsg] = useState({status:'', msg:''})

    const handleSubmit = (e) => {

        e.preventDefault();
        setErrMsg({status:'', msg:''});

        if(!validateForm()) return;
        const formdata = new FormData();
        formdata.append('tel', phone);

        // axios.post('/api/children/checkTel/', formdata)
        // .then(response => {
        //     if(response.data.status_code==200){
        //         setErrMsg({status:'success', msg:"本登録用URLを送信に成功しました!"})
        //     }
        //     elseif(response.data.status_code == 400)
        //     {
        //         setErrMsg({status:'error', msg:"URLの送信に失敗しました。<br> 電話番号をご確認ください。"})
        //     }
        //     elseif(response.data.status_code == 422)
        //     {
        //         setErrMsg({status:'error', msg:"電話番号が正しくありません。"})
        //     }
        // })
        // .catch(err=>console.log(err))
    }

    const validateForm = () => {
        let errors = {};
        let formIsValid = true;
        
        if(phone.length == 0){ formIsValid = false;  errors['phone'] = 'Required'; }
        else errors['phone'] = '';

        setErrors(errors);
        return formIsValid;
    }

	return (
        <form onSubmit={handleSubmit} noValidate>
            <p className="pb-40-px text-center font-weight-bold ft-20">仮登録手続き</p>
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
                <input type="text" name="phone" id="phone" className={`input-default input-h60 input-w480 ${ errors.phone.length != 0 && "is-invalid  c-input__target" }`}  value={phone} onChange={e=>setPhone(e.target.value)} autoFocus/>
                {   
                    errors.phone.length != 0 && 
                        <span className="l-alert__text--error ft-16 ft-md-14">
                            {errors.phone}
                        </span> 
                }
            </div>
          
                
            <div className="mt-5">
                <LoadingButton type="submit" fullWidth className="p-4 rounded-20 ft-15 ft-md-13 font-weight-bold text-black bg-yellow">
                    仮登録送信
                </LoadingButton>
            </div>

        </form>
	)
}


export default SignUpTemporary;