import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { LoadingButton } from '@material-ui/lab';
import axios from 'axios';

import Alert from '../../../component/alert';

const ParentForgotPasswordReset = (props) => {

    const history = useHistory();
    const [submit, setSubmit] = useState(false);

    const [password, setPassword] = useState('');
    const [password_confirmation, setPasswordConfirmation] = useState('');

    const [_422errors, set422Errors] = useState({password:'', password_confirmation:''})
    const [_400error, set400Error] = useState('')


    const handleSubmit = (e) => {
        e.preventDefault();
        set422Errors({password:'', password_confirmation:''});
        setSubmit(true);
        let req = {
            password: password,
            password_confirmation: password_confirmation,
            token: props.match.params?.token
        }
        axios.put('/api/fathers/updatePassword', req)
        .then(response => {
            setSubmit(false);
            switch(response.data.status_code){
                case 200: {
                    history.push({pathname: '/p-account/forgot-password/complete',  state: response.data.success_messages}); 
                    break;
                }
                case 422: set422Errors(response.data.error_messages); break;
                case 400: set400Error(response.data.error_messages); break;
            }
        })
    }


	return (
        <form onSubmit={handleSubmit} className="edit-form">
            <p className="pb-60-px text-center font-weight-bold ft-25">パスワード再登録</p>
            <div className="edit-set">
                <label htmlFor="password"   className="control-label ft-14 ft-md-12"> 
                    パスワード 
                </label>
                <input type="password" name="password" id="password" className={`input-default input-h60 input-w480 ${ _422errors.password && "is-invalid  c-input__target" }`}
                    value={password} onChange={e=>setPassword(e.target.value)} autoFocus/>
                {   
                    _422errors.password && 
                        <span className="l-alert__text--error ft-16 ft-md-14">
                            { _422errors.password }
                        </span> 
                }
            </div>

            <div className="edit-set">
                <label htmlFor="password_confirmation" className="control-label ft-14 ft-md-12"> 
                    確認用パスワード
                </label>
                <input type="password" name="password_confirmation" id="password_confirmation" className={`input-default input-h60 input-w480 ${ _422errors.password_confirmation && "is-invalid  c-input__target" }`}  
                    value={password_confirmation} onChange={e=>setPasswordConfirmation(e.target.value)} />
                {   
                    _422errors.password_confirmation && 
                        <span className="l-alert__text--error ft-16 ft-md-14">
                            { _422errors.password_confirmation }
                        </span> 
                }
            </div>
          
            <LoadingButton type="submit" 
                loading={submit} 
                fullWidth 
                className="btn-edit btn-default btn-h75 bg-yellow rounded-20"> 
                <span className={`ft-16 font-weight-bold ${!submit && 'text-black'}`}>
                    パスワードを更新する
                </span> 
            </LoadingButton>
            { _400error && <Alert type="fail" hide={()=>set400Error('')}>{_400error}</Alert> } 
        </form>
	)
}


export default ParentForgotPasswordReset