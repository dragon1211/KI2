import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { LoadingButton } from '@material-ui/lab';

import Alert from '../../component/alert';


const ParentEdit = () => {

    const history = useHistory();

    const [company, setCompany] = useState('');
    const [email, setEmail] = useState('');
    const [tel, setTel] = useState('');
    const [text, setText] = useState('');  

    const [_422errors, set422Errors] = useState({
        company:'',
        email:'',
        tel:'',
        text:'',
    })
    const [_400error, set400Error] = useState('')

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

        if(!company){ formIsValid = false;  errors['company'] = 'Required';  }
        else errors['company'] = '';

        if(!tel){ formIsValid = false;  errors['tel'] = 'Required';  }
        else errors['tel'] = '';

        if(!text){ formIsValid = false;  errors['text'] = 'Required';  }
        else errors['text'] = '';


        set422Errors(errors);
        return formIsValid;
    }


    const handleSubmit = (e) => {
        e.preventDefault();
        
        if(!validateForm()) return;

        const formdata = new FormData();
        formdata.append('company', company);
        formdata.append('email', email);
        formdata.append('tel', tel);
        formdata.append('text', text);
        // axios.post('/', formdata)
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
            </div>

            <div className="l-content-wrap">
                <section className="profile-container">
                    <div className="profile-wrap">
                        <div className="mx-5">
                            <form onSubmit={handleSubmit} noValidate>

                                <div className="edit-set">
                                    <label htmlFor="company"   className="control-label ft-12"> 会社名</label>
                                    <input type="text" name="company" id="company"  className = {`input-default input-nameSei ${ _422errors['company'].length != 0 && "is-invalid c-input__target" }`}  value={company} onChange={e=>setCompany(e.target.value)}/>
                                    {
                                        _422errors['company'].length != 0 &&
                                            <span className="l-alert__text--error ft-16 ft-md-14">
                                                {_422errors['company']}
                                            </span>
                                    }
                                </div>
                                                        
                                <div className="edit-set">
                                    <label htmlFor="email"   className="control-label ft-12"> メールアドレス </label>
                                    <input type="email" name="email" id="email"  className = {`input-default input-nameSei ${ _422errors['email'].length != 0 && "is-invalid c-input__target" }`}  value={email} onChange={e=>setEmail(e.target.value)}/>
                                    {
                                        _422errors['email'].length != 0 && 
                                            <span className="l-alert__text--error ft-16 ft-md-14">
                                                {_422errors['email']}
                                            </span>
                                    }
                                </div>

                                <div className="edit-set">
                                    <label htmlFor="tel" className="control-label ft-12"> 電話番号 </label>
                                    <input type="text" name="tel" id="tel"  className = {`input-default input-nameSei ${ _422errors['tel'].length != 0 && "is-invalid c-input__target" }`}  value={tel} onChange={e=>setTel(e.target.value)}/>
                                    {
                                        _422errors['tel'].length != 0 &&
                                            <span className="l-alert__text--error ft-16 ft-md-14">
                                                {_422errors['tel']}
                                            </span>
                                    }
                                </div>

                                <div className="edit-set">
                                    <label htmlFor="profile" className="control-label ft-12"> プロフィール </label>
                                    <textarea  name="profile" id="profile" style={{height:'200px'}} className = {`input-default input-nameSei ${ _422errors['text'].length != 0 && "is-invalid c-input__target" }`}  value={text} onChange={e=>setText(e.target.value)}/>
                                    {
                                        _422errors['text'].length != 0 &&
                                            <span className="l-alert__text--error ft-16 ft-md-14">
                                                {_422errors['text']}
                                            </span>
                                    }
                                </div>

                                
                                
                                <div className="mt-5">
                                    <LoadingButton type="submit" fullWidth className="p-3 rounded-15 ft-15 font-weight-bold text-black bg-color-2">
                                        <span className="ft-16">プロフィールを更新</span>
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


export default ParentEdit;