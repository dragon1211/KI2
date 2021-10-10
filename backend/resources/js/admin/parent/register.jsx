import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { LoadingButton } from '@material-ui/lab';

import axios from 'axios';

import Notification from '../../component/notification';
import Alert from '../../component/alert';


const ParentRegister = () => {

    const history = useHistory();

    const [email, setEmail] = useState('');

    const [_422errors, set422Errors] = useState({email:''})
    const [_400error, set400Error] = useState({status:'', msg:''})

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

        set422Errors(errors);
        return formIsValid;
    }

    

    const handleSubmit = (e) => {
        e.preventDefault();
        set400Error({status:'', msg:''});
        
        if(!validateForm()) return;

        const formdata = new FormData();
        // formdata.append('email', email);
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
                        <h2>親追加</h2>
                    </div>
                    <Notification/>
                </div>

                <div className="l-content-wrap">
                    <section className="profile-container">
                        <div className="profile-wrap">
                            <div className="mx-5">
                                <form onSubmit={handleSubmit} noValidate>
                                                            
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
                                    
                                    <div className="mt-5">
                                        <LoadingButton type="submit" fullWidth className="p-3 rounded-15 font-weight-bold text-black bg-color-2">
                                            <span className="ft-16">親追加</span>
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


export default ParentRegister;