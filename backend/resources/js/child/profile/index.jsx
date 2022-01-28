import React, { useRef, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import IconButton from "@material-ui/core/IconButton";
import PhotoCameraOutlinedIcon from '@mui/icons-material/PhotoCameraOutlined';

import Alert from '../../component/alert';
import PageLoader from '../../component/page_loader';
import Notification from '../../component/notification';


const ChildProfileDetail = () => {

    const navigator = useNavigate();

    const child_id = localStorage.getItem('child_id');
    const [notice, setNotice] = useState(-1);

    const [image, setImage] = useState('');
    const [profile, setProfile] = useState(null)
    const [loaded, setLoaded] = useState(false);
    const [_400error, set400Error] = useState('');
    const [_404error, set404Error] = useState('');
    const [_422errors, set422Errors] = useState({ image: '' });
    const [_success, setSuccess] = useState('');
    const [submit_image, setSubmitImage] = useState(false);

    const isMountedRef = useRef(true);

    useEffect(() => {
        isMountedRef.current = false;
        setLoaded(false);

        axios.get('/api/children/detail/'+ child_id)
        .then(response => {
            if(isMountedRef.current) return;

            setLoaded(true);
            setNotice(response.data.notice);
            if(response.data.status_code==200){
                setProfile(response.data.params);
                setImage(response.data.params.image);
            } else {
                set400Error("失敗しました。");
            }
        })
        .catch(err=>{
            if(isMountedRef.current) return;

            setLoaded(true);
            setNotice(err.response.data.notice);
            if(err.response.status==404){
                set404Error(err.response.data.message);
            }
        })
            
        return () => {
            isMountedRef.current = true;
        }
    },[]);

    useEffect(() => {
        if(localStorage.getItem('image_upload_success')){
            setSuccess(localStorage.getItem('image_upload_success'));
            localStorage.removeItem('image_upload_success');
        }
    })

    const handleLogout = () => {
        axios.get('/c-account/logout')
        .then(() => {
            localStorage.removeItem('c-account_token');
            window.location.href = '/c-account/login';
        })
    }

    const handleImageChange = (e) => {
        e.preventDefault();
        set422Errors({image: ''});
        let reader = new FileReader();
        let _file = e.target.files[0];
        reader.readAsDataURL(_file);
        reader.onloadend = () => {
            set422Errors({image: ''});
            setSubmitImage(true);
            axios.put(`/api/children/updateImage/${child_id}`, {image: reader.result})
            .then(response => {
                if(isMountedRef.current) return;

                setNotice(response.data.notice);
                setSubmitImage(false);
                switch(response.data.status_code){
                    case 200: {
                        localStorage.setItem('image_upload_success', response.data.success_messages);
                        window.location.reload(true);
                        break;
                    }
                    case 400: set400Error(response.data.error_messages); break;
                    case 422: window.scrollTo(0, 0); set422Errors(response.data.error_messages); break;
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
                        (!loaded || submit_image) &&
                            <PageLoader />
                    }
                    {
                        loaded && profile &&
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
                                <p className="profile-name">{`${profile.last_name} ${profile.first_name}`}</p>
                                <div className="profile-info">
                                    <div className="profile-info__item id-btn">
                                        <p className="profile-info__icon">
                                            <img src="/assets/img/icon/ID.svg" alt="ID"/>
                                        </p>
                                        <p className="txt">{profile.identity}</p>
                                        <a target='_blank'
                                            href={'http://line.naver.jp/R/msg/text/?'+
                                            `${profile.last_name}%20${profile.first_name}さんがIDを共有しました。%0AIDはこちら%0A%0A${profile.identity}%0A%0AIDをコピーしてメンバー追加してください。%0A%0AKIKI運営事務局`}>
                                            IDを教える
                                        </a>
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
                                        <p className="txt">{profile.company ? profile.company: '未入力'}</p>
                                    </div>
                                </div>

                                <div className="p-profile-btn">
                                    <Link to={`/c-account/profile/edit/${child_id}`}
                                        className="btn-default btn-yellow btn-profile btn-r8 btn-h52">
                                        <span className="ft-xs-16">プロフィールを変更する</span>
                                    </Link>
                                </div>

                                <div className="p-profile-btn">
                                    <Link to={`/c-account/profile/password-edit/${child_id}`}
                                        className="btn-default btn-yellow btn-password btn-r8 btn-h52">
                                        <span className="ft-xs-16">パスワードを変更する</span>
                                    </Link>
                                </div>

                                <div className="p-profile-txtLink">
                                    <Link to="/terms"
                                        className="btn-default btn-password btn-r8 btn-h30"
                                    >
                                        <span className="ft-xs-16">利用規約</span>
                                    </Link>
                                </div>

                                <div className="p-profile-txtLink">
                                    <Link to="/privacy-policy"
                                        className="btn-default btn-password btn-r8 btn-h30"
                                    >
                                        <span className="ft-xs-16">プライバシーポリシー</span>
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
                                    <Link to="/c-account/profile/withdrawal"
                                        className="btn-default btn-password btn-r8 btn-h30"
                                    >
                                        <span className="ft-xs-16">退会する</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    }
                    { _success && <Alert type="success" hide={()=>setSuccess('')}>{_success}</Alert> }
                    { _400error && <Alert type="fail" hide={()=>set400Error('')}>{_400error}</Alert> }
                    { _404error &&
                        <Alert type="fail" hide={()=>{
                            navigator('/c-account/profile')
                        }}>
                        {_404error}
                        </Alert>
                    }
                </section>
            </div>
        </div>
    </div>
    )
}


export default ChildProfileDetail;
