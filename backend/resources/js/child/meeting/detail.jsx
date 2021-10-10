import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';


import Notification from '../../component/notification';
import ModalYesNo from '../../component/modal_yesno';
import Alert from '../../component/alert';

const MeetingDetail = (props) => {

    const history = useHistory();
    const [alertStatus, setAlertStatus] = useState('');
    const [modalStatus, setModalStatus] = useState(false);
   
    useEffect(
        () => {
            const formdata = new FormData();
            let child_id = 1;

            // axios.get(`/api/meetings/listOfNonApprovalOfChild/${props.match.params?.id}`, {child_id: child_id})
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
                        <button className="btn-default btn-yellow btn-consent btn-shadow btn-r8 btn-h42 btn-fz14" onClick={showModal}>
                            <span>承認</span>
                        </button>
                    </div>
                </div>
                <Notification/>
            </div>

            <div className="l-content-wrap">
                <div className="p-article p-article-single">
                    <div className="p-article-wrap">
                        <article className="p-article__body">
                            <div className="p-article__content">
                                <p className="meeting-label">未承知</p>
                                <h3 className="meeting-ttl">ミーティングタイトルミーティングタイトルミミーティングタイトルミーティングタイトルミ</h3>
                                <time dateTime="2021-07-30" className="meeting-time">
                                    <span className="meeting-date">2021/7/21</span>
                                </time>
                                <div className="user-wrap user-sm">
                                    <a href="">
                                        <div className="user-avatar">
                                            <img alt="name" className="avatar-img" src="/assets/img/avatar/avatar-sample03@2x.png"/>
                                        </div>
                                        <p className="user-name text-grey">田中　達也</p>
                                    </a>
                                    <div className="user-advice-btn">
                                        <a className="btn-default btn-yellow btn-pdf btn-r8 btn-h45 btn-fz14">
                                            <span>親に電話で相談</span>
                                        </a>
                                    </div>
                                </div>
                        
                                <div className="p-article__context">
                                    <div className="p-file-list">
                                        <div className="p-file-for">
                                            <figure><img src="/assets/img/dummy/post-dummy01.jpg" alt=""/></figure>
                                        </div>
                                        <div className="p-file-nav">
                                            <figure><img src="/assets/img/dummy/post-dummy01.jpg" alt=""/></figure>
                                            <figure><img src="/assets/img/dummy/post-dummy02.jpg" alt=""/></figure>
                                            <figure><img src="/assets/img/dummy/post-dummy03.jpg" alt=""/></figure>
                                            <figure><img src="/assets/img/dummy/post-dummy04.jpg" alt=""/></figure>
                                            <figure><img src="/assets/img/dummy/post-dummy05.jpg" alt=""/></figure>
                                            <figure><img src="/assets/img/dummy/post-dummy01.jpg" alt=""/></figure>
                                            <figure><img src="/assets/img/dummy/post-dummy02.jpg" alt=""/></figure>
                                            <figure><img src="/assets/img/dummy/post-dummy03.jpg" alt=""/></figure>
                                            <figure><img src="/assets/img/dummy/post-dummy04.jpg" alt=""/></figure>
                                            <figure><img src="/assets/img/dummy/post-dummy05.jpg" alt=""/></figure>
                                        </div>
                                    </div>

                                    <div className="p-article__pdf">
                                        <div className="p-article__pdf__btn mr-2">
                                            <a href="/assets/img/dummy/sample.pdf" className="btn-default btn-disabled  btn-pdf btn-r8 btn-h60 h-xs-45-px" target="_blank">
                                                <span>PDFを確認する</span>
                                            </a>
                                        </div>
                                        <div className="p-article__pdf__btn mr-0">
                                            <a href="/assets/img/dummy/sample.pdf" className="btn-default btn-yellow btn-pdf btn-r8 btn-h60 h-xs-45-px" target="_blank">
                                                <span>メモを確認する</span>
                                            </a>
                                        </div>
                                    </div>
                            
                                    <p className="p-article__txt">ミーティング詳細ミーティング詳細ミーティング詳細ミーティング詳細ミーティング詳細ミーティングミーティング詳細ミーティング。</p>
                                    <p className="p-article__txt">ミーティング詳細ミーティング詳細ミーティング詳細ミーティング詳細ミーティング詳細ミーティングミーティング詳細ミーティング。</p>
                                </div>
                            </div>
                        </article>
                    </div>
                </div>
            </div>

            {  alertStatus == 'success' && <Alert type="success">承認しました。</Alert>  }
            {  alertStatus == 'failed'  && <Alert type="fail">失敗しました。</Alert>  }

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