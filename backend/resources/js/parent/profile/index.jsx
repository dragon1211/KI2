import React, { useEffect, useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import IconButton from "@material-ui/core/IconButton";
import axios from 'axios';
import { CircularProgress  } from '@material-ui/core';
import PhotoCameraOutlinedIcon from '@mui/icons-material/PhotoCameraOutlined';

import Alert from '../../component/alert';
import Notification from '../notification';

const Profile = (props) => {

    const [notice, setNotice] = useState(localStorage.getItem('notice'));

    const [image, setImage] = useState(''); 
    const [profile, setProfile] = useState({email:'', tel:'', first_name:'', last_name:'', identity:'', company:'', image:''})
    const [loaded, setLoaded] = useState(false);
    const [_400error, set400Error] = useState('');
    const [_422errors, set422Errors] = useState({ image: '' });
    const [_success, setSuccess] = useState(props.history.location.state);

    const father_id = document.getElementById('father_id').value;

    useEffect(() => {
      setLoaded(false);
      axios.get('/api/fathers/detail/'+father_id)
      .then(response => {
          setLoaded(true);
          setNotice(response.data.notice);
          if(response.data.status_code==200){
              setProfile(response.data.params);
              setImage(response.data.params.image);
          }
          else {
            set400Error("失敗しました。");
          } 
      })
    },[]);

    useEffect(() => {
        if(localStorage.getItem('image_upload_success')){
            setSuccess(localStorage.getItem('image_upload_success'));
            localStorage.removeItem('image_upload_success');
        }
    })

    const handleLogout = () => {
        axios.get('/p-account/logout')
        .then(() => location.href = '/p-account/login')
    }

    const handleImageChange = (e) => {
        e.preventDefault();
        set422Errors({image: ''});
        let reader = new FileReader();
        let _file = e.target.files[0];
        reader.readAsDataURL(_file);
        reader.onloadend = () => {
            set422Errors({image: ''});
            axios.put(`/api/fathers/updateImage/${father_id}`, {image: reader.result})
            .then(response => {
                setNotice(response.data.notice);
                switch(response.data.status_code){
                    case 200: {
                        localStorage.setItem('image_upload_success', response.data.success_messages);
                        window.location.reload(true);
                        break;
                    }
                    case 400: set400Error(response.data.error_messages); break;
                    case 422: set422Errors(response.data.error_messages); break;
                } 
            });
        };
    };

    
	return (
    <div className="l-content">
        <div className="l-content-w560">
            <div className="l-content__ttl">
                <div className="l-content__ttl__left">
                    <h2>プロフィール</h2>
                </div>
                <Notification notice={notice}/>
            </div>
            <div className="l-content-wrap">
                <section className="profile-container">
                    {
                        !loaded &&
                            <CircularProgress className="css-loader"/>
                    }
                    {
                        loaded &&
                        <div className="profile-wrap">
                            <div className="profile-content">
                                <div>
                                    <input type="file" id="avatar" name="avatar" className="d-none" accept=".png, .jpg, .jpeg" onChange={(e) => handleImageChange(e)}/>
                                    <div className="avatar-wrapper">
                                        <label htmlFor="avatar" className='avatar-label'>
                                            <IconButton color="primary" aria-label="upload picture" component="span" className="bg-yellow shadow-sm w-50-px h-50-px">
                                                <PhotoCameraOutlinedIcon style={{width:'25px', height:'25px', color:'black'}}/>
                                            </IconButton>
                                        </label>
                                        <img src={image} className="avatar-img" alt="avatar-img"/>  
                                    </div>
                                    {
                                        _422errors.image &&
                                            <span className="l-alert__text--error ft-16 ft-md-14">
                                                {_422errors.image}
                                            </span> 
                                    }
                                </div>
                                <p className="profile-name">{ profile.company }</p>
                                <div className="profile-info">
                                    <div className="profile-info__item">
                                        <a href={`mailto:${profile.email}`}>
                                            <p className="profile-info__icon">
                                                <img src="/assets/img/icon/mail.svg" alt="メール"/>
                                            </p>
                                            <p className="txt">{profile.email}</p>
                                        </a>
                                    </div>
                                    <div className="profile-info__item">
                                        <a href={`tel:${profile.tel}`}>
                                            <p className="profile-info__icon">
                                                <img src="/assets/img/icon/phone.svg" alt="電話" />
                                            </p>
                                            <p className="txt">{profile.tel}</p>
                                        </a>
                                    </div>
                                    <div className="profile-info__item">
                                        <p className="txt">{profile.profile ? profile.profile: '未入力'}</p>
                                    </div>
                                </div>
            
                                <div className="p-profile-btn">
                                    <Link to={`/p-account/profile/edit/${father_id}`} 
                                        className="btn-default btn-yellow btn-profile btn-r8 btn-h52">
                                        <span className="ft-xs-16">プロフィールを変更する</span>
                                    </Link>
                                </div>
            
                                <div className="p-profile-btn">
                                    <Link to={`/p-account/profile/edit/password/${father_id}`}
                                        className="btn-default btn-yellow btn-password btn-r8 btn-h52">
                                        <span className="ft-xs-16">パスワードを変更する</span>
                                    </Link>
                                </div>
            
                                <div className="p-profile-txtLink">
                                    <a className="btn-default btn-password btn-r8 btn-h30"
                                        onClick={handleLogout}
                                    >
                                        <span className="ft-xs-16">ログアウト</span>
                                    </a>
                                </div>
                                <div className="p-profile-txtLink">
                                    <Link to="/p-account/profile/withdrawal"
                                        className="btn-default btn-password btn-r8 btn-h30"
                                    >
                                        <span className="ft-xs-16">退会する</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    }
                    { _400error && <Alert type="fail" hide={()=>set400Error('')}>{_400error}</Alert> } 
                    { _success && <Alert type="success" hide={()=>setSuccess('') }>{_success}</Alert> }
                </section>   
            </div>
        </div>
    </div>    
    )
}


export default Profile;