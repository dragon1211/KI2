import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { LoadingButton } from '@material-ui/lab';
import axios from 'axios';

import Alert from '../../component/alert';


const ParentPasswordEdit = (props) => {

    const history = useHistory();

    const [password, setPassword] = useState('');
    const [password_confirmation, setConfirmPassword] = useState('');

    const [_422errors, set422Errors] = useState({
        password:'',
        password_confirmation:''
    });
    const [_400error, set400Error] = useState('');
    const [_success, setSuccess] = useState('');

    const [submit, setSubmit] = useState(false)


    const handleSubmit = (e) => {
        e.preventDefault();
        set422Errors({
            password:'',
            password_confirmation:''
        });
        setSubmit(true);
        const request = {
            password: password,
            password_confirmation: password_confirmation
        }
        axios.put(`/api/admin/fathers/updatePassword/${props.match.params?.father_id}`, request)
        .then(response => {
            setSubmit(false);
            switch(response.data.status_code){
                case 200: {
                    history.push({
                    pathname: `/admin/parent/detail/${props.match.params?.father_id}`,
                    state: response.data.success_messages});
                    break;
                }
                case 400: set400Error(response.data.error_messages); break;
                case 422: window.scrollTo(0, 0); set422Errors(response.data.error_messages); break;
            }
        })
    }

	return (
        <div className="l-content">
            <div className="l-content-w560">
                <div className="l-content__ttl">
                    <div className="l-content__ttl__left">
                        <h2>パスワード編集</h2>
                    </div>
                </div>

                <div className="l-content-wrap">
                    <section className="edit-container">
                        <div className="edit-wrap">
                            <div className="edit-content">
                                <form onSubmit={handleSubmit} className="edit-form">

                                    <div className="edit-set">
                                        <label htmlFor="password"   className="control-label ft-14 ft-md-12">
                                            新しいパスワード
                                        </label>
                                        <input type="password" name="password" id="password" placeholder='半角英数字8文字以上' className={`input-default input-h60 ${ _422errors.password && "is-invalid  c-input__target" }`}
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
                                            確認用新しいパスワード
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
                                        <span className={`ft-18 ft-xs-16 font-weight-bold ${!submit && 'text-black'}`}>パスワードを更新</span>
                                    </LoadingButton>
                                    { _400error && <Alert type="fail" hide={()=>set400Error('')}> {_400error} </Alert> }
                                    { _success && <Alert type="success" hide={()=>setSuccess('')}> {_success} </Alert> }
                                </form>

                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    )
}


export default ParentPasswordEdit;
