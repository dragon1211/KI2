import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

import Notification from '../../component/notification';

const parent_list = [
    {
        id:1,
        company: '株式会社ZOTMAN',
        image:'/assets/img/avatar/avatar-sample03@2x.png',
    },
    {
        id:2,
        company: '株式会社ZOTMAN',
        image:'/assets/img/avatar/avatar-sample03@2x.png',
    },
    {
        id:3,
        company: '株式会社ZOTMAN',
        image:'/assets/img/avatar/avatar-sample03@2x.png',
    },
    {
        id:4,
        company: '株式会社ZOTMAN',
        image:'/assets/img/avatar/avatar-sample03@2x.png',
    },
    {
        id:5,
        company: '株式会社ZOTMAN',
        image:'/assets/img/avatar/avatar-sample03@2x.png',
    },
    {
        id:6,
        company: '株式会社ZOTMAN',
        image:'/assets/img/avatar/avatar-sample03@2x.png',
    },
    {
        id:7,
        company: '株式会社ZOTMAN',
        image:'/assets/img/avatar/avatar-sample03@2x.png',
    },
    {
        id:8,
        company: '株式会社ZOTMAN',
        image:'/assets/img/avatar/avatar-sample03@2x.png',
    }
]


const Parent = () => {
    
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

            // axios.get('/api/fathers/listOfChild/')
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
                    <h2>親一覧</h2>
                </div>
                <Notification/>
            </div>

            <div className="l-content-wrap">
                <section className="search-container">
                    <div className="search-wrap">
                        <div className="search-content">
                            {
                                parent_list.map((item, id)=>
                                <div className="search-item border-0" key={id}>
                                    <a onClick={e => {
                                            e.preventDefault();
                                            history.push({
                                            pathname: `/c-account/parent/detail/${item.id}`,
                                            state: {}
                                            });
                                        }}
                                    >
                                        <div className="user-wrap">
                                            <div className="user-avatar">
                                                <img alt="name" className="avatar-img" src={item.image}/>
                                            </div>
                                            <div className="user-info">
                                                <p className="user-name">{item.company}</p>
                                            </div>
                                        </div>
                                    </a>
                                </div>
                                )
                            }
                        </div>
                    </div>
                </section>
            </div>
        </div>
        
    )
}



export default Parent;