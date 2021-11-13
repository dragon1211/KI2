import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useHistory, Link } from 'react-router-dom';
import moment from 'moment';
import { CircularProgress  } from '@material-ui/core';
import IconButton from '@mui/material/IconButton';

import Notification from '../notification';
import Alert from '../../component/alert';
import InfiniteScroll from "react-infinite-scroll-component";

const INFINITE = 5;
const SCROLL_DELAY_TIME = 1500;

const Meeting = () => {

    const count = localStorage.getItem('notice');
    const [notice, setNotice] = useState(count);
    const [tab_status, setTabStatus] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [loaded1, setLoaded1] = useState(false);
    const [loaded2, setLoaded2] = useState(false);
    const [meeting_list_incomplete, setMeetingListIncomplete] = useState([]);
    const [meeting_list_complete, setMeetingListComplete] = useState([]);
    const [fetch_meeting_list_incomplete, setFetchMeetingListIncomplete] = useState([]);
    const [fetch_meeting_list_complete, setFetchMeetingListComplete] = useState([]);
    const [_success, setSuccess] = useState('');

    const handleNotice = (count) => {
        setNotice(count);
        localStorage.setItem("notice", count);
    }

    useEffect(()=>{
        if(localStorage.getItem("from_login")){
          setSuccess("ログインに成功しました!");
          localStorage.removeItem("from_login");
        }
    },[]);

    useEffect(()=>{
        setLoaded(loaded1 && loaded2);
    },[loaded1, loaded2])


    useEffect(
        () => {
            setLoaded(false);
            let father_id = document.getElementById('father_id').value;

            axios.get('/api/fathers/meetings/listOfIncompleteOfFather', {params:{father_id: father_id}})
            .then(response => {
                setLoaded1(true);
                handleNotice(response.data.notice);
                console.log(response.data);
                if(response.data.status_code==200){
                    var list = response.data.params;
                    var arr = [];
                    for(var i in list){
                        var total=0, num=0;
                        for(var j in list[i].approval)
                        {
                          if(list[i].approval[j].approval_at) num ++;
                          total ++;
                        }
                        arr.push({...list[i], denominator:total, numerator:num})
                    }
                    setMeetingListIncomplete(arr);
                    var len = arr.length;
                    if(len > INFINITE)
                        setFetchMeetingListIncomplete(arr.slice(0, INFINITE));
                    else setFetchMeetingListIncomplete(arr.slice(0, len));
                }
            })

            axios.get('/api/fathers/meetings/listOfCompleteOfFather', {params:{father_id: father_id}})
            .then(response => {
              setLoaded2(true);
              handleNotice(response.data.notice);
              console.log(response.data);
              if(response.data.status_code==200){
                  var list = response.data.params;
                  var arr = [];
                  for(var i in list){
                      var total=0, num=0;
                      for(var j in list[i].approval)
                      {
                        if(list[i].approval[j].approval_at) num ++;
                        total ++;
                      }
                      arr.push({...list[i], denominator:total, numerator:num})
                  }
                  setMeetingListComplete(arr);
                  var len = arr.length;
                  if(len > INFINITE)
                      setFetchMeetingListComplete(arr.slice(0, INFINITE));
                  else setFetchMeetingListComplete(arr.slice(0, len));
                }
            })
        },[]
    );

    const fetchMoreListNonApproval = () => {
        setTimeout(() => {
            var x = fetch_meeting_list_incomplete.length;
            var y = meeting_list_incomplete.length;
            var c = 0;
            if(x+INFINITE < y) c = INFINITE;
            else c = y - x;
            setFetchMeetingListIncomplete(meeting_list_incomplete.slice(0, x+c));
        }, SCROLL_DELAY_TIME);
    };

    const fetchMoreListApproval = () => {
        setTimeout(() => {
            var x = fetch_meeting_list_complete.length;
            var y = meeting_list_complete.length;
            var c = 0;
            if(x+INFINITE < y) c = INFINITE;
            else c = y - x;
            setFetchMeetingListComplete(meeting_list_complete.slice(0, x+c));
        }, SCROLL_DELAY_TIME);
    };

    async function handleFavorite(meetingId, currentFavorite, stateName) {
      const formdata = new FormData();
      formdata.append('meeting_id', meetingId);
      formdata.append('is_favorite', currentFavorite == 1 ? 0 : 1);
      axios.post('/api/fathers/meetings/registerFavorite', formdata)
      .then(response=>{
        if(response.data.status_code==200){
            if(stateName == "inCompleteOfFather") {
              const newList = meeting_list_incomplete.map((item) => {
                if (item.id === meetingId) {
                  const updatedItem = {
                    ...item,
                    is_favorite: currentFavorite == 1 ? 0 : 1,
                  };
                  return updatedItem;
                }
                return item;
              });
              setMeetingListIncomplete(newList);
              setFetchMeetingListIncomplete(newList.slice(0, fetch_meeting_list_incomplete.length));
            } else {
              const newList = meeting_list_complete.map((item) => {
                if (item.id === meetingId) {
                  const updatedItem = {
                    ...item,
                    is_favorite: currentFavorite == 1 ? 0 : 1,
                  };
                  return updatedItem;
                }
                return item;
              });
              setMeetingListComplete(newList);
              setFetchMeetingListComplete(newList.slice(0, fetch_meeting_list_complete.length));
            }  
        }
      })
    };
  

    
	return (
        <div className="l-content">
            <div className="l-content__ttl">
                <div className="l-content__ttl__left">
                    <h2>ミーティング一覧</h2>
                    <div className="p-meetingAdd-btn">
                        <Link to = '/p-account/meeting/new' data-v-ade1d018="kikikanri" 
                          className="btn-default btn-yellow btn-meeting btn-shadow btn-r8 btn-h48 btn-fz14">
                            <span>ミーティングを追加</span>
                            <svg version="1.1" viewBox="0 0 500 500" className="icon svg-icon svg-fill svg-up">
                              <path fill="#000" stroke="none" pid="0" d="M250 437.6c-16.5 0-30-13.5-30-30V280.1H92.5c-16.5 0-30-13.5-30-30s13.5-30 30-30H220V92.6c0-16.5 13.5-30 30-30s30 13.5 30 30v127.5h127.5c16.5 0 30 13.5 30 30s-13.5 30-30 30H280v127.5c0 16.5-13.5 30-30 30z"></path>
                            </svg>
                        </Link>
                    </div>
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
                                <label className={`tab-label ${!tab_status && 'is-active'} `} htmlFor="tab-01"  onClick={()=>setTabStatus(false)}><span>未完了</span></label>
                                <label className={`tab-label ${ tab_status && 'is-active'} `} htmlFor="tab-02"  onClick={()=>setTabStatus(true)}><span>完了済み</span></label>
                            </div> 
                        </div>
                    </div>
                    {
                        !loaded &&
                            <CircularProgress color="secondary" className="css-loader"/>
                    }
                    {
                        loaded &&
                        <div className="meeting-content">
                        {
                            !tab_status &&
                            <div className="meeting-content-wrap is-active" id="item01">
                                <InfiniteScroll
                                    dataLength={fetch_meeting_list_incomplete.length}
                                    next={fetchMoreListNonApproval}
                                    hasMore={fetch_meeting_list_incomplete.length != meeting_list_incomplete.length}
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
                                    fetch_meeting_list_incomplete.length > 0 ?
                                    fetch_meeting_list_incomplete?.map((item, id) => 
                                      <div className="meeting-item" key={id}>
                                          <Link to={`/p-account/meeting/detail/${item.id}`}  className="meeting-link">
                                              <h3 className="meeting-ttl">{ item.title }</h3>
                                              <p className="meeting-txt">{ item.text }</p>
                                              <time dateTime="2021-07-30" className="meeting-time">
                                                  <span className="meeting-date">{ moment(item.updated_at).format('YYYY/MM/DD') }</span>
                                              </time>
                                              <div className="meeting-member">
                                                  <div className="meeting-member-wrap">
                                                      <div data-url="login.html" className="meeting-member-link">
                                                          <ul className="meeting-member-count">
                                                              <li className="numerator">{item.numerator}</li>
                                                              <li className="denominator">{item.denominator}</li>
                                                          </ul>
                                  
                                                          <ul className="meeting-member-list" role="list">
                                                            { 
                                                              item.approvals?.map((v, inx1) =>
                                                                <li className="meeting-member__item" role="listitem" key={inx1}>
                                                                  <div className="avatar">
                                                                    <img alt="name" className="avatar-img" src={v?.child.image} />
                                                                  </div>
                                                                </li>
                                                              )
                                                            }
                                                          </ul>
                                                      </div>
                                                  </div>
                                              </div>
                                          </Link>
                                          <button aria-label="お気に入り" data-tooltip="お気に入り"  
                                              onClick={e => {
                                                e.preventDefault();
                                                handleFavorite(item.id, item.is_favorite, 'inCompleteOfFather');
                                              }} 
                                              className={`icon a-icon like-icon ${item.is_favorite == 1 ? "icon-starFill" : "icon-star"} a-icon-size_medium`}>
                                          </button>
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
                                    dataLength={fetch_meeting_list_complete.length}
                                    next={fetchMoreListApproval}
                                    hasMore={fetch_meeting_list_complete.length != meeting_list_complete.length}
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
                                    fetch_meeting_list_complete.length > 0 ?
                                    fetch_meeting_list_complete?.map((item, id) =>                                          
                                      <div className="meeting-item" key={id}>
                                          <Link to={`/p-account/meeting/detail/${item.id}`} className="meeting-link">
                                              <h3 className="meeting-ttl">{ item.title }</h3>
                                              <p className="meeting-txt">{ item.text }</p>
                                              <time dateTime="2021-07-30" className="meeting-time">
                                                <span className="meeting-date">{ moment(item.updated_at).format('YYYY/MM/DD') }</span>
                                              </time>
                                              <div className="meeting-member">
                                                <div className="meeting-member-wrap">
                                                  <div data-url="login.html" className="meeting-member-link">
                                                    <ul className="meeting-member-count">
                                                        <li className="numerator">{item.numerator}</li>
                                                        <li className="denominator">{item.denominator}</li>
                                                    </ul>
                                                    <ul className="meeting-member-list" role="list">
                                                      { 
                                                        item.approval?.map((v, inx1) =>
                                                          <li className="meeting-member__item" role="listitem" key={inx1}>
                                                            <div className="avatar">
                                                              <img alt="name" className="avatar-img" src={v?.child.image} />
                                                            </div>
                                                          </li>
                                                        )
                                                      }
                                                    </ul>
                                                  </div>
                                                </div>
                                              </div>
                                          </Link>
                                          <button aria-label="お気に入り" data-tooltip="お気に入り"  
                                              onClick={e => {
                                                e.preventDefault();
                                                handleFavorite(item.id, item.is_favorite, 'completeOfFather');
                                              }} 
                                              className={`icon a-icon like-icon ${item.is_favorite == 1 ? "icon-starFill" : "icon-star"} a-icon-size_medium`}>
                                          </button>
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
            {
              _success && <Alert type="success">{_success}</Alert>
            }
        </div>
        
    )
}



export default Meeting;