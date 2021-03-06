import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { LoadingButton } from '@material-ui/lab';

import Alert from '../../component/alert';

const AdminLogin = () => {

    const location = useLocation();
    const navigator = useNavigate();
    const [cookies, setCookie] = useCookies(['auth']);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const [submit, setSubmit] = useState(false);
    const [_422errors, set422Errors] = useState({ email:null, password:null })
    const [_400error, set400Error] = useState(null);
    const [_success, setSuccess] = useState(null);

    const isMountedRef = useRef(true);

    useEffect(() => {
        isMountedRef.current = false;

        axios.post('/api/admin/checkSession').then(response => {
            if (isMountedRef.current) return;

            switch (response.data.status_code) {
                case 200: {
                    if(location.search == '')
                        window.location.href = "/admin/meeting";
                    else
                        window.location.href = location.search.replace('?redirect_to=', '');
                    break;
                }
                default: break;
            }
        });

        return () => {
            isMountedRef.current = true;
        }
    }, [])


    const loginOK = (id, expires) => {
        let token = {
            type: 'admin',
            id: id,
            from_login: true,
            expires: expires
        };
        
        localStorage.setItem('admin_token', JSON.stringify(token));

        if(location.search == '')
            window.location.href = "/admin/meeting";
        else
            window.location.href = location.search.replace('?redirect_to=', '');
    }


    const handleSubmit = (e) => {
        e.preventDefault();

        set422Errors({ email:'', password:'' });
        setSubmit(true);                            //show progressbar
        const formdata = new FormData();
        formdata.append('email', email);
        formdata.append('password', password);

        axios.post('/api/admin/login', formdata)
        .then(response => {
            if(isMountedRef.current) return;
            setSubmit(false)
            switch(response.data.status_code){
                case 200: {
                    loginOK(response.data.params.id, response.data.params.expire);                
                    break;
                }
                case 422: {
                    window.scrollTo(0, 0); 
                    set422Errors(response.data.error_messages); 
                    break;
                }
                case 400: {
                    set400Error(response.data.error_message);
                    break;
                }
            }
            if(response.data.status_code != 200){
            setPassword('');
            }            
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
                            <h1 className="text-center font-weight-bold ft-25 pb-40-px">?????????????????????</h1>
                            <div className="edit-set">
                                <label htmlFor="email" className="control-label ft-md-12">?????????????????????</label>
                                <input type="email" name="email" id="email" className={`input-default input-h60 ${  _422errors.email && "is-invalid c-input__target" } `}  value={email} onChange={e=>setEmail(e.target.value)} autoFocus/>
                                {
                                    _422errors.email &&
                                        <span className="l-alert__text--error ft-16 ft-md-14">
                                            {_422errors.email}
                                        </span> 
                                }
                            </div>

                            <div className="edit-set">
                                <label htmlFor="password"   className="control-label ft-14 ft-md-12"> ??????????????? </label>
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
                                    className="btn-edit btn-default btn-h75 bg-yellow rounded-20"> 
                                    <span className={`ft-16 font-weight-bold ${!submit && 'text-black'}`}>
                                        ????????????
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


export default AdminLogin;
