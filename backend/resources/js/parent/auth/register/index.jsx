import React, { useEffect, useState } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { LoadingButton } from '@material-ui/lab';
import IconButton from "@material-ui/core/IconButton";
import PhotoCameraOutlinedIcon from '@mui/icons-material/PhotoCameraOutlined';

import Alert from '../../../component/alert';


const ParentSignUp = () => {

    const navigator = useNavigate();
    const params = useParams();

    const [submit, setSubmit] = useState(false);
    const [loaded, setLoaded] = useState(false);

    const [image, setImage] = useState(null);
    const [company, setCompany] = useState('');
    const [password, setPassword] = useState('');
    const [password_confirmation, setPasswordConfirmation] = useState('');
    const [tel, setTel] = useState('');
    const [profile, setProfile] = useState('');
    const [check_terms, setCheckTerms] = useState(false);

    const [_422errors, set422Errors] = useState({
        image:'',
        company:'',
        password:'',
        password_confirmation: '',
        tel:'',
        profile:'',
        terms:''
    });
    const [_400error, set400Error] = useState('');


    useEffect(()=>{
        axios.get('/api/fathers/checkRegisterMain', {params:{token: params?.token}})
        .then(response=>{
            switch(response.data.status_code){
                case 200: setLoaded(true); break;
                case 400: navigator('/p-account/login',  { state: '' }); break;
            };
        })
    },[])


    const handleSubmit = (e) => {
        e.preventDefault();
        set422Errors({
            image:'',
            company:'',
            password:'',
            password_confirmation: '',
            tel:'',
            profile:'',
            terms:''
        });
        setSubmit(true);
        const formdata = new FormData();
        formdata.append('image', image);
        formdata.append('company', company);
        formdata.append('password', password);
        formdata.append('password_confirmation', password_confirmation);
        formdata.append('tel', tel);
        formdata.append('profile', profile);
        formdata.append('terms', check_terms);
        formdata.append('token', params?.token);

        axios.post('/api/fathers/registerMain', formdata)
        .then(response => {
            setSubmit(false);
            switch(response.data.status_code){
                case 200: navigator('/p-account/register/complete/'+ params?.token,  {state: response.data.success_messages}); break;
                case 400: set400Error(response.data.error_messages); break;
                case 401: navigator('/p-account/register/error/'+ params?.token,  {state: response.data.error_messages}); break;
                case 422: {
                    window.scrollTo(0, 0); 
                    set422Errors(response.data.error_messages); 
                    break;
                }
            };
            if(response.data.status_code != 200){
                setPassword('');
                setPasswordConfirmation('');
            }
        })
    }


    const handleImageChange = (e) => {
        e.preventDefault();
        let reader = new FileReader();
        let _file = e.target.files[0];
        reader.readAsDataURL(_file);
        reader.onloadend = () => {
            setImage(reader.result);
        };
    };

    if(!loaded) return null;
	return (
    <div className="l-single-container">
        <div className="l-single-inner">
            <form onSubmit={handleSubmit} className="edit-form">
                <p className="text-center font-weight-bold ft-25">本登録</p>
                <div className="mt-25-px">
                    <input type="file" id="avatar" name="avatar" className="d-none" accept=".png, .jpg, .jpeg" onChange={(e) => handleImageChange(e)}/>
                    <div className={`avatar-wrapper  ${ _422errors.image && "is-invalid c-input__target" }` }>
                        <label htmlFor="avatar" className='avatar-label'>
                            <IconButton color="primary" aria-label="upload picture" component="span" className="bg-yellow shadow-sm w-50-px h-50-px">
                                <PhotoCameraOutlinedIcon style={{width:'25px', height:'25px', color:'black'}}/>
                            </IconButton>
                        </label>
                        {
                            image && <img src={image} className="avatar-img" alt="avatar-img"/>
                        }
                    </div>
                    {
                        _422errors.image  &&
                            <span className="l-alert__text--error ft-16 ft-md-14">
                                { _422errors.image }
                            </span>
                    }
                </div>

                <div className="edit-set">
                    <label htmlFor="company"   className="control-label"> 会社名 </label>
                    <input type="text" name="company" id="company"  className = {`input-default input-nameSei input-h60 input-w480 ${ _422errors.company && "is-invalid c-input__target" }`}  value={company} onChange={e=>setCompany(e.target.value)}/>
                    {
                        _422errors.company &&
                            <span className="l-alert__text--error ft-16 ft-md-14">
                                { _422errors.company }
                            </span>
                    }
                </div>

                <div className="edit-set">
                    <label htmlFor="password" className="control-label"> パスワード </label>
                    <input type="password" name="password" id="password" placeholder='半角英数字8文字以上' className = {`input-default input-nameSei input-h60 input-w480 ${ _422errors.password && "is-invalid c-input__target" }`}  value={password} onChange={e=>setPassword(e.target.value)}/>
                    {
                        _422errors.password &&
                            <span className="l-alert__text--error ft-16 ft-md-14">
                                { _422errors.password }
                            </span>
                    }
                </div>

                <div className="edit-set">
                    <label htmlFor="password_confirmation" className="control-label"> 確認用パスワード </label>
                    <input type="password" name="password_confirmation" id="password_confirmation" className = {`input-default input-nameSei input-h60 input-w480 ${ _422errors.password_confirmation && "is-invalid c-input__target" }`}  value={password_confirmation} onChange={e=>setPasswordConfirmation(e.target.value)}/>
                    {
                        _422errors.password_confirmation &&
                            <span className="l-alert__text--error ft-16 ft-md-14">
                                { _422errors.password_confirmation }
                            </span>
                    }
                </div>

                <div className="edit-set">
                    <label htmlFor="tel"  className="control-label"> 電話番号 </label>
                    <input type="text" name="tel" id="tel"  className={`input-default input-nameSei input-h60 input-w480 ${ _422errors.tel && "is-invalid c-input__target" }`}  value={tel} onChange={e=>setTel(e.target.value)}/>
                    {
                        _422errors.tel &&
                            <span className="l-alert__text--error ft-16 ft-md-14">
                                { _422errors.tel }
                            </span>
                    }
                </div>

                <div className="edit-set">
                    <label className="control-label" htmlFor="profile"> プロフィール </label>
                    <textarea  id="profile"  value={ profile } onChange={e=>setProfile(e.target.value)}  rows="8" className={`textarea-default rounded-20 ${  _422errors.profile && 'is-invalid c-input__target'} `}/>
                    {
                        _422errors.profile &&
                            <span className="l-alert__text--error ft-16 ft-md-14">
                                {_422errors.profile}
                            </span>
                    }
                </div>

                <div className="edit-set text-center mt-5">
                    <label htmlFor="terms">
                        <input  id="terms"  name="terms"  type="checkbox"  
                            className={_422errors.terms && 'is-invalid'}
                            onChange={()=>setCheckTerms(!check_terms)} 
                            checked={check_terms}
                        />
                        <span className='lbl padding-16'>
                            <Link to="/terms" className='term-link' target="_blank" rel="noopener noreferrer">規約</Link>
                            に同意する
                        </span>
                    </label>
                    {
                        _422errors.terms &&
                            <span className="l-alert__text--error ft-16 ft-md-14">
                                { _422errors.terms }
                            </span>
                    }
                </div>

                <LoadingButton type="submit" fullWidth
                    className="btn-edit btn-default btn-h75 bg-yellow rounded-20"
                    loading={submit}>
                    <span className={`ft-16 font-weight-bold ${!submit && 'text-black'}`}>本登録</span>
                </LoadingButton>
                { _400error && <Alert type="fail" hide={()=>set400Error('')}>{_400error}</Alert> }
            </form>
        </div>
    </div>
	)
}



export default ParentSignUp;
