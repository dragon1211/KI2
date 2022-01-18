import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';

import Notification from '../../component/notification';
import Alert from '../../component/alert';
import PageLoader from '../../component/page_loader';
import InfiniteScroll from "react-infinite-scroll-component";

const INFINITE = 10;
const SCROLL_DELAY_TIME = 1500;

const ChildMeetings = () => {

    const child_id = localStorage.getItem('kiki_acc_id');
    const [notice, setNotice] = useState(localStorage.getItem('notice'));
    const [tab_status, setTabStatus] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [loaded1, setLoaded1] = useState(false);
    const [loaded2, setLoaded2] = useState(false);
    const [meeting_list_non_approval, setMettingListNonApproval] = useState([]);
    const [meeting_list_approval, setMettingListApproval] = useState([]);
    const [fetch_meeting_list_non_approval, setFetchMettingListNonApproval] = useState([]);
    const [fetch_meeting_list_approval, setFetchMettingListApproval] = useState([]);
    const [_success, setSuccess] = useState('');
    const [_400error, set400Error] = useState('');

    const isMountedRef = useRef(true);
    
    
    useEffect(()=>{
        setLoaded(loaded1 && loaded2);
    },[loaded1, loaded2])
    
    
    useEffect(() => {
        isMountedRef.current = false;
        setLoaded(false);

        axios.get('/api/children/meetings/listOfNonApprovalOfChild', {params:{child_id: child_id}})
        .then(response => {
            if(isMountedRef.current) return;
            
            setLoaded1(true);
            setNotice(response.data.notice);
            if(response.data.status_code==200){
                setMettingListNonApproval(response.data.params);
                var len = response.data.params.length;
                if(len > INFINITE)
                    setFetchMettingListNonApproval(response.data.params.slice(0, INFINITE));
                else setFetchMettingListNonApproval(response.data.params.slice(0, len));
            }
            else {
                set400Error("失敗しました。");
            }
        })

        axios.get('/api/children/meetings/listOfApprovalOfChild', {params:{child_id: child_id}})
        .then(response => {
            if(isMountedRef.current) return;

            setLoaded2(true);
            setNotice(response.data.notice);
            if(response.data.status_code==200){
                setMettingListApproval(response.data.params);
                var len = response.data.params.length;
                if(len > INFINITE)
                    setFetchMettingListApproval(response.data.params.slice(0, INFINITE));
                else setFetchMettingListApproval(response.data.params.slice(0, len));
            }
            else {
                set400Error("失敗しました。");
            }
        })
            
        return function cleanup() {
            isMountedRef.current = true;
        }
    },[]);

    const fetchMoreListNonApproval = () => {
        setTimeout(() => {
            var x = fetch_meeting_list_non_approval.length;
            var y = meeting_list_non_approval.length;
            var c = 0;
            if(x+INFINITE < y) c = INFINITE;
            else c = y - x;
            setFetchMettingListNonApproval(meeting_list_non_approval.slice(0, x+c));
        }, SCROLL_DELAY_TIME);
    };

    const fetchMoreListApproval = () => {
        setTimeout(() => {
            var x = fetch_meeting_list_approval.length;
            var y = meeting_list_approval.length;
            var c = 0;
            if(x+INFINITE < y) c = INFINITE;
            else c = y - x;
            setFetchMettingListApproval(meeting_list_approval.slice(0, x+c));
        }, SCROLL_DELAY_TIME);
    };

    
	return (
        <div className="l-content">
            <div className="l-content__ttl">
                <div className="l-content__ttl__left">
                    <h2>ミーティング一覧</h2>
                </div>
                <Notification notice={notice}/>
            </div>

            <div className="l-content-wrap">
                <section className="meeting-tab-container">
                    <div className="meeting-tab-wrap">
                        <div className="meeting-head">
                            <input className="tab-switch" id="tab-01" type="radio" name="tab_btn"/>
                            <input className="tab-switch" id="tab-02" type="radio" name="tab_btn"/>
                
                            <div className="meeting-tab">
                                <label className={`tab-label ${!tab_status && 'is-active'} `} htmlFor="tab-01"  onClick={()=>setTabStatus(false)}><span>未承知</span></label>
                                <label className={`tab-label ${ tab_status && 'is-active'} `} htmlFor="tab-02"  onClick={()=>setTabStatus(true)}><span>承知済み</span></label>
                            </div> 
                        </div>
                    </div>
                    {
                        !loaded && <PageLoader />
                    }
                    {
                        loaded &&
                        <div className="meeting-content">
                        {
                            !tab_status &&
                            <div className="meeting-content-wrap is-active" id="item01">
                                <InfiniteScroll
                                    dataLength={fetch_meeting_list_non_approval.length}
                                    next={fetchMoreListNonApproval}
                                    hasMore={fetch_meeting_list_non_approval.length != meeting_list_non_approval.length}
                                    loader={
                                        <div id="dots3">
                                            <span></span>
                                            <span></span>
                                            <span></span>
                                            <span></span>
                                        </div>
                                    }
                                    style={{overflow:'none', position:'relative'}}
                                >
                                {
                                    fetch_meeting_list_non_approval.length > 0 ?
                                    fetch_meeting_list_non_approval?.map((item, id) => 
                                        <div className="meeting-item" key={id}>
                                            <div className="user-wrap user-sm">
                                                <Link to={{
                                                    pathname: `/c-account/parent/detail/${item.father_id}`,
                                                    state: { tab_status: true}
                                                }}>
                                                    <div className="user-avatar">
                                                        <img alt="name" className="father-img" src={item.father.image}/>
                                                    </div>
                                                    <p className="user-name">{item.father.company}</p>
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
                                    : <p className="text-center py-5 ft-xs-17">データはありません。</p>
                                }
                                </InfiniteScroll>                                    
                            </div>
                        }
                        {
                            tab_status &&
                            <div className="meeting-content-wrap is-active" id="item02">
                                <InfiniteScroll
                                    dataLength={fetch_meeting_list_approval.length}
                                    next={fetchMoreListApproval}
                                    hasMore={fetch_meeting_list_approval.length != meeting_list_approval.length}
                                    loader={
                                        <div id="dots3">
                                            <span></span>
                                            <span></span>
                                            <span></span>
                                            <span></span>
                                        </div>
                                    }
                                    style={{overflow:'none', position:'relative'}}
                                >
                                {
                                    fetch_meeting_list_approval.length > 0 ?
                                    fetch_meeting_list_approval?.map((item, id) =>                                          
                                            <div className="meeting-item" key={id}>
                                                <div className="user-wrap user-sm">
                                                    <Link to = {`/c-account/parent/detail/${item.father_id}`}>
                                                        <div className="user-avatar">
                                                            <img alt="name" className="father-img" src={item.father.image}/>
                                                        </div>
                                                        <p className="user-name">{item.father.company}</p>
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
                                                                { moment(item.approval.approval_at).format('YYYY/MM/DD') }
                                                            </span>
                                                        </span>
                                                    </time>
                                                </div>
                                            </div>
                                        )
                                    : <p className="text-center py-5 ft-xs-17">データはありません。</p>
                                } 
                                </InfiniteScroll>
                            </div>
                        }
                        </div>
                    }
                </section>
            </div>
            {  _400error && <Alert type="fail" hide={()=>set400Error('')}>{_400error}</Alert> } 
            {  _success &&  <Alert type="success" hide={()=>setSuccess('')}>{_success}</Alert> }
        </div>
        
    )
}



export default ChildMeetings;