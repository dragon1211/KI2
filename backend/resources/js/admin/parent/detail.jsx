import React, { useEffect, useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import axios from 'axios';

import { LoadingButton } from '@material-ui/lab';
import { CircularProgress  } from '@material-ui/core';
import IconButton from "@material-ui/core/IconButton";
import PhotoCameraOutlinedIcon from '@mui/icons-material/PhotoCameraOutlined';

import Alert from '../../component/alert';
import ModalConfirm from '../../component/modal_confirm';


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });
  


const ParentDetail = (props) => {

    const history = useHistory();

    const [image, setImage] = useState(''); 
    const [loaded, setLoaded] = useState(false);
    const [submit, setSubmit] = useState(false);
    const [submit_image, setSubmitImage] = useState(false);
    const [parent, setParent] = useState(null);
    
    const [_400error, set400Error] = useState('');
    const [_422errors, set422Errors] = useState({image: ''});
    const [_success, setSuccess] = useState(props.history.location.state);
    const [show_confirm_modal, setShowConfirmModal] = useState(false);

    useEffect(() => {
        setLoaded(false);
        axios.get(`/api/admin/fathers/detail/${props.match.params?.father_id}`)
        .then(response => {
            setLoaded(true);
            if(response.data.status_code==200){
                setParent(response.data.params);
                setImage(response.data.params.image);
            }
            else{
                set400Error("失敗しました。");
            }
        })
    },[]);


    const handleImageChange = (e) => {
        e.preventDefault();
        let reader = new FileReader();
        let _file = e.target.files[0];
        reader.readAsDataURL(_file);
        reader.onloadend = () => {
            set422Errors({image: ''});
            setSubmitImage(true);
            axios.put(`/api/admin/fathers/updateImage/${props.match.params?.father_id}`, {image: reader.result})
            .then(response => {
                setSubmitImage(false);
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
        axios.delete(`/api/admin/fathers/delete/${props.match.params?.father_id}`)
        .then(response => {
            setShowConfirmModal(false);
            setSubmit(false);
            if(response.data.status_code == 200){
                history.push({
                pathname: "/admin/parent",
                state: '削除に成功しました！'});
            } else {
                set400Error("削除に失敗しました。");
            }
        });
    };

    
	return (
    <div className="l-content">

        <div className="l-content-w560">
            <div className="l-content__ttl">
                <div className="l-content__ttl__left">
                    <h2>親詳細</h2>
                </div>
            </div>

            <div className="l-content-wrap">
                <section className="profile-container">
                    <div className="profile-wrap" style={{ minHeight:'500px'}}>
                    {
                        (!loaded || submit_image) &&
                            <CircularProgress className="css-loader"/>
                    }
                    { 
                        loaded && parent &&
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
                            <p className="profile-name">{parent.company}</p>
                            <div className="profile-info">
                                <div className="profile-info__item">
                                    <p className="profile-info__icon">
                                        <img src="/assets/img/icon/people-gray.svg" alt="People"/>
                                    </p>
                                    <p className="txt">{`${parent.limit}人`}</p>
                                </div>
                                <div className="profile-info__item">
                                    <a href={`mailto:${parent.email}`}>
                                        <p className="profile-info__icon">
                                            <img src="/assets/img/icon/mail.svg" alt="メール"/>
                                        </p>
                                        <p className="txt">{parent.email}</p>
                                    </a>
                                </div>
                                <div className="profile-info__item">
                                    <a href={`tel:${parent.tel}`}>
                                        <p className="profile-info__icon">
                                            <img src="/assets/img/icon/phone.svg" alt="電話" />
                                        </p>
                                        <p className="txt">{parent.tel}</p>
                                    </a>
                                </div>
                                <div className="profile-info__item">
                                    <p className="txt">{parent.profile ? parent.profile: '未入力'}</p>
                                </div>
                            </div>
        
                            <div className="p-profile-btn">
                                <Link className="btn-default btn-yellow btn-profile btn-r8 btn-h52"
                                    to = {`/admin/parent/edit/${props.match.params?.father_id}`}
                                >
                                    <span className="ft-18 ft-xs-16">プロフィールを変更する</span>
                                </Link>
                            </div>
        
                            <div className="p-profile-btn">
                                <Link className="btn-default btn-yellow btn-password btn-r8 btn-h52"
                                    to = {`/admin/parent/edit/password/${props.match.params?.father_id}`}
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
        { _400error && <Alert type="fail" hide={()=>set400Error('')}> {_400error} </Alert> } 
        { _success && <Alert type="success" hide={()=>setSuccess('')}> {_success} </Alert> }
    </div>    
    )
}


export default ParentDetail;