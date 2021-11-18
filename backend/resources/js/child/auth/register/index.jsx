import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { LoadingButton } from '@material-ui/lab';
import axios from 'axios';

import IconButton from "@material-ui/core/IconButton";
import PhotoCameraOutlinedIcon from '@mui/icons-material/PhotoCameraOutlined';

const ChildSignUp = (props) => {

    const history = useHistory();
    const [submit, setSubmit] = useState(false);

    const [first_name, setFirstName] = useState('');
    const [last_name, setLastName] = useState('');  
    const [identity, setIdentity] = useState('');  
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [company, setCompany] = useState('');
    const [image, setImage] = useState(null); 

    const [_422errors, set422Errors] = useState({
        first_name:'',
        last_name:'',
        identity:'',
        email:'',
        password:'',
        image:'',
        company:''
    });

    const handleSubmit = (e) => {

        e.preventDefault();
        set422Errors({
            first_name:'',
            last_name:'',
            identity:'',
            email:'',
            password:'',
            image:'',
            company:''
        });
        setSubmit(true);
        const formdata = new FormData();
        formdata.append('first_name', first_name);
        formdata.append('last_name', last_name);
        formdata.append('identity', identity);
        formdata.append('email', email);
        formdata.append('password', password);
        formdata.append('company', company);
        formdata.append('image', image);
        formdata.append('token', props.match.params.token);
        axios.post('/api/children/registerMain', formdata)
        .then(response => {
            setSubmit(false);
            switch(response.data.status_code){
                case 200: history.push({pathname: '/c-account/register/complete/'+props.match.params.token,  state: response.data.success_messages}); break;
                case 422: set422Errors(response.data.error_messages); break;
                case 400: history.push({pathname: '/c-account/register/error/'+props.match.params.token,  state: response.data.error_messages}); break;
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
                <label htmlFor="first_name"  className="control-label"> 姓 </label>
                <input type="text" name="first_name" id="first_name"  className={`input-default input-nameSei input-h60 input-w480 ${ _422errors.first_name && "is-invalid c-input__target" }`}  value={first_name} onChange={e=>setFirstName(e.target.value)}/>
                {
                    _422errors.first_name &&
                        <span className="l-alert__text--error ft-16 ft-md-14">
                            { _422errors.first_name }
                        </span>
                }
            </div>

            <div className="edit-set">
                <label htmlFor="last_name" className="control-label"> 名 </label>
                <input type="text" name="last_name" id="last_name"  className={`input-default input-nameSei input-h60 input-w480 ${ _422errors.last_name && "is-invalid c-input__target" }`} value={last_name} onChange={e=>setLastName(e.target.value)}/>
                {
                    _422errors.last_name &&
                        <span className="l-alert__text--error ft-16 ft-md-14">
                            { _422errors.last_name }
                        </span>
                }
            </div>

            <div className="edit-set">
                <label htmlFor="identity" className="control-label"> ID </label>
                <input type="text" name="identity" id="identity"  className={`input-default input-nameSei input-h60 input-w480 ${ _422errors.identity && "is-invalid c-input__target" }`} value={identity} onChange={e=>setIdentity(e.target.value)}/>
                {
                    _422errors.identity &&
                        <span className="l-alert__text--error ft-16 ft-md-14">
                            { _422errors.identity }
                        </span>
                }
            </div>

            <div className="edit-set">
                <label htmlFor="email"   className="control-label"> メールアドレス </label>
                <input type="email" name="email" id="email"  className = {`input-default input-nameSei input-h60 input-w480 ${ _422errors.email && "is-invalid c-input__target" }`}  value={email} onChange={e=>setEmail(e.target.value)}/>
                {
                    _422errors.email && 
                        <span className="l-alert__text--error ft-16 ft-md-14">
                            { _422errors.email }
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
                <label htmlFor="company"   className="control-label"> 所屈している会社名を記載 </label>
                <input type="text" name="company" id="company"  className = {`input-default input-nameSei input-h60 input-w480 ${ _422errors.company && "is-invalid c-input__target" }`}  value={company} onChange={e=>setCompany(e.target.value)}/>
                {
                    _422errors.company &&
                        <span className="l-alert__text--error ft-16 ft-md-14">
                            { _422errors.company }
                        </span>
                }
            </div>
            
            <LoadingButton type="submit" fullWidth 
                className="btn-edit btn-default btn-h75 bg-yellow rounded-20"
                loading={submit}>
                <span className={`ft-16 font-weight-bold ${!submit && 'text-black'}`}>本登録</span>
            </LoadingButton>
        </form>
	)
}



export default ChildSignUp;