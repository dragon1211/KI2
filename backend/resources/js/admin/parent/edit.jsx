import React, { useRef, useEffect, useState, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { LoadingButton } from '@material-ui/lab';

import { HeaderContext } from '../../context';
import Alert from '../../component/alert';
import PageLoader from '../../component/page_loader';

const AdminParentEdit = () => {

    const navigator = useNavigate();
    const params = useParams();
    const { isAuthenticate } = useContext(HeaderContext);

    const [company, setCompany] = useState('');
    const [email, setEmail] = useState('');
    const [tel, setTelephone] = useState('');
    const [profile, setProfile] = useState('');  
    const [limit, setLimit] = useState('');
    const [parent, setParent] = useState(null);

    const [_422errors, set422Errors] = useState({
        company:'',
        email:'',
        tel:'',
        profile:'',
        relation_limit:''
    });
    const [_400error, set400Error] = useState('');
    const [_401error, set401Error] = useState('');
    const [_success, setSuccess] = useState('');

    const [submit, setSubmit] = useState(false);
    const [loaded, setLoaded] = useState(false);

    const isMountedRef = useRef(true);
    
    useEffect(() => {
        isMountedRef.current = false;

        if(isAuthenticate()){
            setLoaded(false);
            axios.get(`/api/admin/fathers/detail/${params?.father_id}`)
            .then(response => {
                if(isMountedRef.current) return;
                
                setLoaded(true);
                if(response.data.status_code==200){
                    var parent = response.data.params;
                    setParent(parent);
                    if(parent){
                        setCompany(parent?.company);
                        setEmail(parent.email);
                        setTelephone(parent.tel);
                        setProfile(parent.profile ? parent.profile: '');  
                        setLimit(parent.limit);
                    }
                }
                else{
                    set400Error("?????????????????????");
                }
            })
        }
        return () => {
            isMountedRef.current = true;
        }
    },[]);

    
    const handleSubmit = (e) => {
        e.preventDefault();
        
        if(isAuthenticate()){
            set401Error('');
            set422Errors({
                company:'',
                email:'',
                tel:'',
                profile:'',
                relation_limit:''
            });
            setSubmit(true);
            var request = {
                relation_limit: limit,
                company: company,
                email: email,
                tel: tel,
                profile: profile,
            };
    
            axios.put(`/api/admin/fathers/updateProfile/${params?.father_id}`, request)
            .then(response => {
                if(isMountedRef.current) return;
                
                setSubmit(false);
                switch(response.data.status_code){
                    case 200: {
                        navigator(`/admin/parent/detail/${params?.father_id}`,
                        { state: response.data.success_messages });
                        break;
                    }
                    case 400: set400Error(response.data.error_messages); break;
                    case 401: set401Error(response.data.error_messages); break;
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
                    <h2>????????????????????????</h2>
                </div>
            </div>

            <div className="l-content-wrap">
                <section className="edit-container">
                    {
                        !loaded && <PageLoader />
                    }
                    {
                        loaded && parent &&
                        <div className="edit-wrap">
                            <div className="edit-content">
                                <form onSubmit={handleSubmit} className="edit-form">

                                    <div className="edit-set">
                                        <label htmlFor="relation_limit"   className="control-label ft-12"> ?????????????????? </label>
                                        <input type="number" min="0" step="1" name="relation_limit" id="relation_limit"  className = {`input-default input-nameSei input-h60 ${ _422errors.relation_limit && "is-invalid c-input__target" }`}  value={limit} onChange={e=>setLimit(e.target.value)}/>
                                        {
                                            (_422errors.relation_limit || _401error) && 
                                                <span className="l-alert__text--error ft-16 ft-md-14">
                                                    { _422errors.relation_limit || _401error}
                                                </span>
                                        }
                                    </div>

                                    <div className="edit-set">
                                        <label htmlFor="company"   className="control-label ft-12"> ?????????</label>
                                        <input type="text" name="company" id="company"  className = {`input-default input-nameSei input-h60 ${ _422errors.company && "is-invalid c-input__target" }`}  value={company} onChange={e=>setCompany(e.target.value)}/>
                                        {
                                            _422errors.company &&
                                                <span className="l-alert__text--error ft-16 ft-md-14">
                                                    { _422errors.company }
                                                </span>
                                        }
                                    </div>
                                                            
                                    <div className="edit-set">
                                        <label htmlFor="email"   className="control-label ft-12"> ????????????????????? </label>
                                        <input type="email" name="email" id="email"  className = {`input-default input-nameSei input-h60 ${ _422errors.email && "is-invalid c-input__target" }`}  value={email} onChange={e=>setEmail(e.target.value)}/>
                                        {
                                            _422errors.email && 
                                                <span className="l-alert__text--error ft-16 ft-md-14">
                                                    { _422errors.email }
                                                </span>
                                        }
                                    </div>

                                    <div className="edit-set">
                                        <label htmlFor="tel" className="control-label ft-12"> ???????????? </label>
                                        <input type="text" name="tel" id="tel"  className = {`input-default input-nameSei input-h60 ${ _422errors.tel && "is-invalid c-input__target" }`}  value={tel} onChange={e=>setTelephone(e.target.value)}/>
                                        {
                                            _422errors.tel &&
                                                <span className="l-alert__text--error ft-16 ft-md-14">
                                                    { _422errors.tel }
                                                </span>
                                        }
                                    </div>

                                    <div className="edit-set">
                                        <label htmlFor="profile" className="control-label ft-12"> ?????????????????? </label>
                                        <textarea  name="profile" id="profile" rows="8" className = {`textarea-default ${ _422errors.profile && "is-invalid c-input__target" }`}  value={profile} onChange={e=>setProfile(e.target.value)}/>
                                        {
                                            _422errors.profile &&
                                                <span className="l-alert__text--error ft-16 ft-md-14">
                                                    { _422errors.profile }
                                                </span>
                                        }
                                    </div>

                                    <LoadingButton type="submit" fullWidth 
                                        className="btn-edit btn-default btn-h75 bg-yellow rounded-20"
                                        loading={submit}>
                                        <span className={`ft-18 ft-xs-16 font-weight-bold ${!submit && 'text-black'}`}>???????????????????????????</span>
                                    </LoadingButton>
                                </form>
            
                            </div>
                        </div>
                    }
                    { _400error && <Alert type="fail" hide={()=>set400Error('')}> {_400error} </Alert> } 
                    { _success && <Alert type="success" hide={()=>setSuccess('')}> {_success} </Alert> }
                </section>   
            </div>
        </div>
    </div>
    )
}


export default AdminParentEdit;