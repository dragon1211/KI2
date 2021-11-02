import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { LoadingButton } from '@material-ui/lab';
import axios from 'axios';

import Alert from '../../component/alert';

const AdminLogin = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const [submit, setSubmit] = useState(false);
    const [_422errors, set422Errors] = useState({ email:null, password:null })
    const [_400error, set400Error] = useState(null);
    const [_success, setSuccess] = useState(null);

    const init_error = () => {
        set422Errors({ email:null, password:null });
        set400Error(null);
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
                localStorage.setItem("from_login", true);
                window.location.href = "/admin/meeting";
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
                            <div className="edit-set">
                                <label htmlFor="email" className="control-label ft-md-12">メールアドレス</label>
                                <input type="email" name="email" id="email" className={`input-default input-h60 ${  _422errors.email && "is-invalid c-input__target" } `}  value={email} onChange={e=>setEmail(e.target.value)} autoFocus/>
                                {
                                    _422errors.email &&
                                        <span className="l-alert__text--error ft-16 ft-md-14">
                                            {_422errors.email}
                                        </span> 
                                }
                            </div>

                            <div className="edit-set">
                                <label htmlFor="password"   className="control-label ft-14 ft-md-12"> パスワード </label>
                                <input type="password" name="password" id="password" className={`input-default input-h60 ${ _422errors.password && "is-invalid  c-input__target" }`}  value={password} onChange={e=>setPassword(e.target.value)} />
                                {  
                                    _422errors.password && 
                                        <span className="l-alert__text--error ft-16 ft-md-14">
                                            {_422errors.password}
                                        </span> 
                                }
                            </div>
                            
                            <div className="mt-5">
                                <LoadingButton type="submit" 
                                    loading={submit} 
                                    fullWidth 
                                    className="btn-edit btn-default btn-h60 bg-yellow rounded-15"> 
                                    <span className={`ft-18 font-weight-bold ${!submit && 'text-black'}`}>
                                        ログイン
                                    </span> 
                                </LoadingButton>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </div>
        {
          _400error && <Alert type="fail" hide={()=>set400Error(null)}>{_400error}</Alert>
        } 
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