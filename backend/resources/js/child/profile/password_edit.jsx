import React, { useState, useRef, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoadingButton } from '@material-ui/lab';

import { HeaderContext } from '../../context';
import Notification from '../../component/notification';
import Alert from '../../component/alert';


const ChildProfilePasswordEdit = () => {

    const navigator = useNavigate();
    const { isAuthenticate } = useContext(HeaderContext);

    const child_id = localStorage.getItem('child_id');
    const [notice, setNotice] = useState(-1);

    const [password, setPassword] = useState('');
    const [password_confirmation, setConfirmPassword] = useState('');

    const [_422errors, set422Errors] = useState({
        password:'',
        password_confirmation:''
    });
    const [_400error, set400Error] = useState('');
    const [_success, setSuccess] = useState('');
    const [submit, setSubmit] = useState(false);


    const isMountedRef = useRef(true);
    useEffect(() => {
        isMountedRef.current = false;
        return () => {
            isMountedRef.current = true;
        }
    }, [])


    const handleSubmit = (e) => {
        e.preventDefault();
        if(isAuthenticate()){
            set422Errors({
                password:'',
                password_confirmation:''
            });
            setSubmit(true);
            const post = {
                password: password,
                password_confirmation: password_confirmation
            }
    
            axios.put(`/api/children/updatePassword/${child_id}`, post)
            .then(response => {
                if(isMountedRef.current) return;
    
                setSubmit(false);
                setNotice(response.data.notice);
                switch(response.data.status_code){
                    case 200: {
                        navigator('/c-account/profile', { state: response.data.success_messages });
                        break;
                    }
                    case 400: set400Error(response.data.error_messages); break;
                    case 422: window.scrollTo(0, 0); set422Errors(response.data.error_messages); break;
                }
            })
        }
    }



	return (
        <div className="l-content">
            <div className="l-content-w560">
                <div className="l-content__ttl">
                    <div className="l-content__ttl__left">
                        <h2>?????????????????????</h2>
                    </div>
                    <Notification notice={notice}/>
                </div>

                <div className="l-content-wrap">
                    <section className="edit-container">
                        <div className="edit-wrap">
                            <div className="edit-content">
                                <form onSubmit={handleSubmit} className="edit-form">
                                    <div className="edit-set">
                                        <label htmlFor="password"   className="control-label ft-14 ft-md-12">
                                            ????????????????????????
                                        </label>
                                        <input type="password" name="password" id="password" placeholder='???????????????8????????????' className={`input-default input-h60 ${ _422errors.password && "is-invalid  c-input__target" }`}
                                            value={password} onChange={e=>setPassword(e.target.value)} autoFocus/>
                                        {
                                            _422errors.password &&
                                                <span className="l-alert__text--error ft-16 ft-md-14">
                                                    { _422errors.password }
                                                </span>
                                        }
                                    </div>

                                    <div className="edit-set">
                                        <label htmlFor="password_confirmation"   className="control-label ft-14 ft-md-12">
                                            ?????????????????????????????????
                                        </label>
                                        <input type="password" name="password_confirmation" id="password_confirmation" className={`input-default input-h60 ${ _422errors.password_confirmation && "is-invalid  c-input__target" }`}
                                            value={password_confirmation} onChange={e=>setConfirmPassword(e.target.value)}/>
                                        {
                                            _422errors.password_confirmation &&
                                                <span className="l-alert__text--error ft-16 ft-md-14">
                                                    { _422errors.password_confirmation }
                                                </span>
                                        }
                                    </div>

                                    <LoadingButton type="submit" fullWidth
                                        loading = {submit}
                                        className="btn-edit btn-default btn-h75 bg-yellow rounded-20">
                                        <span className={`ft-16 font-weight-bold ${!submit && 'text-black'}`}>????????????????????????</span>
                                    </LoadingButton>
                                    { _400error && <Alert type="fail" hide={()=>set400Error('')}>{_400error}</Alert> }
                                    { _success && <Alert type="success" hide={()=>setSuccess('')}>{_success}</Alert> }
                                </form>

                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    )
}


export default ChildProfilePasswordEdit;
