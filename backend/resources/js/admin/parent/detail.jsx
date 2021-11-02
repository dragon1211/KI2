import React, { useEffect, useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import axios from 'axios';

import { LoadingButton } from '@material-ui/lab';
import { CircularProgress  } from '@material-ui/core';
import IconButton from "@material-ui/core/IconButton";
import PhotoCameraOutlinedIcon from '@mui/icons-material/PhotoCameraOutlined';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';

import Alert from '../../component/alert';


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });
  


const ParentDetail = (props) => {

    const history = useHistory();

    const [image, setImage] = useState(''); 
    const [open, setOpen] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [submit, setSubmit] = useState(false);
    const [parent, setParent] = useState(null);

    const [_400error, set400Error] = useState('');
    const [_422errors, set422Errors] = useState({image: ''});
    const [_success_delete, setSuccessDelete] = useState('');
    const [_success_update_image, setSuccessUpdateImage] = useState('');

    useEffect(
        () => {
            
            setLoaded(false);
            axios.get(`/api/admin/fathers/detail/${props.match.params?.father_id}`)
            .then(response => {
                setLoaded(true);
                if(response.data.status_code==200){
                    setParent(response.data.params);
                    setImage(response.data.params.image);
                }
            })
            .catch(err=>console.log(err))
        },[]
    );


    const handleImageChange = (e) => {

        e.preventDefault();
        let reader = new FileReader();
        let _file = e.target.files[0];

        reader.readAsDataURL(_file);

        reader.onloadend = () => {
            
            axios.put(`/api/admin/fathers/updateImage/${props.match.params?.father_id}`, {image: reader.result})
            .then(response => {
                switch(response.data.status_code){
                    case 200: {
                        setImage(reader.result);
                        setSuccessUpdateImage(response.data.success_messages);
                        break;
                    }
                    case 400: set400Error(response.data.error_messages); break;
                    case 422: set422Errors(response.data.error_messages); break;
                } 
            });

        };
    };


    async function openModal() {
        setOpen(true);
    };
    
    async function closeModal() {
        setOpen(false);
    };
    
    async function handleDelete() {
        try {
            setSubmit(true);
            axios.delete(`/api/admin/fathers/delete/${props.match.params?.father_id}`)
            .then(response => {
                closeModal();
                setSubmit(false);
                if(response.data.status_code == 200){
                    setSuccessDelete('削除に成功しました！');
                } else {
                    set400Error("削除に失敗しました。");
                }
            });
        } catch (error) {
            console.log('error', error);
        }
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
                    <div className="profile-wrap position-relative" style={{ minHeight:'500px'}}>
                    {
                        !loaded &&
                            <CircularProgress color="secondary" style={{top:'30%', left:'calc(50% - 22px)', color:'green', position:'absolute'}}/>
                    }
                    { 
                        loaded &&
                        (
                            parent ?
                            <div className="profile-content">
                                <div>
                                    <input type="file" id="avatar" name="avatar" className="d-none" accept=".png, .jpg, .jpeg" onChange={(e) => handleImageChange(e)}/>
                                    <div className="avatar-wrapper">
                                        <label htmlFor="avatar" className='avatar-label'>
                                            <IconButton color="primary" aria-label="upload picture" component="span" className="bg-yellow shadow-sm w-50-px h-50-px">
                                                <PhotoCameraOutlinedIcon style={{width:'25px', height:'25px', color:'black'}}/>
                                                {/* <img src="/assets/img/icon/camera.svg" width="20" height="20"/> */}
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
                                <p className="profile-name ft-xs-14">{parent.company}</p>
                                <div className="profile-info ft-18 ft-xs-14">
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
                                        <p className="txt">{parent.profile}</p>
                                    </div>
                                </div>
            
                                <div className="p-profile-btn">
                                    <Link className="btn-default btn-yellow btn-profile btn-r8 btn-h52 h-xs-45-px"
                                        to = {`/admin/parent/edit/${props.match.params?.father_id}`}
                                    >
                                        <span className="ft-18 ft-xs-14">プロフィールを変更する</span>
                                    </Link>
                                </div>
            
                                <div className="p-profile-btn">
                                    <Link className="btn-default btn-yellow btn-password btn-r8 btn-h52 h-xs-45-px"
                                        to = {`/admin/parent/edit/password/${props.match.params?.father_id}`}
                                    >
                                        <span className="ft-18 ft-xs-14">パスワードを変更する</span>
                                    </Link>
                                </div>
            
                                <div className="p-profile-txtLink">
                                    <a className="btn-default btn-password btn-r8 btn-h52 h-xs-45-px"
                                        onClick={openModal}
                                    >
                                        <span className="ft-xs-14">削除する</span>
                                    </a>
                                </div>
                            </div>
                            : <p className="text-center py-5">データが存在していません。</p>

                        )
                    }
                    </div>
                </section>   
            </div>
        </div>
        <Dialog
            open={open}
            TransitionComponent={Transition}
            keepMounted
            aria-describedby="alert-dialog-slide-description"
        >
            <DialogContent style={{width:'290px', padding:'25px 25px 10px'}}>
                <DialogContentText id="alert-dialog-slide-description" style={{fontSize:'20px', textAlign:'center'}}>
                    本当に削除してもよろしいでしょうか？
                </DialogContentText>
            </DialogContent>
            <DialogActions style={{justifyContent:'space-evenly', padding:'0 20px 20px 20px'}}>
                <Button onClick={closeModal} size="small">
                    <span className="ft-20 text-black">いいえ</span>
                </Button>
                <LoadingButton variant="text"
                    onClick={handleDelete}
                    loading={submit}
                    size="small">
                    <span className={`ft-20 ${!submit && 'text-black'}`}>はい</span>
                </LoadingButton>
            </DialogActions>
        </Dialog>
        {
            _400error && <Alert type="fail" hide={()=>set400Error('')}>{_400error}</Alert>
        } 
        {
            _success_delete && 
            <Alert type="success" 
                hide={()=>  
                    history.push({
                    pathname: "/admin/parent",
                    state: {}
                })}>{_success_delete}</Alert>
        }
        {   _success_update_image && 
            <Alert type="success" hide={()=>setSuccessUpdateImage('')}>
                {_success_update_image}
            </Alert> 
        }
    </div>    
    )
}


export default ParentDetail;