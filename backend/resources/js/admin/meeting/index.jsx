import React, { useRef, useEffect, useState, useContext } from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import InfiniteScroll from "react-infinite-scroll-component";

import { HeaderContext } from '../../context';
import Alert from '../../component/alert';
import PageLoader from '../../component/page_loader';

const INFINITE = 10;
const SCROLL_DELAY_TIME = 1500;

const AdminMeetings = () => {

  const { isAuthenticate } = useContext(HeaderContext);
  const [keyword, setKeyword] = useState('')
  const [loaded, setLoaded] = useState(false);
  const [meeting_list, setMeetingList ] = useState([]);
  const [fetch_meeting_list, setFetchMeetingList ] = useState([]);

  const [_400error, set400Error] = useState('');
  const [_422errors, set422errors] = useState({keyword:''});
  const [_success, setSuccess] = useState('');

  const isMountedRef = useRef(true);
  
  
  useEffect(() => {
    isMountedRef.current = false;
    
    if(isAuthenticate()){

      setLoaded(false);
      axios.get('/api/admin/meetings/list')
      .then(response => {
        if(isMountedRef.current) return;
  
        setLoaded(true);
        if(response.data.status_code==200){
          //------------Calculate Numerator & Denominator--------------
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
            setMeetingList(arr);
            var len = arr.length;
            if(len > INFINITE)
                setFetchMeetingList(arr.slice(0, INFINITE));
            else setFetchMeetingList(arr.slice(0, len));
        } 
        else {
          set400Error("失敗しました。");
        }
      });

    }

    return () => {
        isMountedRef.current = true;
    }
  }, []);



  const fetchMoreMeetingList = () => {
    setTimeout(() => {
        var x = fetch_meeting_list.length;
        var y = meeting_list.length;
        var c = 0;
        if(x+INFINITE < y) c = INFINITE;
        else c = y - x;
        setFetchMeetingList(meeting_list.slice(0, x+c));
    }, SCROLL_DELAY_TIME);
};

  
  const handleSearch = (e) => {
    e.preventDefault();

    if(isAuthenticate()){

      if(keyword == '')
      {
        document.getElementById('keyword').focus();
        return;
      }
      set422errors({keyword:''});
      setLoaded(false);
      setMeetingList([]);
      axios.get('/api/admin/meetings/search',{params:{keyword: keyword}})
      .then((response) => {
        if(isMountedRef.current) return;
  
        setLoaded(true);
        if(response.data.status_code==200){
          //------------Calculate Numerator & Denominator--------------
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
            setMeetingList(arr);
            var len = arr.length;
            if(len > INFINITE)
                setFetchMeetingList(arr.slice(0, INFINITE));
            else setFetchMeetingList(arr.slice(0, len));
        }
      });

    }
  }


	return (
  <div className="l-content">
    <div className="l-content__ttl">
        <div className="l-content__ttl__left">
            <h2>ミーティング一覧</h2>
        </div>
    </div>

    <div className="l-content-wrap">
        <section className="search-container">
            <div className="meeting-head mt-4">
                <form className="position-relative"  onSubmit={handleSearch}>
                    <label className="control-label" htmlFor="keyword">キーワード</label>
                    <input type="search" name="keyword" 
                        className="input-default input-keyword input-h60"
                        id="keyword"  value={keyword} 
                        onChange={e=> setKeyword(e.target.value)}
                    />
                    <IconButton size="large" style={{position:'absolute', bottom:'5px', right:'5px', padding:'5px'}} type="submit">
                      <SearchIcon fontSize="large" style={{color:'#d0d0d0', width:'40px', height:'40px'}}/>
                    </IconButton>
                </form>
            </div>
            <div className="search-wrap">
              <div className="search-content">
                {
                  !loaded && <PageLoader />
                }
                { 
                  loaded && 
                  <InfiniteScroll
                    dataLength={fetch_meeting_list.length}
                    next={fetchMoreMeetingList}
                    hasMore={fetch_meeting_list.length != meeting_list.length}
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
                    fetch_meeting_list.length > 0 ?
                      fetch_meeting_list.map((item, ki) => 
                        <div className="meeting-item" key={ki}>
                            <Link to = {`/admin/meeting/detail/${item.id}`} className="meeting-link">

                                <h3 className="meeting-ttl">{ item.title }</h3>
                                <p className="meeting-txt">{ item.text }</p>
                                <time dateTime="2021-07-30" className="meeting-time">
                                    <span className="meeting-date">{ moment(item.updated_at).format('YYYY/MM/DD') || '' }</span>
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
                                                item.approval?.map((x, kj)=>
                                                {
                                                  if(x.approval_at)
                                                  return(
                                                    <li className="meeting-member__item" role="listitem" key={kj}>
                                                        <div className="avatar">
                                                            <img alt="name" className="avatar-img" src={x.child.image} alt={x.child.image} />
                                                        </div>
                                                    </li>)
                                                })
                                            }
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                      )
                    : <p className="text-center py-5">データが存在していません。</p>
                  }
                  </InfiniteScroll>
                }
              </div>
            </div>
            {  _400error && <Alert type="fail" hide={()=>set400Error('')}>{_400error}</Alert> } 
            {  _success &&  <Alert type="success" hide={()=>setSuccess('')}>{_success}</Alert> }
        </section>
    </div>
  </div>
	)
}

export default AdminMeetings;