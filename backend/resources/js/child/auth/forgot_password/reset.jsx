import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { Button } from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
import axios from 'axios';



const ForgotPasswordReset = ({child_id}) => {
    const [pwd, setPwd] = useState('');
    const [confirm_pwd, setConfirmPwd] = useState('');

    const [errors, setErrors] = useState({pwd:'', confirm_pwd:''})
    const [err_msg, setErrMsg] = useState({status:'', msg:''})

    const handleSubmit = (e) => {

        e.preventDefault();
        setErrMsg({status:'', msg:''});

        if(!validateForm()) return;
        const formdata = new FormData();
        formdata.append('password', pwd);
        formdata.append('password_confirmation', confirm_pwd);
        formdata.append('child_id', child_id);

        // axios.post('/api/children/updatePassword/' + child_id, formdata)
        // .then(response => {
        //     if(response.data.status_code==200){
        //         setErrMsg({status:'success', msg:"パスワードの更新に成功しました。"})
        //         window.location.href = '/forgot-password/c-account/complete/ ';
        //     }
        //     elseif(response.data.status_code == 400)
        //     {
        //         setErrMsg({status:'error', msg:"パスワードの更新に失敗しました。"})
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
        
        if(pwd.length == 0){ formIsValid = false;  errors['pwd'] = 'Required'; }
        else errors['pwd'] = '';

        if(confirm_pwd.length == 0){ formIsValid = false;  errors['confirm_pwd'] = 'Required'; }
        else errors['confirm_pwd'] = '';

        setErrors(errors);
        return formIsValid;
    }

	return (
        <form onSubmit={handleSubmit} noValidate>
            <p className="pb-40-px text-center font-weight-bold ft-20">パスワード再登録</p>
            {
                err_msg.status.length != 0 && 
                <div className="mt-40-px">
                    <span className={`l-alert__text--${err_msg.status} ft-16 ft-md-14`}>
                        {err_msg.msg}
                    </span>
                </div>
            }
           
            <div className="edit-set">
                <label htmlFor="pwd"   className="control-label ft-14 ft-md-12"> 
                    パスワード 
                </label>
                <input type="password" name="pwd" id="pwd" className={`input-default input-h60 input-w480 ${ errors['pwd'].length != 0 && "is-invalid  c-input__target" }`}
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
                    確認用パスワード
                </label>
                <input type="password" name="confirm_pwd" id="confirm_pwd" className={`input-default input-h60 input-w480 ${ errors['confirm_pwd'].length != 0 && "is-invalid  c-input__target" }`}  
                    value={confirm_pwd} onChange={e=>setConfirmPwd(e.target.value)} />
                {   
                    errors['confirm_pwd'].length != 0 && 
                        <span className="l-alert__text--error ft-16 ft-md-14">
                            {errors['confirm_pwd']}
                        </span> 
                }
            </div>
          
                
            <div className="mt-5">
                <LoadingButton type="submit" fullWidth className="p-4 rounded-20 ft-15 ft-md-13 font-weight-bold text-black bg-color-2">
                    パスワードを更新する
                </LoadingButton>
            </div>

        </form>
	)
}


// if(document.getElementById('c-reset-password')){
// 	ReactDOM.render(
// 		<ForgotPasswordReset child_id="1"/>,
// 		document.getElementById('c-reset-password')
// 	)
// }

export default ForgotPasswordReset