import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { LoadingButton } from '@material-ui/lab';

import axios from 'axios';

import Alert from '../../component/alert';


const ParentRegister = () => {

    const history = useHistory();

    const [email, setEmail] = useState('');
    const [limit, setLimit] = useState('');
    const [_422errors, set422Errors] = useState({ email: '', relation_limit: '' });
    const [_400error, set400Error] = useState('');
    const [_success, setSuccess] = useState('');
    const [submit, setSubmit] = useState(false);


    const handleSubmit = (e) => {
        e.preventDefault();
        set422Errors({ email: '' })
        setSubmit(true);
        const formdata = new FormData();
        formdata.append('email', email);
        formdata.append('relation_limit', limit);
        axios.post('/api/admin/fathers/registerTemporary', formdata)
        .then(response => {
            setSubmit(false);
            switch(response.data.status_code){
                case 200: setSuccess(response.data.success_messages); break;
                case 400: set400Error(response.data.error_messages); break;
                case 422: window.scrollTo(0, 0); set422Errors(response.data.error_messages); break;
            }
        })
        .catch(err=>console.log(err))
    }


	return (
        <div className="l-content">
            <div className="l-content-w560">
                <div className="l-content__ttl">
                    <div className="l-content__ttl__left">
                        <h2>親追加</h2>
                    </div>
                </div>
                <div className="l-content-wrap">
                    <section className="edit-container">
                        <div className="edit-wrap">
                            <form onSubmit={handleSubmit} className="edit-form">
                                                        
                                <div className="edit-set">
                                    <label htmlFor="email"   className="control-label ft-12"> メールアドレス </label>
                                    <input type="email" name="email" id="email"  className = {`input-default input-nameSei input-h60 ${ _422errors.email && "is-invalid c-input__target" }`}  value={email} onChange={e=>setEmail(e.target.value)}/>
                                    {
                                        _422errors.email && 
                                            <span className="l-alert__text--error ft-16 ft-md-14">
                                                { _422errors.email }
                                            </span>
                                    }
                                </div>

                                <div className="edit-set">
                                    <label htmlFor="relation_limit"   className="control-label ft-12"> 子の人数制限 </label>
                                    <input type="number" min="0" step="1" name="relation_limit" id="relation_limit"  className = {`input-default input-nameSei input-h60 ${ _422errors.relation_limit && "is-invalid c-input__target" }`}  value={limit} onChange={e=>setLimit(e.target.value)}/>
                                    {
                                        _422errors.relation_limit && 
                                            <span className="l-alert__text--error ft-16 ft-md-14">
                                                { _422errors.relation_limit }
                                            </span>
                                    }
                                </div>
                                
                                <LoadingButton type="submit" fullWidth 
                                    className="btn-edit btn-default btn-h75 bg-yellow rounded-20"
                                    loading={submit}>
                                    <span className={`ft-18 ft-xs-16 font-weight-bold ${!submit && 'text-black'}`}>親追加</span>
                                </LoadingButton>

                                {  _400error && <Alert type="fail" hide={()=>set400Error('')}>{_400error}</Alert> } 
                                {  _success &&  <Alert type="success" hide={()=>setSuccess('')}>{_success}</Alert> }
                            </form>
        
                        </div>
                    </section>   
                </div>
            </div>
        </div>
    )
}


export default ParentRegister;