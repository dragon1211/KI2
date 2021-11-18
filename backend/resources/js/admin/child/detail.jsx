import React, { useEffect, useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import axios from 'axios';

import { CircularProgress  } from '@material-ui/core';
import IconButton from "@material-ui/core/IconButton";
import PhotoCameraOutlinedIcon from '@mui/icons-material/PhotoCameraOutlined';

import Alert from '../../component/alert';
import ModalConfirm from '../../component/modal_confirm';
 


const ChildDetail = (props) => {

    const history = useHistory();

    const [image, setImage] = useState(''); 
    const [loaded, setLoaded] = useState(false);
    const [submit, setSubmit] = useState(false);
    const [child, setChild] = useState(null);
    
    const [_400error, set400Error] = useState('');
    const [_422errors, set422Errors] = useState({ image: '' });
    const [_success, setSuccess] = useState(props.history.location.state);
    const [show_confirm_modal, setShowConfirmModal] = useState(false);
    
    useEffect(() => {
        setLoaded(false);
        axios.get(`/api/admin/children/detail/${props.match.params?.child_id}`)
        .then(response => {
            setLoaded(true);
            switch(response.data.status_code){
                case 200:{
                    setChild(response.data.params);
                    setImage(response.data.params.image);
                    break;
                }
                case 400: set400Error('失敗しました。'); break;
            }
        })
    },[]);


    const handleImageChange = (e) => {
        e.preventDefault();
        let reader = new FileReader();
        let _file = e.target.files[0];
        reader.readAsDataURL(_file);
        reader.onloadend = () => {
            axios.put(`/api/admin/children/updateImage/${props.match.params?.child_id}`, {image: reader.result})
            .then(response => {
                switch(response.data.status_code){
                    case 200: {
                        setImage(reader.result);
                        setSuccess(response.data.success_messages);
                        break;
                    }
                    case 400: set400Error(response.data.error_messages); break;
                    case 422: set422Errors(response.data.error_messages); break;
                } 
            });
        };
    };


    async function handleAcceptDelete() {
        setSubmit(true);
        axios.delete(`/api/admin/children/delete/${props.match.params?.child_id}`)
        .then(response => {
            setShowConfirmModal(false);
            setSubmit(false);
            switch(response.data.status_code){
                case 200:{
                    history.push({pathname: "/admin/child", state: "削除に成功しました！"});
                    break;
                }
                case 400:  set400Error("削除に失敗しました。"); break;
            }
        });
    };

    
	return (
    <div className="l-content">

        <div className="l-content-w560">
            <div className="l-content__ttl">
                <div className="l-content__ttl__left">
                    <h2>子詳細</h2>
                </div>
            </div>

            <div className="l-content-wrap">
                <section className="profile-container">
                    <div className="profile-wrap" style={{ minHeight:'500px'}}>
                    {
                        !loaded &&
                            <CircularProgress className="css-loader"/>
                    }
                    { 
                        loaded && child &&
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
                            <p className="profile-name">{`${child.first_name}  ${child.last_name}`}</p>
                            <div className="profile-info">
                                <div className="profile-info__item">
                                    <p className="profile-info__icon">
                                        <img src="/assets/img/icon/person-pin.svg" alt="Person"/>
                                    </p>
                                    <p className="txt">{child.identity}</p>
                                </div>
                                <div className="profile-info__item">
                                    <a href={`mailto:${child.email}`}>
                                        <p className="profile-info__icon">
                                            <img src="/assets/img/icon/mail.svg" alt="メール"/>
                                        </p>
                                        <p className="txt">{child.email}</p>
                                    </a>
                                </div>
                                <div className="profile-info__item">
                                    <a href={`tel:${child.tel}`}>
                                        <p className="profile-info__icon">
                                            <img src="/assets/img/icon/phone.svg" alt="電話" />
                                        </p>
                                        <p className="txt">{child.tel}</p>
                                    </a>
                                </div>
                                <div className="profile-info__item">
                                    <p className="profile-info__icon">
                                        <img src="/assets/img/icon/building.svg" alt="会社名"/>
                                    </p>
                                    <p className="txt">{child.company}</p>
                                </div>
                            </div>
        
                            <div className="p-profile-btn">
                                <Link className="btn-default btn-yellow btn-profile btn-r8 btn-h52"
                                    to = {`/admin/child/edit/${props.match.params?.child_id}`}
                                >
                                    <span className="ft-18 ft-xs-16">プロフィールを変更する</span>
                                </Link>
                            </div>
        
                            <div className="p-profile-btn">
                                <Link className="btn-default btn-yellow btn-password btn-r8 btn-h52"
                                    to = {`/admin/child/edit/password/${props.match.params?.child_id}`}
                                >
                                    <span className="ft-18 ft-xs-16">パスワードを変更する</span>
                                </Link>
                            </div>
        
                            <div className="p-profile-txtLink">
                                <a className="btn-default btn-password btn-r8 btn-h52"
                                    onClick={()=>setShowConfirmModal(true)}
                                >
                                    <span className="ft-xs-16">削除する</span>
                                </a>
                            </div>
                        </div>     
                    }
                    </div>
                </section>   
            </div>
        </div>
        <ModalConfirm 
          show={show_confirm_modal} 
          message={"本当に削除しても\nよろしいでしょうか？"}
          handleClose={()=>setShowConfirmModal(false)} 
          handleAccept={handleAcceptDelete} 
          loading={submit}
        />
        {  _400error && <Alert type="fail" hide={()=>set400Error('')}>{_400error}</Alert> } 
        {  _success &&  <Alert type="success" hide={()=>setSuccess('')}>{_success}</Alert> }
    </div>    
    )
}


export default ChildDetail;