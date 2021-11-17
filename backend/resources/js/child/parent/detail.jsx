import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CircularProgress  } from '@material-ui/core';

import Notification from '../notification';

const ParentDetail = (props) => {

    const [notice, setNotice] = useState(localStorage.getItem('notice'));
    const [loaded, setLoaded] = useState(false);
    const [parent, setParent] = useState({image:'', email:'', profile:'', tel:'', company:''});

    useEffect(
        () => {
            setLoaded(false);
            axios.get('/api/children/fathers/detail/'+props.match.params.father_id)
            .then(response => {
                setLoaded(true);
                setNotice(response.data.notice);
                if(response.data.status_code==200){
                    setParent(response.data.params);
                }
            })
        },[]
    );
    
	return (
    <div className="l-content">      
        <div className="l-content-w560">
            <div className="l-content__ttl">
                <div className="l-content__ttl__left">
                    <h2>親詳細</h2>
                </div>
                <Notification notice={notice}/>
            </div>

            <div className="l-content-wrap">
                <section className="profile-container">
                    <div className="profile-wrap">
                        {
                            !loaded &&
                                <CircularProgress className="css-loader"/>
                        }
                        {
                            loaded && 
                                <div className="profile-content">
                                    <div className="profile-thumb">
                                        <img src={parent.image} className="profile-image" alt="parent-image" />                    
                                    </div>
                                    <p className="profile-name ft-xs-16">{parent.company}</p>
                                    <div className="profile-info ft-xs-17">
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
                                            <p className="txt">{parent.profile}</p>
                                        </div>
                                    </div>
                                </div>
                        }
                    </div>
                </section>
            </div>
        </div>
    </div>
    )
}



export default ParentDetail;