import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LoadingButton } from '@material-ui/lab';
import Alert from '../../../component/alert';

const ChildSignUpTemporary = () => {
    const [tel, setTel] = useState('');
    const [submit, setSubmit] = useState(false);

    const [_400error, set400Error] = useState('');
    const [_422errors, set422Errors] = useState({tel:''});
    const [_success, setSuccess] = useState('');

    const handleSubmit = (e) => {

        e.preventDefault();
        set422Errors({tel:''});

        const formdata = new FormData();
        formdata.append('tel', tel);
        setSubmit(true);
        axios.post('/api/children/registerTemporary', formdata)
        .then(response => {
            setSubmit(false);
            switch(response.data.status_code){
                case 200: setSuccess("SMSに本登録案内のメッセージを送信しました。本登録を行ってください。"); break;
                case 400: set400Error(response.data.error_messages); break;
                case 422: window.scrollTo(0, 0); set422Errors(response.data.error_messages); break;
            };
        })
    }


	return (
    <div className="l-single-container">
        <div className="l-single-inner">
            <form onSubmit={handleSubmit} className="edit-form">
                <p className="pb-40-px text-center font-weight-bold ft-25">仮登録手続き</p>
                <div className="edit-set">
                    <label htmlFor="tel"   className="control-label ft-14 ft-md-12"> 電話番号 </label>
                    <input type="text" name="tel" id="tel"
                        className={`input-default input-h60 input-w480 ${ _422errors.tel && "is-invalid  c-input__target" }`}
                        value={tel}
                        onChange={e=>setTel(e.target.value)} autoFocus/>
                    {
                        _422errors.tel &&
                        <span className="l-alert__text--error ft-16 ft-md-14">
                            {_422errors.tel}
                        </span>
                    }
                </div>
                <LoadingButton type="submit" fullWidth
                    className="btn-edit btn-default btn-h75 bg-yellow rounded-20"
                    loading={submit}>
                    <span className={`ft-18 ft-xs-16 font-weight-bold ${!submit && 'text-black'}`}>仮登録送信</span>
                </LoadingButton>
                { _400error && <Alert type="fail" hide={()=>set400Error('')}>{_400error}</Alert> }
                { _success && <Alert type="success" hide={()=>setSuccess('')}>{_success}</Alert> }
            </form>
        </div>
    </div>
	)
}


export default ChildSignUpTemporary;
