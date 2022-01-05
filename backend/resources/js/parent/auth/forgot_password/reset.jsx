import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { LoadingButton } from '@material-ui/lab';

import Alert from '../../../component/alert';

const ParentForgotPasswordReset = () => {

    const navigator = useNavigate();
    const params = useParams();

    const [submit, setSubmit] = useState(false);

    const [password, setPassword] = useState('');
    const [password_confirmation, setPasswordConfirmation] = useState('');

    const [_422errors, set422Errors] = useState({password:'', password_confirmation:''})
    const [_400error, set400Error] = useState('')


    const handleSubmit = async (e) => {
        e.preventDefault();
        set422Errors({password:'', password_confirmation:''});
        setSubmit(true);
        let req = {
            password: password,
            password_confirmation: password_confirmation,
            token: params?.token
        }

        await axios.put('/api/fathers/updatePassword', req)
            .then(response => {
                setSubmit(false);
                switch(response.data.status_code){
                    case 200: {
                        navigator('/p-account/forgot-password/complete',  {state: response.data.success_messages});
                        break;
                    }
                    case 400: set400Error(response.data.error_messages); break;
                    case 422: window.scrollTo(0, 0); set422Errors(response.data.error_messages); break;
                }
            })
    }


	return (
    <div className="l-single-container">
        <div className="l-single-inner">
            <form onSubmit={handleSubmit} className="edit-form">
                <p className="pb-60-px text-center font-weight-bold ft-25">パスワード再登録</p>
                <div className="edit-set">
                    <label htmlFor="password"   className="control-label ft-14 ft-md-12">
                        パスワード
                    </label>
                    <input type="password" name="password" id="password" placeholder='半角英数字8文字以上' className={`input-default input-h60 input-w480 ${ _422errors.password && "is-invalid  c-input__target" }`}
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
        </div>
    </div>
	)
}


export default ParentForgotPasswordReset
