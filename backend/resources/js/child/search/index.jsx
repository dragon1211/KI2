import React, { useEffect, useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import { CircularProgress  } from '@material-ui/core';

import Notification from '../notification';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import InfiniteScroll from "react-infinite-scroll-component";


const INFINITE = 5;
const SCROLL_DELAY_TIME = 1500;

const Search = () => {
    const [keyword, setKeyword] = useState('');
    const [tab_status, setTabStatus] = useState(false);
    const [meeting_list_non_approval, setMettingListNonApproval] = useState([]);
    const [meeting_list_approval, setMettingListApproval] = useState([]);

    const [fetch_meeting_list_non_approval, setFetchMettingListNonApproval] = useState([]);
    const [fetch_meeting_list_approval, setFetchMettingListApproval] = useState([]);

    const [loaded1, setLoaded1] = useState(true);
    const [loaded2, setLoaded2] = useState(true);
    const [loaded, setLoaded] = useState(true);
    const [initPage, setInitPage] = useState(true);

    const child_id = document.getElementById('child_id').value;
    const count = localStorage.getItem('notice');
    const [notice, setNotice] = useState(count);

    const handleNotice = (count) => {
        setNotice(count);
        localStorage.setItem("notice", count);
    }

    const handleSearch = (e) => {
        e.preventDefault();
        if(keyword == ''){
            document.getElementById('keyword').focus();
            return;
        }
        setLoaded1(false);
        setLoaded2(false);
        setInitPage(false);

        axios.get('/api/children/meetings/searchOfNonApprovalOfChild', {params:{keyword: keyword, child_id: child_id}})
        .then(response => {
            setLoaded1(true);
            handleNotice(response.data.notice);
            if(response.data.status_code==200){
                setMettingListNonApproval(response.data.params);
                var len = response.data.params.length;
                if(len > INFINITE)
                    setFetchMettingListNonApproval(response.data.params.slice(0, INFINITE));
                else setFetchMettingListNonApproval(response.data.params.slice(0, len));
            } 
        });
        axios.get('/api/children/meetings/searchOfApprovalOfChild', {params:{keyword: keyword, child_id: child_id}})
        .then((response) => {
            setLoaded2(true);
            handleNotice(response.data.notice);
            if(response.data.status_code==200){
                setMettingListApproval(response.data.params);
                var len = response.data.params.length;
                if(len > INFINITE)
                    setFetchMettingListApproval(response.data.params.slice(0, INFINITE));
                else setFetchMettingListApproval(response.data.params.slice(0, len));
            } 
        });
    }

    useEffect(()=>{
        setLoaded(loaded1 && loaded2);
    },[loaded1, loaded2])


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
                    <h2>ミーティング検索</h2>
                </div>
                <Notification notice={notice}/>
            </div>

            <div className="l-content-wrap">
                <section className="meeting-tab-container meeting-search">
                    <div className="meeting-tab-wrap">
                        <div className="meeting-head">
                            <form className="meeting-form" onSubmit={handleSearch}>
                                <label className="control-label" htmlFor="keyword">キーワード</label>
                                <input type="search" name="keyword" className="input-default input-keyword input-w380" id="keyword"  value={keyword} onChange={e=> setKeyword(e.target.value)}/>
                                <IconButton size="large" style={{position:'absolute', bottom:'3px', right:'5px', padding:'5px'}} type="submit">
                                    <SearchIcon fontSize="large" style={{color:'#d0d0d0', width:'40px', height:'40px'}}/>
                                </IconButton>
                            </form>
                            
                            <input className="tab-switch" id="tab-01" type="radio" name="tab_btn"/>
                            <input className="tab-switch" id="tab-02" type="radio" name="tab_btn"/>
                
                            <div className="meeting-tab">
                                <label className={`tab-label ${!tab_status && 'is-active'} `} htmlFor="tab-01" onClick={()=>setTabStatus(false)}><span>未承知</span></label>
                                <label className={`tab-label ${tab_status && 'is-active'} `} htmlFor="tab-02"  onClick={()=>setTabStatus(true)}><span>承知済み</span></label>
                            </div>
                        </div>
                    </div>
                    {
                        !loaded &&
                            <CircularProgress color="secondary" className="css-loader"/>
                    }
                    {
                        loaded && !initPage &&
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
                                    : <p className="text-center py-5 ft-xs-17">検索されたデータはありません。</p>
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
                                    : <p className="text-center py-5 ft-xs-17">検索されたデータはありません。</p>
                                } 
                                </InfiniteScroll>
                            </div>
                        }
                        </div>
                    }
                </section>
            </div>
        </div>
        
    )
}

export default Search;