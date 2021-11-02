import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { LoadingButton } from '@material-ui/lab';

import axios from 'axios';

import Alert from '../../component/alert';


const ParentRegister = () => {

    const history = useHistory();

    const [email, setEmail] = useState('');

    const [_422errors, set422Errors] = useState({ email: '' });
    const [_400error, set400Error] = useState('');
    const [_success, setSuccess] = useState('');

    const [submit, setSubmit] = useState(false);


    const handleSubmit = (e) => {
        e.preventDefault();

        setSubmit(true);
        const formdata = new FormData();
        formdata.append('email', email);
        axios.post('/api/admin/fathers/registerTemporary', formdata)
        .then(response => {
            setSubmit(false);
            switch(response.data.status_code){
                case 200: setSuccess(response.data.success_messages); break;
                case 422: set422Errors(response.data.error_messages); break;
                case 400: set400Error(response.data.error_messages); break;
            }
        })
        .catch(err=>console.log(err))
    }


    
	return (
        <div className="l-content">
            <div className="l-content-w560">
                <div className="l-content__ttl">
                    <div className="l-content__ttl__left">
                        <h2>親追加</h2>
                    </div>
                </div>

                <div className="l-content-wrap">
                    <section className="profile-container">
                        <div className="profile-wrap">
                            <div className="mx-5">
                                <form onSubmit={handleSubmit} noValidate>
                                                            
                                    <div className="edit-set">
                                        <label htmlFor="email"   className="control-label ft-12"> メールアドレス </label>
                                        <input type="email" name="email" id="email"  className = {`input-default input-nameSei input-h60 ${ _422errors.email && "is-invalid c-input__target" }`}  value={email} onChange={e=>setEmail(e.target.value)}/>
                                        {
                                            _422errors.email && 
                                                <span className="l-alert__text--error ft-16 ft-md-14">
                                                    { _422errors.email }
                                                </span>
                                        }
                                    </div>
                                    
                                    <div className="mt-5">
                                        <LoadingButton type="submit" fullWidth 
                                            className="btn-edit btn-default btn-h60 bg-yellow rounded-15"
                                            loading={submit}>
                                            <span className={`ft-20 font-weight-bold ${!submit && 'text-black'}`}>親追加</span>
                                        </LoadingButton>
                                    </div>
                                    {
                                        _400error && <Alert type="fail" hide={()=>set400Error('')}>{_400error}</Alert>
                                    } 
                                    {
                                        _success && <Alert type="success" hide={()=>setSuccess('')}>{_success}</Alert>
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