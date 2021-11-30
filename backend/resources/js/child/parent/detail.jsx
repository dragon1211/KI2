import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useHistory, Link } from 'react-router-dom';
import { CircularProgress  } from '@material-ui/core';

import Notification from '../notification';
import Alert from '../../component/alert';

const ParentDetail = (props) => {

    const history = useHistory();
    const [notice, setNotice] = useState(localStorage.getItem('notice'));
    const [loaded, setLoaded] = useState(false);
    const [parent, setParent] = useState(null);

    const [_400error, set400Error] = useState('');
    const [_404error, set404Error] = useState('');
    const [_success, setSuccess] = useState('');

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
        },[]
    );

    useEffect(()=>{
        var navbar_list = document.getElementsByClassName("mypage-nav-list__item");
        for(let i=0; i<navbar_list.length; i++)
            navbar_list[i].classList.remove('nav-active');
        document.getElementsByClassName("-parentinfo")[0].classList.add('nav-active');
    },[]);
    
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
                {
                    !loaded &&
                        <CircularProgress className="css-loader"/>
                }
                {
                    loaded && parent &&
                    <div className="profile-wrap">
                        <div className="profile-content">
                            <div className="profile-thumb">
                                <img src={parent.image} className="profile-image" alt="parent-image" />                    
                            </div>
                            <p className="profile-name">{parent.company}</p>
                            <div className="profile-info">
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
                                    <p className="txt">{parent.profile ? parent.profile: '未入力'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                }
                {  _400error && <Alert type="fail" hide={()=>set400Error('')}>{_400error}</Alert> } 
                {  _success &&  <Alert type="success" hide={()=>setSuccess('')}>{_success}</Alert> }
                {  _404error && 
                    <Alert type="fail" hide={()=>{
                        history.push({
                            pathname: "/c-account/parent"
                        });
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



export default ParentDetail;