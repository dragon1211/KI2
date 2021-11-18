import React, { useState } from 'react';
import { LoadingButton } from '@material-ui/lab';
import axios from 'axios';
import Alert from '../../../component/alert';

const ChildForgotPassword = () => {

    const [tel, setTel] = useState('');

    const [submit, setSubmit] = useState(false);
    const [_422errors, set422Errors] = useState({tel: ''})
    const [_400error, set400Error] = useState('')
    const [_success, setSuccess] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault();
        set422Errors({tel: ''});
        setSubmit(true);

        const formdata = new FormData();
        formdata.append('tel', tel);
        axios.post('/api/children/requestPassword', formdata)
        .then(response => {
            setSubmit(false)
            switch(response.data.status_code){
                case 200: setSuccess(response.data.success_messages); break;
                case 422: set422Errors(response.data.error_messages); break;
                case 400: set400Error(response.data.error_messages); break;
                case 401: set400Error(response.data.error_messages); break;
                case 402: set400Error(response.data.error_messages); break;
            }
        })        
    }


	return (
        <form onSubmit={handleSubmit} className="edit-form">
            <p className="pb-60-px text-center font-weight-bold ft-25">パスワードを忘れた方</p>
          
            <div className="edit-set">
                <label htmlFor="tel"   className="control-label"> 電話番号 </label>
                <input type="text" name="tel" id="tel" className={`input-default input-h60 input-w480 ${ _422errors.tel && "is-invalid  c-input__target" }`}  value={tel} onChange={e=>setTel(e.target.value)} autoFocus/>
                {   
                    _422errors.tel && 
                        <span className="l-alert__text--error ft-16 ft-md-14">
                            {_422errors.tel}
                        </span> 
                }
            </div>

            <LoadingButton type="submit" 
                loading={submit} 
                fullWidth 
                className="btn-edit btn-default btn-h75 bg-yellow rounded-20 py-5"> 
                <span className={`ft-16 font-weight-bold ${!submit && 'text-black'}`}>
                    パスワード再設定URLを送信
                </span> 
            </LoadingButton>

            { _400error && <Alert type="fail" hide={()=>set400Error('')}>{_400error}</Alert> } 
            { _success && <Alert type="success" hide={()=>setSucess('')}> {_success}</Alert> }
        </form>
	)
}


export default ChildForgotPassword;