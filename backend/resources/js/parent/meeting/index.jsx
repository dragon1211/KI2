import React, { useRef, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import moment from 'moment';

import Notification from '../../component/notification';
import Alert from '../../component/alert';
import PageLoader from '../../component/page_loader';
import InfiniteScroll from "react-infinite-scroll-component";


const INFINITE = 10;
const SCROLL_DELAY_TIME = 1500;

const ParentMeetings = () => {

    const location = useLocation();

    const [notice, setNotice] = useState(localStorage.getItem('notice'));
    const father_id = localStorage.getItem('kiki_acc_id');
    
    const [tab_status, setTabStatus] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [loaded1, setLoaded1] = useState(false);
    const [loaded2, setLoaded2] = useState(false);
    const [meeting_list_incomplete, setMeetingListOfIncomplete] = useState([]);
    const [meeting_list_complete, setMeetingListOfComplete] = useState([]);
    const [fetch_meeting_list_incomplete, setFetchMeetingListOfIncomplete] = useState([]);
    const [fetch_meeting_list_complete, setFetchMeetingListOfComplete] = useState([]);
    const [_success, setSuccess] = useState(location.state);
    const [_400error, set400Error] = useState('');

    const isMountedRef = useRef(true);


    useEffect(()=>{
      if(localStorage.getItem('kiki_login_flag')){
        setSuccess("ログインに成功しました!");
        localStorage.removeItem('kiki_login_flag');
      }
      var navbar_list = document.getElementsByClassName("mypage-nav-list__item");
      for(let i=0; i<navbar_list.length; i++)
          navbar_list[i].classList.remove('nav-active');
      document.getElementsByClassName("-meeting")[0].classList.add('nav-active');
    },[]);

    useEffect(()=>{
        setLoaded(loaded1 && loaded2);
    },[loaded1, loaded2])


    useEffect( async () => {
        isMountedRef.current = false;
        setLoaded(false);

        await axios.get('/api/fathers/meetings/listOfIncompleteOfFather', {params:{father_id: father_id}})
          .then(response => {
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
          .catch(err=>console.log(err));

        await axios.get('/api/fathers/meetings/listOfCompleteOfFather', {params:{father_id: father_id}})
          .then(response => {
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
          .catch(err=>console.log(err));
    },[]);

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

    const handleFavorite = async (meetingId, currentFavorite, stateName) => {
      const formdata = new FormData();
      formdata.append('meeting_id', meetingId);
      formdata.append('is_favorite', currentFavorite == 1 ? 0 : 1);
      await axios.post('/api/fathers/meetings/registerFavorite', formdata)
        .then(response=>{ setNotice(response.data.notice)});
      
      if(stateName == "inCompleteOfFather") {
        const newList1 = meeting_list_incomplete.map((item) => {
          if (item.id === meetingId) {
            const updatedItem = {
              ...item,
              is_favorite: item.is_favorite == 1 ? 0 : 1,
            };
            return updatedItem;
          }
          return item;
        });
        setMeetingListOfIncomplete(newList1);
        setFetchMeetingListOfIncomplete(newList1.slice(0, fetch_meeting_list_incomplete.length));
      } else {
        const newList2 = meeting_list_complete.map((item) => {
          if (item.id === meetingId) {
            const updatedItem = {
              ...item,
              is_favorite: item.is_favorite == 1 ? 0 : 1,
            };
            return updatedItem;
          }
          return item;
        });
        setMeetingListOfComplete(newList2);
        setFetchMeetingListOfComplete(newList2.slice(0, fetch_meeting_list_complete.length));
      }  
    };
  

    
	return (
        <div className="l-content">
            <div className="l-content__ttl">
                <div className="l-content__ttl__left">
                    <h2>ミーティング一覧</h2>
                    <div className="p-meetingAdd-btn">
                        <Link to = '/p-account/meeting/new' data-v-ade1d018="kikikanri" 
                          className="btn-default btn-yellow btn-meeting btn-shadow btn-r8 btn-h48 btn-fz14">
                            <span className="ft-16">ミーティングを追加</span>
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
                        !loaded && <PageLoader/>
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
                                              onClick={e => handleFavorite(item.id, item.is_favorite, 'inCompleteOfFather')} 
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
                                              onClick={e => handleFavorite(item.id, item.is_favorite, 'completeOfFather')} 
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
            { _400error && <Alert type="fail"  hide={()=>set400Error('')}>{_400error}</Alert> }
            { _success && <Alert type="success"  hide={()=>setSuccess('')}>{_success}</Alert> }
        </div>
        
    )
}



export default ParentMeetings;