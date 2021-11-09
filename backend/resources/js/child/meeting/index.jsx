import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useHistory, Link } from 'react-router-dom';
import moment from 'moment';
import { CircularProgress  } from '@material-ui/core';

import Notification from '../../component/notification';


const Meeting = () => {

    const history = useHistory();
    const [tab_status, setTabStatus] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [meeting_list_non_approval, setMettingListNonApproval] = useState([]);
    const [meeting_list_approval, setMettingListApproval] = useState([]);


    useEffect(
        () => {
            setLoaded(false);
            let child_id = document.getElementById('child_id').value;
            axios.get('/api/children/meetings/listOfNonApprovalOfChild', {params:{child_id: child_id}})
            .then(response => {
                console.log(response.data.params)
                if(response.data.status_code==200)
                {
                    setMettingListNonApproval(response.data.params);
                }
            })
            .catch(err=>console.log(err))
        },[]
    );

    useEffect(
        () => {
            let child_id = document.getElementById('child_id').value;
            axios.get('/api/children/meetings/listOfApprovalOfChild', {params:{child_id: child_id}})
            .then(response => {
                setLoaded(true);
                console.log(response.data.params)
                if(response.data.status_code==200)
                {
                    setMettingListApproval(response.data.params);
                }
            })
            .catch(err=>console.log(err))
        },[]
    );


    const clickTab01 = () => {
        setTabStatus(false);
    }

    const clickTab02 = () => {
        setTabStatus(true);
    }

    
	return (
        <div className="l-content">
            <div className="l-content__ttl">
                <div className="l-content__ttl__left">
                    <h2>ミーティング一覧</h2>
                </div>
                <Notification/>
            </div>

            <div className="l-content-wrap">
                <section className="meeting-tab-container">
                    <div className="meeting-tab-wrap">
                        <div className="meeting-head">
                            <input className="tab-switch" id="tab-01" type="radio" name="tab_btn"/>
                            <input className="tab-switch" id="tab-02" type="radio" name="tab_btn"/>
                
                            <div className="meeting-tab">
                                <label className={`tab-label ${!tab_status && 'is-active'} `} htmlFor="tab-01" onClick={clickTab01}><span>未承知</span></label>
                                <label className={`tab-label ${tab_status && 'is-active'} `} htmlFor="tab-02"  onClick={clickTab02}><span>承知済み</span></label>
                            </div> 
                        </div>
                        {
                            !loaded &&
                                <CircularProgress color="secondary" style={{top:'calc(40% - 22px)', left:'calc(50% - 22px)', color:'green', position:'absolute'}}/>
                        }
                        {
                            loaded &&
                            <div className="meeting-content">
                                <div className={`meeting-content-wrap ${!tab_status && 'is-active'}`} id="item01">
                                    {
                                        meeting_list_non_approval?.map((item, id) => 
                                        <div className="meeting-item" key={id}>
                                            <div className="user-wrap user-sm">
                                                <Link to={{
                                                    pathname: `/c-account/parent/detail/${item.father_id}`,
                                                    state: { tab_status: true}
                                                }}>
                                                    <div className="user-avatar">
                                                        <img alt="name" className="father-img" src={item.fathers && item.fathers[0].image}/>
                                                    </div>
                                                    <p className="user-name">{`${item.fathers && item.fathers[0]?.last_name} ${item.fathers && item.fathers[0]?.first_name}`}</p>
                                                </Link>
                                            </div>
                                            <Link to={`/c-account/meeting/detail/${item.id}`} className="meeting-link">
                                                <h3 className="meeting-ttl">{item.title}</h3>
                                                <p className="meeting-txt">{item.text}</p>
                                            </Link>  
                                            <div className="user-date">
                                                <time dateTime="2021-07-30" className="user-updated-time">
                                                    <span className="user-updated">最終更新日：<span className="date">{moment(item.updated_at).format('YYYY/MM/DD')}</span></span>
                                                </time>
                                                <time dateTime="2021-07-30" className="user-awareness-time">
                                                    <span className="user-awareness">承知日：<span className="date"></span></span>
                                                </time>
                                            </div>
                                        </div>
                                        )
                                    } 
                                </div>
                                <div className={`meeting-content-wrap ${tab_status && 'is-active'}`} id="item02">
                                    {
                                        meeting_list_approval?.map((item, id) =>                                          
                                            <div className="meeting-item" key={id}>
                                                <div className="user-wrap user-sm">
                                                    <Link to = {`/c-account/parent/detail/${item.father_id}`}>
                                                        <div className="user-avatar">
                                                            <img alt="name" className="father-img" src={item.fathers && item.fathers[0].image}/>
                                                        </div>
                                                        <p className="user-name">{`${item.fathers && item.fathers[0]?.last_name} ${item.fathers && item.fathers[0]?.first_name}`}</p>
                                                    </Link>
                                                </div>
                                                <Link to={`/c-account/meeting/detail/${item.id}`} className="meeting-link">
                                                    <h3 className="meeting-ttl">{item.title}</h3>
                                                    <p className="meeting-txt">{item.text}</p>
                                                </Link>  
                                                <div className="user-date">
                                                    <time dateTime="2021-07-30" className="user-updated-time">
                                                        <span className="user-updated">最終更新日：
                                                            <span className="date">
                                                                {moment(item.updated_at).format('YYYY/MM/DD')}
                                                            </span>
                                                        </span>
                                                    </time>
                                                    <time dateTime="2021-07-30" className="user-awareness-time">
                                                        <span className="user-awareness">承知日：
                                                            <span className="date">
                                                                { item.meeting_approvals &&  moment(item.meeting_approvals[0].approval_at).format('YYYY/MM/DD') }
                                                            </span>
                                                        </span>
                                                    </time>
                                                </div>
                                            </div>
                                        )
                                    } 
                                </div>
                            </div>
                        }
                    </div>
                    {
                        loaded && ((meeting_list_non_approval.length == 0 && !tab_status) || (meeting_list_approval.length == 0 && tab_status)) &&
                            <p className="text-center mt-5 ft-18">データが存在しません。</p>
                    }
                </section>
            </div>
        </div>
        
    )
}



export default Meeting;