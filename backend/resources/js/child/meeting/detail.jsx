import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useHistory, useLocation, Link } from 'react-router-dom';
import { CircularProgress  } from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';

import Notification from '../../component/notification';
import moment from 'moment';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';

import Alert from '../../component/alert';
import ModalPdf from '../../component/admin/pdf_modal_admin';
import ModalMemo from '../../component/admin/modal_memo';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });
  

const MeetingDetail = (props) => {

    const history = useHistory();
    const [loaded, setLoaded] = useState(false);
    const [meeting, setMeeting] = useState(null);
    const [thumbnail, setThumbnail] = useState('');
    const [_approval_register, setApprovalRegister] = useState(false);

    const [showPdf, setShowPdf] = useState(false);
    const [showMemo, setShowMemo] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [submit, setSubmit] = useState(false);
    const [_400error, set400Error] = useState('');
    const [_success, setSuccess] = useState('');
   
    useEffect(() => {
        setLoaded(false);
        let child_id = document.getElementById('child_id').value;
        axios.get(`/api/children/meetings/detail/${props.match.params?.meeting_id}`, {params:{child_id: child_id}})
        .then(response => {
            setLoaded(true);
            if(response.data.status_code == 200)
            {
                var meeting = response.data.params;
                console.log(meeting);
                setMeeting(meeting);
                if(meeting.meeting_image.length > 0) setThumbnail(meeting.meeting_image[0].image);
                if(meeting.approval.approval_at != null){
                    setApprovalRegister(true); 
                }
            }
        })
    },[]);


    const handleApprovalRegister = () => {
        setSubmit(true);
        const formdata = new FormData();
        formdata.append('child_id', document.getElementById('child_id').value);
        formdata.append('meeting_id', props.match.params.meeting_id);
        axios.post('/api/children/meeting/approvals/registerApproval', formdata)
        .then(response => {
            setSubmit(false);
            setShowConfirm(false);
            switch(response.data.status_code){
                case 200: {
                    setSuccess(response.data.success_messages);
                    setApprovalRegister(true);
                    break;
                }
                case 400: set400Error(response.data.error_messages); break;
            }
        })
    }

    
	return (
    <div className="l-content">

        <div className="l-content-w560">
            <div className="l-content__ttl">
                <div className="l-content__ttl__left">
                    <h2>ミーティング詳細</h2>
                    {
                        loaded && _approval_register == false &&
                            <div className="p-consent-btn">
                                <button className="btn-default btn-yellow btn-consent btn-shadow btn-r8 btn-h42"
                                    onClick={e=>setShowConfirm(true)}>
                                    <span>承認</span>
                                </button>
                            </div>
                    }
                </div>
                <Notification/>
            </div>
            {
                !loaded &&
                    <CircularProgress color="secondary" className="css-loader"/>
            }
            {
                loaded && 
                (meeting ?
                    <div className="l-content-wrap">
                        <div className="p-article p-article-single">
                            <div className="p-article-wrap">
                                <article className="p-article__body">
                                    <div className="p-article__content">
                                        <p className="meeting-label">{`${_approval_register ? '承知済み':'未承知'}`}</p>
                                        <h3 className="meeting-ttl">{meeting.title}</h3>
                                        <time dateTime="2021-07-30" className="meeting-time">
                                            <span className="meeting-date">{moment(meeting.updated_at).format('YYYY/MM/DD')}</span>
                                        </time>
                                        <div className="user-wrap user-sm">
                                            <Link to = {`/c-account/parent/detail/${meeting?.father_id}`}>
                                                <div className="user-avatar">
                                                    <img alt="name" className="avatar-img" 
                                                        src={meeting.father.image}
                                                    />
                                                </div>
                                                <p className="user-name text-grey">
                                                    {meeting.father.company}
                                                </p>
                                            </Link>
                                            <div className="user-advice-btn">
                                                <a href={`tel:${meeting.father.tel}`} className="btn-default btn-yellow  btn-r8 btn-h50">
                                                    <span>親に電話で相談</span>
                                                </a>
                                            </div>
                                        </div>
                                
                                        <div className="p-article__context">
                                            <div className="p-file-list">
                                                <div className="p-file-for">
                                                    <figure>
                                                        {
                                                            thumbnail && 
                                                            <img src={thumbnail} alt="thumbnail"/>
                                                        }
                                                    </figure>
                                                </div>
                                                <div className="p-file-nav">
                                                    {
                                                        meeting.meeting_image.map((item, k)=>
                                                            <figure key={k}><img src={item.image} alt="dumy-image"  onClick={e=>setThumbnail(item.image)}/></figure>
                                                        )
                                                    }
                                                    {
                                                        [...Array(10-meeting.meeting_image.length)].map((x, k)=>
                                                            <figure key={k}></figure>
                                                        )
                                                    }
                                                </div>
                                            </div>

                                            <div className="p-article__pdf">
                                                <div className="p-article__pdf__btn mr-3">
                                                    {
                                                        _approval_register == false ?
                                                        <a className="btn-default btn-pdf btn-r8 btn-h50 btn-disabled"> 
                                                            <span>PDFを確認する</span>
                                                        </a>
                                                        :<a className="btn-default btn-pdf btn-r8 btn-h50 btn-yellow" 
                                                            onClick={()=>setShowPdf(true)}>
                                                            <span>PDFを確認する</span>
                                                        </a>
                                                    }
                                                </div>
                                                <div className="p-article__pdf__btn mr-0">
                                                    {
                                                        _approval_register == true ?
                                                        <a className="btn-default btn-pdf btn-r8 btn-h50 btn-disabled"> 
                                                            <span>メモを確認する</span>
                                                        </a>
                                                        :<a className="btn-default btn-pdf btn-r8 btn-h50 btn-yellow" 
                                                            onClick={()=>setShowMemo(true)}>
                                                            <span>メモを確認する</span>
                                                        </a>
                                                    }
                                                </div>
                                            </div>
                                    
                                            <p className="p-article__txt">{meeting.text}</p>
                                        </div>
                                    </div>
                                </article>
                                <ModalMemo 
                                    show={showMemo}
                                    title={"メモ"}
                                    content={meeting?.memo}
                                    handleClose={()=>setShowMemo(false)} />
                                <ModalPdf 
                                    show={showPdf}
                                    pdfPath={meeting.pdf ?? '/pdf/test.pdf'}
                                    handleClose={()=>setShowPdf(false)} />
                            </div>
                        </div>
                    </div>
                    : <p className="text-center mt-5 ft-18">データが存在しません。</p>
                )
            }
            <Dialog
                open={showConfirm}
                TransitionComponent={Transition}
                keepMounted
                aria-describedby="alert-dialog-slide-description"
                onClose={e=>setShowConfirm(false)}
            >
                <DialogContent style={{width:'290px', padding:'25px 10px 10px'}}>
                    <DialogContentText id="alert-dialog-slide-description" className="text-center">
                        <span className="ft-16 text-black">一度承知したら元に戻せません。<br/>よろしいでしょうか。</span>
                    </DialogContentText>
                </DialogContent>
                <DialogActions style={{justifyContent:'space-evenly', padding:'0 20px 20px 20px'}}>
                    <Button onClick={e=>setShowConfirm(false)} size="small">
                        <span className="ft-16 font-weight-bold text-black">いいえ</span>
                    </Button>
                    <LoadingButton variant="text"
                        onClick={handleApprovalRegister}
                        loading={submit}
                        size="small">
                        <span className={`ft-16 font-weight-bold ${!submit && 'text-black'}`}>はい</span>
                    </LoadingButton>
                </DialogActions>
            </Dialog>
            {
                _400error && <Alert type="fail" hide={()=>set400Error('')}>{_400error}</Alert>
            } 
            {
                _success &&  <Alert type="success" hide={()=>setSuccess('')}>{_success}</Alert>
            }
        </div>
    </div>
    )
}



export default MeetingDetail;