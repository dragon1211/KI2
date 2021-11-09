import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

import Notification from '../../component/notification';

const ParentDetail = (props) => {

    const history = useHistory();
    
    const parent = {
        tel:'08012927104',
        email:'chankan07@gmail.com',
        text:'あああああああああああああああああああああああああああああああああああああああああああああ',
        company:'株式会社ZOTMAN'
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
    
	return (
    <div className="l-content">      
        <div className="l-content-w560">
            <div className="l-content__ttl">
                <div className="l-content__ttl__left">
                    <h2>親詳細</h2>
                </div>
                <Notification/>
            </div>

            <div className="l-content-wrap">
                <section className="profile-container">
                    <div className="profile-wrap">
                        <div className="profile-content">
                        <div className="profile-thumb">
                            <img src="/assets/img/avatar/avatar-sample04.jpg" className="profile-image" alt="" />                    
                        </div>
                        <p className="profile-name ft-xs-13">{parent.company}</p>
                        <div className="profile-info ft-xs-13">
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
                            <div className="profile-info__item txt-long">
                                <p className="txt">{parent.text}</p>
                            </div>
                        </div>
        
                        </div>
                    </div>
                </section>
            </div>
        </div>
    </div>
    )
}



export default ParentDetail;