import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { LoadingButton } from '@material-ui/lab';

import Alert from '../../component/alert';

const Contact = () => {

    const history = useHistory();

    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    
    const [submit, setSubmit] = useState(false);
    const [_422errors, set422Errors] = useState({ email:'', message:'' })
    const [_400error, set400Error] = useState('');


    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmit(true);                            //show progressbar
        set422Errors({ email:'', message:'' });
        const formdata = new FormData();
        formdata.append('email', email);
        formdata.append('message', message);
        axios.post('/api/contacts/register', formdata)
        .then(response => {
            setSubmit(false);
            switch(response.data.status_code){
                case 200: history.push({pathname: '/contact-us/complete',  state: {}}); break;
                case 422: set422Errors(response.data.error_messages); break;
                case 400: set400Error(response.data.error_messages); break;
            };
        })
        .catch(err=>console.log(err))
    }


	return (
        <form onSubmit={handleSubmit} noValidate>
            <p className="text-center font-weight-bold ft-25">お問い合わせ</p>
            <div className="edit-set">
                <label htmlFor="email" className="control-label ft-md-12">メールアドレス</label>
                <input type="email" name="email" id="email" className={`input-default input-h60 ${  _422errors.email && "is-invalid c-input__target" } `}  value={email} onChange={e=>setEmail(e.target.value)} autoFocus/>
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
                <LoadingButton type="submit" fullWidth 
                    className="btn-edit btn-default btn-h60 bg-yellow rounded-15 py-5"
                    loading={submit}>
                    <span className={`ft-18 font-weight-bold ${!submit && 'text-black'}`}>送信</span>
                </LoadingButton>
            </div>
            {
                _400error && <Alert type="fail" hide={()=>set400Error('')}>{_400error}</Alert>
            } 
        </form>
	)
}


export default Contact;