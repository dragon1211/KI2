import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Button } from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';

import axios from 'axios';

import { CircularProgress  } from '@material-ui/core';


const AdminLogin = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const [submit, setSubmit] = useState(false);
    const [_422errors, set422Errors] = useState({ email:'', password:'' })
    const [_400error, set400Error] = useState('');

    const init_error = () => {
        set422Errors({ email:'', password:'' });
        set400Error('');
    }


    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmit(true);                            //show progressbar
        const formdata = new FormData();
        formdata.append('email', email);
        formdata.append('password', password);

        init_error();

        axios.post('/api/admin/login', formdata)
        .then(response => {
            if(response.data.status_code == 200){
                window.location.href = '/admin/meeting';
            }
            else if(response.data.status_code == 422){
                set422Errors(response.data.error_messages);
            }
            else if(response.data.status_code == 400){
                set400Error(response.data.error_message);
            }
            setSubmit(false)
        })
        .catch(err=>console.log(err))
    }


	return (
    <main className="l-single-main">
        <div className="l-centeringbox">
            <div className="l-centeringbox-wrap">
                <div className="l-single-container">
                    <div className="l-single-inner">
                        
                        <form onSubmit={handleSubmit} noValidate>
                            <h1 className="text-center font-weight-bold ft-25 pb-40-px">管理者ログイン</h1>
                            {
                                _400error && 
                                    <span className="l-alert__text--error ft-16 ft-md-14">{_400error}</span>
                            }
                            <div className="edit-set">
                                <label htmlFor="email" className="control-label ft-md-12">メールアドレス</label>
                                <input type="email" name="email" id="email" className={`input-default ${  _422errors.email && "is-invalid c-input__target" } `}  value={email} onChange={e=>setEmail(e.target.value)} autoFocus/>
                                {
                                    _422errors.email &&
                                        <span className="l-alert__text--error ft-16 ft-md-14">
                                            {_422errors.email}
                                        </span> 
                                }
                            </div>

                            <div className="edit-set">
                                <label htmlFor="password"   className="control-label ft-14 ft-md-12"> パスワード </label>
                                <input type="password" name="password" id="password" className={`input-default ${ _422errors.password && "is-invalid  c-input__target" }`}  value={password} onChange={e=>setPassword(e.target.value)} />
                                {  
                                    _422errors.password && 
                                        <span className="l-alert__text--error ft-16 ft-md-14">
                                            {_422errors.password}
                                        </span> 
                                }
                            </div>

                            <LoadingButton type="submit" 
                                loading={submit} 
                                fullWidth 
                                className="rounded-20 p-4 mt-5" 
                                style={{backgroundColor:'#F0DE00'}}
                            > 
                                <h4 className="mb-0 font-weight-bold" style={{fontSize:'18px'}}>
                                    ログイン
                                </h4> 
                            </LoadingButton>

                        </form>
                    </div>
                </div>
            </div>
        </div>
    </main>
        
	)
}


// ----------------------------------------------------------------------
if(document.getElementById('admin-login')){
	ReactDOM.render(
		<AdminLogin />,
		document.getElementById('admin-login')
	)
}