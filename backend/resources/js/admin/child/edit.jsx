import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { LoadingButton } from '@material-ui/lab';
import { CircularProgress  } from '@material-ui/core';

import Alert from '../../component/alert';


const ChildEdit = (props) => {

    const history = useHistory();

    const [first_name, setFirstName] = useState('');
    const [last_name, setLastName] = useState('');  
    const [identify, setIdentify] = useState(props.match.params.child_id);  
    const [email, setEmail] = useState('');
    const [tel, setTelephone] = useState('');
    const [company, setCompany] = useState('');

    const [_422errors, set422Errors] = useState({
        first_name:'',
        last_name:'',
        identify:'',
        email:'',
        tel:'',
        company:''
    })
    const [_400error, set400Error] = useState('');
    const [_success, setSuccess] = useState('');

    const [submit, setSubmit] = useState(false);
    const [loaded, setLoaded] = useState(false);


    useEffect(
        () => {
            setLoaded(false);
            axios.get(`/api/admin/children/detail/${props.match.params?.child_id}`)
            .then(response => {
                setLoaded(true);
                if(response.data.status_code==200)
                {
                    var child = response.data.params[0];
                    if(child){
                        setFirstName(child?.first_name);
                        setLastName(child?.last_name);
                        // setIdentify(child?.identify);
                        setEmail(child?.email);
                        setTelephone(child?.tel);
                        setCompany(child?.company);
                    }
                }
            })
            .catch(err=>console.log(err))
        },[]
    );



    const handleSubmit = (e) => {
        e.preventDefault();

        set422Errors({
            first_name:'',
            last_name:'',
            identify:'',
            email:'',
            tel:'',
            company:''
        });

        setSubmit(true);
        
        var request = {
            first_name: first_name,
            last_name: last_name,
            identify: identify,
            email: email,
            tel: tel,
            company: company
        };

        axios.put(`/api/admin/children/updateProfile/${props.match.params?.child_id}`, request)
        .then(response => {
            setSubmit(false);
            switch(response.data.status_code){
                case 200: setSuccess(response.data.success_messages); break;
                case 400: set400Error(response.data.error_messages); break;
                case 422: set422Errors(response.data.error_messages); break;
            }
        })
        .catch(err=>console.log(err))
    }


    
	return (
    <div className="l-content">
        <div className="l-content-w560">
            <div className="l-content__ttl">
                <div className="l-content__ttl__left">
                    <h2>プロフィール編集</h2>
                </div>
            </div>

            <div className="l-content-wrap">
                <section className="profile-container position-relative">
                    {
                        !loaded &&
                            <CircularProgress color="secondary" style={{top:'30%', left:'calc(50% - 22px)', color:'green', position:'absolute', zIndex:'10'}}/>
                    }
                    <div className="profile-wrap">
                        <div className="mx-5">
                            <form onSubmit={handleSubmit} noValidate>

                                <div className="edit-set">
                                    <label htmlFor="identify" className="control-label ft-12"> ID </label>
                                    <input type="text" name="identify" id="identify"  className={`input-default input-nameSei input-h60 ${ _422errors.identify && "is-invalid c-input__target" }`} value={identify} onChange={e=>setIdentify(e.target.value)}/>
                                    {
                                        _422errors.identify &&
                                            <span className="l-alert__text--error ft-16 ft-md-14">
                                                { _422errors.identify }
                                            </span>
                                    }
                                </div>
                                                        
                                <div className="edit-set">
                                    <label htmlFor="first_name"  className="control-label ft-12"> 姓 </label>
                                    <input type="text" name="first_name" id="first_name"  className={`input-default input-nameSei input-h60 ${ _422errors.first_name && "is-invalid c-input__target" }`}  value={first_name} onChange={e=>setFirstName(e.target.value)}/>
                                    {
                                        _422errors.first_name &&
                                            <span className="l-alert__text--error ft-16 ft-md-14">
                                                { _422errors.first_name }
                                            </span>
                                    }
                                </div>

                                <div className="edit-set">
                                    <label htmlFor="last_name" className="control-label ft-12"> 名 </label>
                                    <input type="text" name="last_name" id="last_name"  className={`input-default input-nameSei input-h60 ${ _422errors.last_name && "is-invalid c-input__target" }`} value={last_name} onChange={e=>setLastName(e.target.value)}/>
                                    {
                                        _422errors.last_name &&
                                            <span className="l-alert__text--error ft-16 ft-md-14">
                                                { _422errors.last_name }
                                            </span>
                                    }
                                </div>

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
                                    <label htmlFor="tel" className="control-label ft-12"> 電話番号 </label>
                                    <input type="tel" name="tel" id="tel"  className = {`input-default input-nameSei input-h60 ${ _422errors.tel && "is-invalid c-input__target" }`}  value={tel} onChange={e=>setTelephone(e.target.value)}/>
                                    {
                                        _422errors.tel &&
                                            <span className="l-alert__text--error ft-16 ft-md-14">
                                                { _422errors.tel }
                                            </span>
                                    }
                                </div>

                                <div className="edit-set">
                                    <label htmlFor="company"   className="control-label ft-12"> 所屈している会社名を記載 </label>
                                    <input type="text" name="company" id="company"  className = {`input-default input-nameSei input-h60 ${ _422errors.company && "is-invalid c-input__target" }`}  value={company} onChange={e=>setCompany(e.target.value)}/>
                                    {
                                        _422errors.company &&
                                            <span className="l-alert__text--error ft-16 ft-md-14">
                                                { _422errors.company }
                                            </span>
                                    }
                                </div>
                                
                                <div className="mt-5">
                                    <LoadingButton type="submit" fullWidth 
                                        loading={submit}
                                        className="p-3 rounded-15 font-weight-bold bg-color-2 input-h60">
                                        <span className="ft-16">プロフィールを更新</span>
                                    </LoadingButton>
                                </div>
                                {
                                    _400error && <Alert type="fail" hide={()=>set400Error('')}>{_400error}</Alert>
                                } 
                                {
                                    _success && 
                                    <Alert type="success" 
                                    hide={()=>  
                                        history.push({
                                        pathname: `/admin/child/detail/${props.match.params?.child_id}`,
                                        state: {}
                                    })}>{_success}</Alert>
                                }
                            </form>
        
                        </div>
                    </div>
                </section>   
            </div>
        </div>
    </div>
    )
}


export default ChildEdit;