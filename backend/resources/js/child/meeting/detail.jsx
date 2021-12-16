import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useHistory } from 'react-router-dom';
import { CircularProgress  } from '@material-ui/core';

import Notification from '../notification';
import moment from 'moment';
import Alert from '../../component/alert';
import ModalPdf from '../../component/pdf/modal_pdf';
import ModalMemo from '../../component/modal_memo';
import ModalConfirm from '../../component/modal_confirm';

const MeetingDetail = (props) => {

    const history = useHistory();
    const [notice, setNotice] = useState(localStorage.getItem('notice'));
    const [loaded, setLoaded] = useState(false);
    const [meeting, setMeeting] = useState(null);
    const [thumbnail, setThumbnail] = useState('');
    const [_approval_register, setApprovalRegister] = useState(false);

    const [show_pdf_modal, setShowPDFModal] = useState(false);
    const [show_memo_modal, setShowMemoModal] = useState(false);
    const [show_confirm_modal, setShowConfirmMoal] = useState(false);
    const [submit, setSubmit] = useState(false);
    const [_400error, set400Error] = useState('');
    const [_404error, set404Error] = useState('');
    const [_success, setSuccess] = useState('');

    useEffect(() => {
        setLoaded(false);
        let child_id = document.getElementById('child_id').value;
        axios.get(`/api/children/meetings/detail/${props.match.params?.meeting_id}`, {params:{child_id: child_id}})
        .then(response => {
            setLoaded(true);
            setNotice(response.data.notice);
            if(response.data.status_code == 200)
            {
                var meeting = response.data.params;
                setMeeting(meeting);
                if(meeting.meeting_image.length > 0) setThumbnail(meeting.meeting_image[0].image);
                if(meeting.approval.approval_at != null){
                    setApprovalRegister(true); 
                }
            }
            else {
                set400Error("失敗しました。");
            }
        })
        .catch(err=>{
            setLoaded(true);
            setNotice(err.response.data.notice);
            if(err.response.status==404){
                set404Error(err.response.data.message);
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
            setShowConfirmMoal(false);
            setNotice(response.data.notice);
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
                        loaded && _approval_register == false && meeting &&
                            <div className="p-consent-btn">
                                <button className="btn-default btn-yellow btn-consent btn-shadow btn-r8 btn-h42"
                                    onClick={e=>setShowConfirmMoal(true)}>
                                    <span>承認</span>
                                </button>
                            </div>
                    }
                </div>
                <Notification notice={notice}/>
            </div>
            {
                !loaded &&
                    <CircularProgress className="css-loader"/>
            }
            {
                loaded && meeting &&
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
                                            </div>
                                        </div>

                                        <div className="p-article__pdf">
                                            <div className="p-article__pdf__btn mr-3">
                                                {
                                                    meeting.pdf ?
                                                    <a data-v-ade1d018="" className="btn-default btn-yellow btn-pdf btn-r8 btn-h52" 
                                                        href={meeting.pdf} target='_blank'>
                                                        <span>PDFを確認する</span>
                                                    </a>
                                                    :<a className="btn-default btn-pdf btn-r8 btn-h50 btn-disabled"> 
                                                        <span>PDFを確認する</span>
                                                    </a>
                                                }
                                            </div>
                                            <div className="p-article__pdf__btn mr-0">
                                                {
                                                    meeting.memo ?
                                                    <a className="btn-default btn-pdf btn-r8 btn-h50 btn-yellow" 
                                                        onClick={()=>setShowMemoModal(true)}>
                                                        <span>メモを確認する</span>
                                                    </a>
                                                    :<a className="btn-default btn-pdf btn-r8 btn-h50 btn-disabled"> 
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
                                show={show_memo_modal}
                                title={"メモ"}
                                content={meeting?.memo}
                                handleClose={()=>setShowMemoModal(false)} />
                            <ModalPdf 
                                show={show_pdf_modal}
                                pdfPath={meeting.pdf}
                                handleClose={()=>setShowPDFModal(false)} />
                        </div>
                    </div>
                </div>
            }
            <ModalConfirm 
            show={show_confirm_modal} 
            message={"一度承知したら元に戻せません。\nよろしいでしょうか。"}
            handleClose={()=>setShowConfirmMoal(false)} 
            handleAccept={handleApprovalRegister} 
            loading={submit}/>
            {  _success &&  <Alert type="success" hide={()=>setSuccess('')}>{_success}</Alert> }
            {  _400error && <Alert type="fail" hide={()=>set400Error('')}>{_400error}</Alert> } 
            {  _404error && 
                <Alert type="fail" hide={()=>{
                    set404Error('');
                    history.push({
                        pathname: "/c-account/meeting"
                    });
                }}>
                {_404error}
                </Alert>
            }
        </div>
    </div>
    )
}



export default MeetingDetail;