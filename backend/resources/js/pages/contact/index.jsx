import React, { useState } from 'react';
import { Button } from '@material-ui/core';
import axios from 'axios';

import { CircularProgress  } from '@material-ui/core';


const Contact = () => {

    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    
    const [loading, setLoading] = useState(false);
    const [_422errors, set422Errors] = useState({ email:'', message:'' })
    const [_400error, set400Error] = useState('');


    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);                            //show progressbar
        const formdata = new FormData();
        formdata.append('email', email);
        formdata.append('message', message);
        axios.post('/api/contacts/register/', formdata)
        .then(response => {
            if(response.data.status_code == 200){
                window.location.href = '/contact-us/complete';
            }
            else if(response.data.status_code == 422){
                set422Errors(response.data.error_messages);
            }
            else if(response.data.status_code == 400){
                set400Error(response.data.error_messages);
            }
            setLoading(false)
        })
        .catch(err=>console.log(err))
    }


	return (
        <form onSubmit={handleSubmit} noValidate>
            <p className="text-center font-weight-bold ft-20">お問い合わせ</p>
            {
                _400error.length != 0 && 
                    <span className="l-alert__text--error ft-16 ft-md-14">{_400error}</span>
            }
            <div className="edit-set">
                <label htmlFor="email" className="control-label ft-md-12">メールアドレス</label>
                <input type="email" name="email" id="email" className={`input-default ${  _422errors.email && "is-invalid c-input__target" } `}  value={email} onChange={e=>setEmail(e.target.value)} autoFocus/>
                {
                    _422errors.email &&
                        <span className="l-alert__text--error ft-16 ft-md-14">{_422errors.email}</span> 
                }
            </div>

            <div className="edit-set">
                <label htmlFor="message"   className="control-label ft-md-12"> お問合せ内容 </label>
                <textarea name="message" id="message" rows="7" className={`input-default h-auto ${ _422errors.message && "is-invalid c-input__target" } `} value={message} onChange={e=>setMessage(e.target.value)}/>
                {
                    _422errors.message &&
                        <span className="l-alert__text--error ft-16 ft-md-14">{_422errors.message}</span> 
                }
            </div>

            <div className="mt-5">
                <Button type="submit" fullWidth className="p-4 rounded-20 ft-15 font-weight-bold text-black bg-yellow"> 送信 </Button>
            </div>

            { 
                loading &&  <div style={{position: 'fixed', left: 'calc( 50% - 20px)', top:'45%'}}> <CircularProgress /></div>
            }
        </form>
	)
}


export default Contact;