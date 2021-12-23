import React, { useState } from 'react';
import { LoadingButton } from '@material-ui/lab';
import axios from 'axios';
import Alert from '../../../component/alert';

const ParentForgotPassword = () => {

    const [email, setEmail] = useState('');

    const [submit, setSubmit] = useState(false);
    const [_422errors, set422Errors] = useState({email: ''})
    const [_400error, set400Error] = useState('')
    const [_success, setSuccess] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault();
        set422Errors({email: ''});
        setSubmit(true);

        const formdata = new FormData();
        formdata.append('email', email);
        axios.post('/api/fathers/requestPassword', formdata)
        .then(response => {
            setSubmit(false)
            switch(response.data.status_code){
                case 200: setSuccess(response.data.success_messages); break;
                case 400: set400Error(response.data.error_messages); break;
                case 422: window.scrollTo(0, 0); set422Errors(response.data.error_messages); break;
            }
        })        
    }


	return (
    <div className="l-single-container">
        <div className="l-single-inner">
            <form onSubmit={handleSubmit} className="edit-form">
                <p className="pb-60-px text-center font-weight-bold ft-25">パスワードを忘れた方</p>
            
                <div className="edit-set">
                    <label htmlFor="email"   className="control-label"> メールアドレス </label>
                    <input type="text" name="email" id="email" className={`input-default input-h60 input-w480 ${ _422errors.email && "is-invalid  c-input__target" }`}  value={email} onChange={e=>setEmail(e.target.value)} autoFocus/>
                    {   
                        _422errors.email && 
                            <span className="l-alert__text--error ft-16 ft-md-14">
                                {_422errors.email}
                            </span> 
                    }
                </div>

                <LoadingButton type="submit" 
                    loading={submit} 
                    fullWidth 
                    className="btn-edit btn-default btn-h75 bg-yellow rounded-20"> 
                    <span className={`ft-16 font-weight-bold ${!submit && 'text-black'}`}>
                        パスワード再設定URLを送信
                    </span> 
                </LoadingButton>
                { _400error && <Alert type="fail" hide={()=>set400Error('')}>{_400error}</Alert> } 
                { _success && <Alert type="success" hide={()=>setSucess('')}> {_success}</Alert> }
            </form>
        </div>
    </div>
	)
}


export default ParentForgotPassword;