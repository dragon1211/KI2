import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';

import Notification from '../../component/notification';
import Alert from '../../component/alert';
import PageLoader from '../../component/page_loader';
import InfiniteScroll from "react-infinite-scroll-component";

const INFINITE = 10;
const SCROLL_DELAY_TIME = 1500;

const ParentSearch = () => {

    const father_id = localStorage.getItem('father_id');
    const [notice, setNotice] = useState(-1);

    const [keyword, setKeyword] = useState('');
    const [tab_status, setTabStatus] = useState(false);
  
    const [meeting_list_incomplete, setMeetingListOfIncomplete] = useState([]);
    const [meeting_list_complete, setMeetingListOfComplete] = useState([]);
    const [fetch_meeting_list_incomplete, setFetchMeetingListOfIncomplete] = useState([]);
    const [fetch_meeting_list_complete, setFetchMeetingListOfComplete] = useState([]);
    
    const [_success, setSuccess] = useState('');
    const [_400error, set400Error] = useState('');
    const [loaded1, setLoaded1] = useState(true);
    const [loaded2, setLoaded2] = useState(true);
    const [loaded, setLoaded] = useState(true);
    const [initPage, setInitPage] = useState(true);


    const isMountedRef = useRef(true);
    useEffect(() => {
        isMountedRef.current = false;
        return () => {
            isMountedRef.current = true;
        }
    }, [])


    useEffect(()=>{
        setLoaded(loaded1 && loaded2);
    },[loaded1, loaded2])


    const handleSearch = (e) => {
      e.preventDefault();
        if(keyword == ''){
            document.getElementById('keyword').focus();
            return;
        }
        setLoaded1(false);
        setLoaded2(false);
        setInitPage(false);
        
        axios.get('/api/fathers/meetings/searchOfIncompleteOfFather', {params:{father_id: father_id, keyword: keyword,}})
        .then(response => {
            if(isMountedRef.current) return;

            setLoaded1(true);
            setNotice(response.data.notice);
            if(response.data.status_code==200){
                var list = response.data.params;
                var arr = [];
                for(var i in list){
                    var total=0, num=0;
                    for(var j in list[i].approvals)
                    {
                      if(list[i].approvals[j].approval_at) num ++;
                      total ++;
                    }
                    arr.push({...list[i], denominator:total, numerator:num})
                }
                setMeetingListOfIncomplete(arr);
                var len = arr.length;
                if(len > INFINITE)
                    setFetchMeetingListOfIncomplete(arr.slice(0, INFINITE));
                else setFetchMeetingListOfIncomplete(arr.slice(0, len));
            }
        })
          
        axios.get('/api/fathers/meetings/searchOfCompleteOfFather', {params:{father_id: father_id, keyword: keyword,}})
        .then(response => {
          if(isMountedRef.current) return;

          setLoaded2(true);
          setNotice(response.data.notice);
          if(response.data.status_code==200){
              var list = response.data.params;
              var arr = [];
              for(var i in list){
                  var total=0, num=0;
                  for(var j in list[i].approvals)
                  {
                    if(list[i].approvals[j].approval_at) num ++;
                    total ++;
                  }
                  arr.push({...list[i], denominator:total, numerator:num})
              }
              setMeetingListOfComplete(arr);
              var len = arr.length;
              if(len > INFINITE)
                  setFetchMeetingListOfComplete(arr.slice(0, INFINITE));
              else setFetchMeetingListOfComplete(arr.slice(0, len));
            }
        })
    }


    const fetchMoreListNonApproval = () => {
        setTimeout(() => {
            var x = fetch_meeting_list_incomplete.length;
            var y = meeting_list_incomplete.length;
            var c = 0;
            if(x+INFINITE < y) c = INFINITE;
            else c = y - x;
            setFetchMeetingListOfIncomplete(meeting_list_incomplete.slice(0, x+c));
        }, SCROLL_DELAY_TIME);
    };

    const fetchMoreListApproval = () => {
        setTimeout(() => {
            var x = fetch_meeting_list_complete.length;
            var y = meeting_list_complete.length;
            var c = 0;
            if(x+INFINITE < y) c = INFINITE;
            else c = y - x;
            setFetchMeetingListOfComplete(meeting_list_complete.slice(0, x+c));
        }, SCROLL_DELAY_TIME);
    };

    function handleFavorite(meetingId, currentFavorite, stateName) {
      const formdata = new FormData();
      formdata.append('meeting_id', meetingId);
      formdata.append('is_favorite', currentFavorite == 1 ? 0 : 1);
      axios.post('/api/fathers/meetings/registerFavorite', formdata)

      if(stateName == "inCompleteOfFather") {
        const newList = meeting_list_incomplete.map((item) => {
          if (item.id === meetingId) {
            const updatedItem = {
              ...item,
              is_favorite: item.is_favorite == 1 ? 0 : 1,
            };
            return updatedItem;
          }
          return item;
        });
        setMeetingListOfIncomplete(newList);
        setFetchMeetingListOfIncomplete(newList.slice(0, fetch_meeting_list_incomplete.length));
      } else {
        const newList = meeting_list_complete.map((item) => {
          if (item.id === meetingId) {
            const updatedItem = {
              ...item,
              is_favorite: item.is_favorite == 1 ? 0 : 1,
            };
            return updatedItem;
          }
          return item;
        });
        setMeetingListOfComplete(newList);
        setFetchMeetingListOfComplete(newList.slice(0, fetch_meeting_list_complete.length));
      }  
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
                                <input type="search" name="keyword" className="input-default input-keyword" id="keyword"  value={keyword} onChange={e=> setKeyword(e.target.value)}/>
                                <IconButton size="large" style={{position:'absolute', bottom:'3px', right:'5px', padding:'5px'}} type="submit">
                                    <SearchIcon fontSize="large" style={{color:'#d0d0d0', width:'40px', height:'40px'}}/>
                                </IconButton>
                            </form>
                            
                            <input className="tab-switch" id="tab-01" type="radio" name="tab_btn"/>
                            <input className="tab-switch" id="tab-02" type="radio" name="tab_btn"/>
                
                            <div className="meeting-tab">
                                <label className={`tab-label ${!tab_status && 'is-active'} `} htmlFor="tab-01" onClick={()=>setTabStatus(false)}><span>未完了</span></label>
                                <label className={`tab-label ${tab_status && 'is-active'} `} htmlFor="tab-02"  onClick={()=>setTabStatus(true)}><span>完了済み</span></label>
                            </div>
                        </div>
                    </div>
                    {
                        !loaded && <PageLoader/>
                    }
                    {
                        loaded && !initPage &&
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
                                      <div className="meeting-item parent" key={id}>
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
                                                             {
                                                               if(v.approval_at)
                                                               return(
                                                               <li className="meeting-member__item" role="listitem" key={inx1}>
                                                                 <div className="avatar">
                                                                   <img alt="name" className="avatar-img" src={v?.child.image} />
                                                                 </div>
                                                               </li>)
                                                             })
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
                                      <div className="meeting-item parent" key={id}>
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
                                                        item.approvals?.map((v, inx1) =>
                                                        {
                                                          if(v.approval_at)
                                                          return(
                                                          <li className="meeting-member__item" role="listitem" key={inx1}>
                                                            <div className="avatar">
                                                              <img alt="name" className="avatar-img" src={v?.child.image} />
                                                            </div>
                                                          </li>)
                                                        })
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
            { _400error && <Alert type="fail" hide={()=>set400Error('')}>{_400error}</Alert> } 
            { _success && <Alert type="success" hide={()=>setSuccess('') }>{_success}</Alert> }
        </div>
        
    )
}



export default ParentSearch;