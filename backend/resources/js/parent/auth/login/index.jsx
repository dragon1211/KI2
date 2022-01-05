import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LoadingButton } from '@material-ui/lab';
import Alert from '../../../component/alert';


const ParentLogin = () => {

    const location = useLocation();

    const [submit, setSubmit] = useState(false);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [_422errors, set422Errors] = useState({email: '', password: ''});
    const [_400error, set400Error] = useState(location.state);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmit(true);
        set422Errors({email:'', password:''});

        const formdata = new FormData();
        formdata.append('email', email);
        formdata.append('password', password);

        await axios.post('/api/fathers/login/', formdata)
            .then(response => {
                setSubmit(false)
                switch(response.data.status_code){
                    case 200:{
                        localStorage.setItem('kiki_login_flag', true);
                        localStorage.setItem('kiki_acc_type', 'p-account');
                        localStorage.setItem('kiki_acc_id', response.data.params.id);
                        window.location.href = '/p-account/meeting';
                        break;
                    }
                    case 400: set400Error(response.data.error_message); break;
                    case 422: {
                        window.scrollTo(0, 0); 
                        set422Errors(response.data.error_messages);
                        break;
                    }
                }
                if(response.data.status_code != 200){
                    setPassword('');
                }
            })
    }

	return (
    <div className="l-single-container">
        <div className="l-single-inner">
            <form onSubmit={handleSubmit} noValidate>
            
            <p className="text-center font-weight-bold ft-25 pb-60-px">ログイン</p>

                <div className="edit-set">
                    <label htmlFor="email"   className="control-label ft-14 ft-md-12"> メールアドレス </label>
                    <input type="text" name="email" id="email" className={`input-default input-h60 ${ _422errors.email && "is-invalid  c-input__target" }`}  value={email} onChange={e=>setEmail(e.target.value)} autoFocus/>
                    {   
                        _422errors.email && 
                            <span className="l-alert__text--error ft-16 ft-md-14">
                                { _422errors.email }
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

                <div className="edit-set text-center mt-5">
                    <label htmlFor="remember_me">
                        <input  id="remember_me"  name="remember"  type="checkbox"  value="remember"/>
                        <span className="lbl padding-16">ログイン情報を保持する</span>
                    </label>
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
                    <Link to="/p-account/forgot-password" 
                        className="ft-16 text-black text-decoration-none">
                        パスワード紛失の方はコチラ
                    </Link>
                </div>
                { _400error && <Alert type="fail" hide={()=>set400Error(null)}>{_400error}</Alert>  } 
            </form>
        </div>
    </div>
	)
}



export default ParentLogin;