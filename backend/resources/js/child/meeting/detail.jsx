import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useHistory, useLocation, Link } from 'react-router-dom';
import { CircularProgress  } from '@material-ui/core';

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
import ModalYesNo from '../../component/modal_yesno';

const MeetingDetail = (props) => {

    const history = useHistory();
    const location = useLocation();
    const [loaded, setLoaded] = useState(false);
    const [meeting, setMeeting] = useState(null);

    const [showPdf, setShowPdf] = useState(false);
    const [showMemo, setShowMemo] = useState(false);
    const [modalStatus, setModalStatus] = useState(false);
   
    useEffect(() => {
        setLoaded(false);
        let child_id = document.getElementById('child_id').value;
        axios.get(`/api/children/meetings/detail/${props.match.params?.meeting_id}`, {params:{child_id: child_id}})
        .then(response => {
            setLoaded(true);
            console.log(response.data);
            if(response.data.status_code == 200)
            {
                setMeeting(response.data.params[0]);
            }
        })
        .catch(err=>console.log(err))
    },[]);

    const showAlert = () => {
        
        setAlertStatus(true);
        let timer = setTimeout(()=>{
            clearTimeout(timer);
            setAlertStatus(false);
        }, 4000)
    }

    const showModal = () => {
        setModalStatus(true);
    }

    const hideModal = () => {
        setModalStatus(false);
    }
    
	return (
    <div className="l-content">

        <div className="l-content-w560">
            <div className="l-content__ttl">
                <div className="l-content__ttl__left">
                    <h2>ミーティング詳細</h2>
                    <div className="p-consent-btn">
                        <button className="btn-default btn-yellow btn-consent btn-shadow btn-r8 btn-h42" onClick={showModal}>
                            <span>承認</span>
                        </button>
                    </div>
                </div>
                <Notification/>
            </div>
            {
                !loaded &&
                    <CircularProgress color="secondary" style={{top:'calc(40% - 22px)', left:'calc(50% - 22px)', color:'green', position:'absolute'}}/>
            }
            {
                loaded && 
                (meeting ?
                    <div className="l-content-wrap">
                        <div className="p-article p-article-single">
                            <div className="p-article-wrap">
                                <article className="p-article__body">
                                    <div className="p-article__content">
                                        <p className="meeting-label">未承知</p>
                                        <h3 className="meeting-ttl">{meeting.title}</h3>
                                        <time dateTime="2021-07-30" className="meeting-time">
                                            <span className="meeting-date">{moment(meeting.updated_at).format('YYYY/MM/DD')}</span>
                                        </time>
                                        <div className="user-wrap user-sm">
                                            <Link to = {`/c-account/parent/detail/${meeting?.father_id}`}>
                                                <div className="user-avatar">
                                                    <img alt="name" className="avatar-img" 
                                                        // src={meeting.fathers && (meeting.fathers.length > 0 && meeting.fathers[0].image)}
                                                    />
                                                </div>
                                                <p className="user-name text-grey">
                                                    {/* {`${meeting.fathers && (meeting.fathers.length>0 && meeting.fathers[0])?.last_name} ${meeting.fathers && (meeting.fathers.length > 0 && meeting.fathers[0]?.first_name)}`} */}
                                                </p>
                                            </Link>
                                            <div className="user-advice-btn">
                                                <a href={`tel:12918277`} className="btn-default btn-yellow  btn-r8 btn-h50">
                                                    <span>親に電話で相談</span>
                                                </a>
                                            </div>
                                        </div>
                                
                                        <div className="p-article__context">
                                            <div className="p-file-list">
                                                <div className="p-file-for">
                                                    <figure><img src={meeting.meeting_image.length > 0 && meeting.meeting_image[0].image} alt="dumy-image"/></figure>
                                                </div>
                                                <div className="p-file-nav">
                                                    {
                                                        meeting.meeting_image.map((item, k)=>
                                                            <figure><img src={item.image} alt="dumy-image"/></figure>
                                                        )
                                                    }
                                                </div>
                                            </div>

                                            <div className="p-article__pdf">
                                                <div className="p-article__pdf__btn mr-3">
                                                    <a className="btn-default btn-disabled  btn-pdf btn-r8 btn-h50" onClick={e=>setShowPdf(true)}>
                                                        <span>PDFを確認する</span>
                                                    </a>
                                                </div>
                                                <div className="p-article__pdf__btn mr-0">
                                                    <a className="btn-default btn-yellow btn-pdf btn-r8 btn-h50" onClick = {()=>setShowMemo(true)}>
                                                        <span>メモを確認する</span>
                                                    </a>
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
            {  
                modalStatus && 
                    <ModalYesNo hideModal={hideModal}>
                        一度承知したら元に戻せません。<br/>よろしいでしょうか。      
                    </ModalYesNo>
            }
        </div>

    </div>
    )
}



export default MeetingDetail;