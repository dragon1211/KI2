import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { LoadingButton } from '@material-ui/lab';
import IconButton from "@material-ui/core/IconButton";
import PhotoCameraOutlinedIcon from '@mui/icons-material/PhotoCameraOutlined';
import axios from 'axios';

import Alert from '../../../component/alert';


const ParentSignUp = (props) => {

    const history = useHistory();
    const [submit, setSubmit] = useState(false);

    const [image, setImage] = useState(null); 
    const [company, setCompany] = useState('');
    const [password, setPassword] = useState('');
    const [tel, setTel] = useState('');
    const [profile, setProfile] = useState('');

    const [_422errors, set422Errors] = useState({
        image:'',
        company:'',
        password:'',
        tel:'',
        profile:'',
    });
    const [_400error, set400Error] = useState('');

    const handleSubmit = (e) => {

        e.preventDefault();
        set422Errors({
            image:'',
            company:'',
            password:'',
            tel:'',
            profile:'',
        });
        setSubmit(true);
        const formdata = new FormData();
        formdata.append('image', image);
        formdata.append('company', company);
        formdata.append('password', password);
        formdata.append('tel', tel);
        formdata.append('profile', profile);
        formdata.append('token', props.match.params.token);
        axios.post('/api/fathers/registerMain', formdata)
        .then(response => {
            setSubmit(false);
            switch(response.data.status_code){
                case 200: history.push({pathname: '/p-account/register/complete/'+props.match.params.token,  state: response.data.success_messages}); break;
                case 422: set422Errors(response.data.error_messages); break;
                case 400: set400Error(response.data.error_messages); break;
                case 401: history.push({pathname: '/p-account/register/error/'+props.match.params.token,  state: response.data.error_messages}); break;
            };
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

	return (
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
                <input type="password" name="password" id="password"  className = {`input-default input-nameSei input-h60 input-w480 ${ _422errors.password && "is-invalid c-input__target" }`}  value={password} onChange={e=>setPassword(e.target.value)}/>
                {
                    _422errors.password &&
                        <span className="l-alert__text--error ft-16 ft-md-14">
                            { _422errors.password }
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
            
            <LoadingButton type="submit" fullWidth 
                className="btn-edit btn-default btn-h75 bg-yellow rounded-20"
                loading={submit}>
                <span className={`ft-16 font-weight-bold ${!submit && 'text-black'}`}>本登録</span>
            </LoadingButton>
            { _400error && <Alert type="fail" hide={()=>set400Error('')}>{_400error}</Alert> } 
        </form>
	)
}



export default ParentSignUp;