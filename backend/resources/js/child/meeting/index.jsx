import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';


import Notification from '../../component/notification';

const meeting_list = [
    {
        id:1,
        first_name: '田中',
        last_name:'達也',
        image:'/assets/img/avatar/avatar-sample03@2x.png',
        title:'ミーティングタイトルミーティングタイトルミーテ',
        text:'ミーティング詳細ミーティング詳細ミーティング詳細ミーティング詳細ミーティング詳細ミーティング詳細ミーティングミーティング詳細ミーティング詳細ミーティング詳細ミーティング詳細ミーティング詳細ミーティング',
        meeting_approval:{
            approve_at:'2021/7/21',
            updated_at:'2021/7/21'
        }
    },
    {
        id:2,
        first_name: '田中',
        last_name:'達也',
        image:'/assets/img/avatar/avatar-sample03@2x.png',
        title:'ミーティングタイトルミーティングタイトルミーテ',
        text:'ミーティング詳細ミーティング詳細ミーティング詳細ミーティング詳細ミーティング詳細ミーティング詳細ミーティングミーティング詳細ミーティング詳細ミーティング詳細ミーティング詳細ミーティング詳細ミーティング',
        meeting_approval:{
            approve_at:'2021/7/21',
            updated_at:'2021/7/21'
        }
    },
    {
        id:3,
        first_name: '田中',
        last_name:'達也',
        image:'/assets/img/avatar/avatar-sample03@2x.png',
        title:'ミーティングタイトルミーティングタイトルミーテ',
        text:'ミーティング詳細ミーティング詳細ミーティング詳細ミーティング詳細ミーティング詳細ミーティング詳細ミーティングミーティング詳細ミーティング詳細ミーティング詳細ミーティング詳細ミーティング詳細ミーティング',
        meeting_approval:{
            approve_at:'2021/7/21',
            updated_at:'2021/7/21'
        }
    },
    {
        id:4,
        first_name: '田中',
        last_name:'達也',
        image:'/assets/img/avatar/avatar-sample03@2x.png',
        title:'ミーティングタイトルミーティングタイトルミーテ',
        text:'ミーティング詳細ミーティング詳細ミーティング詳細ミーティング詳細ミーティング詳細ミーティング詳細ミーティングミーティング詳細ミーティング詳細ミーティング詳細ミーティング詳細ミーティング詳細ミーティング',
        meeting_approval:{
            approve_at:'2021/7/21',
            updated_at:'2021/7/21'
        }
    }
]


const Meeting = () => {

    const history = useHistory();
    const [tab_status, setTabStatus] = useState(false);
    // const [meeting_list, setMettingList] = useState([]);

    const clickTab01 = () => {
        setTabStatus(false);
    }

    const clickTab02 = () => {
        setTabStatus(true);
    }

    useEffect(
        () => {
            const formdata = new FormData();
            let child_id = 1;

            // axios.get('/api/meetings/list')
            // .then(response => {
            //     if(response.data.status_code==200){
            //         // window.location.href = '/register/c-account/complete';
            //         console.log(response.data)
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
                        
                        <div className="meeting-content">
                            <div className="meeting-content-wrap is-active" id="item01">
                                {
                                    meeting_list.map((item, id) => 

                                    <div className="meeting-item" key={id}>
                                        <div className="user-wrap user-sm">
                                            <a  onClick={e => {
                                                    e.preventDefault();
                                                    history.push({
                                                    pathname: `/c-account/parent/detail/${item.id}`,
                                                    state: {}
                                                    });
                                                }}
                                            >
                                                <div className="user-avatar">
                                                    <img alt="name" className="avatar-img" src={item.image}/>
                                                </div>
                                                <p className="user-name">{item.first_name}  {item.last_name}</p>
                                            </a>
                                        </div>
                                        <a className="meeting-link"
                                            onClick={e => {
                                                e.preventDefault();
                                                history.push({
                                                pathname: `/c-account/meeting/detail/${item.id}`,
                                                state: {}
                                                });
                                            }}
                                        >
                                            <h3 className="meeting-ttl">{item.title}</h3>
                                            <p className="meeting-txt">{item.text}</p>
                                        </a>  
                                        <div className="user-date">
                                            <time dateTime="2021-07-30" className="user-updated-time">
                                                <span className="user-updated">最終更新日：<span className="date">{item.meeting_approval.updated_at}</span></span>
                                            </time>
                                            <time dateTime="2021-07-30" className="user-awareness-time">
                                                <span className="user-awareness">承知日：<span className="date">{item.meeting_approval.approve_at}</span></span>
                                            </time>
                                        </div>
                                    </div>
                                
                                    )
                                } 
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
        
    )
}



export default Meeting;