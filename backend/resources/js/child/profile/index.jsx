import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import IconButton from "@material-ui/core/IconButton";
import axios from 'axios';

import Notification from '../../component/notification';

const Profile = () => {

    const [image, setImage] = useState('/assets/img/avatar/avatar-sample03@2x.png'); 
    const history = useHistory();

    const profile = {
        id: 1,
        name: '田中 達也',
        username:'chankan',
        tel:'08012927104',
        email:'chankan07@gmail.com',
        company:'株式会社ZOTMAN',
        image:'/assets/img/avatar/avatar-sample03@2x.png'
    }

    useEffect(
        () => {
            const formdata = new FormData();
            let child_id = 1;

            // axios.get('/api/meetings/listOfNonApprovalOfChild', {child_id: child_id})
            // .then(response => {
            //     if(response.data.status_code==200){
            //         // window.location.href = '/register/c-account/complete';
            //     }
            //     else if(response.data.status_code==400){
            //         // window.location.href = '/register/c-account/error';
            //     }
            //     else if(response.data.status_code==500){
            //         // window.location.href = '/unknown-error';
            //     }
            // })
            // .catch(err=>console.log(err))
        },[]
    );


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
    <div className="l-content">

        <div className="l-content-w560">
            <div className="l-content__ttl">
                <div className="l-content__ttl__left">
                    <h2>プロフィール</h2>
                </div>
                <Notification/>
            </div>

            <div className="l-content-wrap">
                <section className="profile-container">
                    <div className="profile-wrap">
                        <div className="profile-content">

                            <div>
                                <input type="file" id="avatar" name="avatar" className="d-none" accept=".png, .jpg, .jpeg" onChange={(e) => handleImageChange(e)}/>
                                <div className="avatar-wrapper">
                                    <label htmlFor="avatar" className='avatar-label'>
                                        <IconButton color="primary" aria-label="upload picture" component="span" className="bg-color-2 shadow-sm">
                                            <img src="/assets/img/icon/camera.svg" width="16" height="16"/>
                                        </IconButton>
                                    </label>
                                    {  
                                        image && 
                                            <img src={image} alt="" width ="100%" height="100%" style={{borderRadius:'50%'}}/>  
                                    }
                                </div>
                            </div>
                            <p className="profile-name ft-xs-14">{profile.name}</p>
                            <div className="profile-info ft-xs-14">
                                <div className="profile-info__item">
                                    <p className="profile-info__icon">
                                        <img src="/assets/img/icon/mail.svg" alt="メール"/>
                                    </p>
                                    <p className="txt">{profile.username}</p>
                                </div>
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
                                    <p className="profile-info__icon">
                                        <img src="/assets/img/icon/building.svg" alt="会社名"/>
                                    </p>
                                    <p className="txt">{profile.company}</p>
                                </div>
                            </div>
        
                            <div className="p-profile-btn">
                                <a className="btn-default btn-yellow btn-profile btn-r8 btn-h52 h-xs-45-px"
                                    onClick={e => {
                                        e.preventDefault();
                                        history.push({
                                        pathname: `/c-account/profile/edit/${profile.id}`,
                                        state: {}
                                        });
                                    }}
                                >
                                    <span className="ft-xs-14">プロフィールを変更する</span>
                                </a>
                            </div>
        
                            <div className="p-profile-btn">
                                <a className="btn-default btn-yellow btn-password btn-r8 btn-h52 h-xs-45-px"
                                    onClick={e => {
                                        e.preventDefault();
                                        history.push({
                                        pathname: `/c-account/profile/password-edit/${profile.id}`,
                                        state: {}
                                        });
                                    }}
                                >
                                    <span className="ft-xs-14">パスワードを変更する</span>
                                </a>
                            </div>
        
                            <div className="p-profile-txtLink">
                                <a href="/login/c-account">
                                    <span className="ft-xs-14">ログアウト</span>
                                </a>
                            </div>
            
                            <div className="p-profile-txtLink">
                                <a onClick={e => {
                                        e.preventDefault();
                                        history.push({
                                        pathname: `/c-account/profile/withdrawal`,
                                        state: {}
                                        });
                                    }}
                                >
                                    <span className="ft-xs-14">退会する</span>
                                </a>
                            </div>
                        
                        </div>
                    </div>
                </section>   
            </div>
        </div>
    
    </div>    
    )
}


export default Profile;