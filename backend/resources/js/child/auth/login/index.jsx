import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { LoadingButton } from '@material-ui/lab';
import axios from 'axios';
import Alert from '../../../component/alert';


const ChildLogin = () => {

    const [submit, setSubmit] = useState(false);

    const [tel, setTel] = useState('');
    const [password, setPassword] = useState('');

    const [_422errors, set422Errors] = useState({tel: '', password: ''});
    const [_400error, set400Error] = useState(null);


    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmit(true);
        set422Errors({tel:'', password:''});

        const formdata = new FormData();
        formdata.append('tel', tel);
        formdata.append('password', password);
        axios.post('/api/children/login/', formdata)
        .then(response => {
            setSubmit(false)
            switch(response.data.status_code){
                case 200:{
                    localStorage.setItem("from_login", true);
                    window.location.href = '/c-account/meeting';
                    break;
                }
                case 422: set422Errors(response.data.error_messages); break;
                case 400: set400Error(response.data.error_message[0]); break;
            }
        })
        .catch(err=>console.log(err))
    }

	return (
        <form onSubmit={handleSubmit} noValidate>
           
           <p className="text-center font-weight-bold ft-25 pb-60-px">ログイン</p>

            <div className="edit-set">
                <label htmlFor="tel"   className="control-label ft-14 ft-md-12"> 電話番号 </label>
                <input type="text" name="tel" id="tel" className={`input-default input-h60 ${ _422errors.tel && "is-invalid  c-input__target" }`}  value={tel} onChange={e=>setTel(e.target.value)} autoFocus/>
                {   
                    _422errors.tel && 
                        <span className="l-alert__text--error ft-16 ft-md-14">
                            { _422errors.tel }
                        </span> 
                }
            </div>

            <div className="edit-set">
                <label htmlFor="password"   className="control-label ft-14 ft-md-12"> パスワード </label>
                <input type="password" name="password" id="password" className={`input-default input-h60 ${ _422errors.password && "is-invalid  c-input__target" }`}  value={password} onChange={e=>setPassword(e.target.value)}/>
                {  
                    _422errors.password && 
                        <span className="l-alert__text--error ft-16 ft-md-14">
                            { _422errors.password }
                        </span> 
                }
            </div>

            <div className="edit-set mt-5">
                <div className="c-input__checkbox text-center">
                    <label htmlFor="remember_me" className="m-0 ft-18 ft-md-16">
                        <span>ログイン情報を保持する</span>
                        <input  id="remember_me"  name="remember"  type="checkbox"  value="remember"/>
                        <div className="color-box"></div>
                    </label>
                </div>
            </div>

            <div className="mt-5">
                <LoadingButton type="submit" 
                    loading={submit} 
                    fullWidth 
                    className="btn-edit btn-default btn-h75 bg-yellow rounded-20"> 
                    <span className={`ft-16 font-weight-bold ${!submit && 'text-black'}`}>
                        ログイン
                    </span> 
                </LoadingButton>
            </div>

            <div className="mt-5 text-center">
                <Link to="/c-account/forgot-password" 
                    className="ft-16 text-black text-decoration-none">
                    パスワード紛失の方はコチラ
                </Link>
            </div>
            {
                _400error && <Alert type="fail" hide={()=>set400Error(null)}>{_400error}</Alert>
            } 
        </form>
	)
}



export default ChildLogin;