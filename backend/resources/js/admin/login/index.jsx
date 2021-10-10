import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Button } from '@material-ui/core';
import axios from 'axios';

import { CircularProgress  } from '@material-ui/core';


const AdminLogin = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const [loading, setLoading] = useState(false);
    const [_422errors, set422Errors] = useState({ email:'', password:'' })
    const [_400error, set400Error] = useState('');


    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);                            //show progressbar
        const formdata = new FormData();
        formdata.append('email', email);
        formdata.append('password', password);
        axios.post('/api/admin/login', formdata)
        .then(response => {
            if(response.data.status_code == 200){
                window.location.href = '';
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
            <h1 className="text-center font-weight-bold ft-25 pb-40-px">管理者ログイン</h1>
            {
                _400error.length != 0 && 
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
                <input type="password" name="password" id="password" className={`input-default ${ _422errors.password && "is-invalid  c-input__target" }`}  value={password} onChange={e=>setPassword(e.target.value)} autoFocus/>
                {  
                    _422errors.password && 
                        <span className="l-alert__text--error ft-16 ft-md-14">
                            {_422errors.password}
                        </span> 
                }
            </div>

            <div className="mt-5">
                <Button type="submit" fullWidth className="p-4 rounded-20 ft-15 font-weight-bold text-black bg-color-2"> ログイン </Button>
            </div>

            { 
                loading &&  <div style={{position: 'fixed', left: 'calc( 50% - 20px)', top:'45%'}}> <CircularProgress /></div>
            }
        </form>
	)
}


// ----------------------------------------------------------------------
if(document.getElementById('admin-login')){
	ReactDOM.render(
		<AdminLogin />,
		document.getElementById('admin-login')
	)
}