import React, { useRef, useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import InfiniteScroll from "react-infinite-scroll-component";

import { HeaderContext } from '../../context';
import Alert from '../../component/alert';
import PageLoader from '../../component/page_loader';

const INFINITE = 10;
const SCROLL_DELAY_TIME = 1500;


const AdminParents = () => {

  const { isAuthenticate } = useContext(HeaderContext);
  
  const [keyword, setKeyword] = useState('')
  const [loaded, setLoaded] = useState(false);
  const [father_list, setFatherList ] = useState([]);
  const [fetch_father_list, setFetchFatherList ] = useState([]);
  const [_422errors, set422errors] = useState({keyword:''});
  const [_400error, set400Error] = useState('');
  const [_success, setSuccess] = useState('');

  const isMountedRef = useRef(true);
    
  useEffect(() => {
    isMountedRef.current = false;

    if(isAuthenticate()){
      setLoaded(false);
  
      axios.get('/api/admin/fathers/list')
      .then((response) => {
        if(isMountedRef.current) return;
        
        setLoaded(true);
        if(response.data.status_code==200){
            setFatherList(response.data.params);
            var len = response.data.params.length;
            if(len > INFINITE)
              setFetchFatherList(response.data.params.slice(0, INFINITE));
            else setFetchFatherList(response.data.params.slice(0, len));
        } 
        else {
          set400Error("失敗しました。");
        }
      });
    }

    return () => {
      isMountedRef.current = true
    }
  }, []);

  const fetchMoreFatherList = () => {
      setTimeout(() => {
          var x = fetch_father_list.length;
          var y = father_list.length;
          var c = 0;
          if(x+INFINITE < y) c = INFINITE;
          else c = y - x;
          setFetchFatherList(father_list.slice(0, x+c));
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
      setFatherList([]);
      axios.get('/api/admin/fathers/search',{params: {keyword: keyword}})
      .then((response) => {
        if(isMountedRef.current) return;
        
        setLoaded(true);
        if(response.data.status_code==200){
          setFatherList(response.data.params);
          var len = response.data.params.length;
          if(len > INFINITE)
            setFetchFatherList(response.data.params.slice(0, INFINITE));
          else setFetchFatherList(response.data.params.slice(0, len));
        } 
      });
    }
  }

  
	return (
    <div className="l-content">
      <div className="l-content__ttl">
        <div className="l-content__ttl__left">
          <h2>親一覧</h2>
          <div className="p-meetingAdd-btn">
              <Link to = '/admin/parent/register' data-v-ade1d018="kikikanri" 
                className="btn-default btn-yellow btn-meeting btn-shadow btn-r8 btn-h48 btn-fz14">
                  <span className="ft-16">親を追加する</span>
                  <svg version="1.1" viewBox="0 0 500 500" className="icon svg-icon svg-fill svg-up">
                    <path fill="#000" stroke="none" pid="0" d="M250 437.6c-16.5 0-30-13.5-30-30V280.1H92.5c-16.5 0-30-13.5-30-30s13.5-30 30-30H220V92.6c0-16.5 13.5-30 30-30s30 13.5 30 30v127.5h127.5c16.5 0 30 13.5 30 30s-13.5 30-30 30H280v127.5c0 16.5-13.5 30-30 30z"></path>
                  </svg>
              </Link>
          </div>
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
                  dataLength={fetch_father_list.length}
                  next={fetchMoreFatherList}
                  hasMore={fetch_father_list.length != father_list.length}
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
                  fetch_father_list.length>0 ?
                    fetch_father_list.map((father, k) => 
                      <div className="search-item" key={k}>
                        <Link to = {`/admin/parent/detail/${father.id}`}>
                          <div className="user-wrap">
                            <div className="user-avatar">
                              <img alt="name" className="avatar-img" src={ father.image } />
                            </div>
                            <div className="user-info">
                              <p className="user-name mb-1 font-weight-bold">{ father.company }</p>
                              <p className="user-tel">{ father.email }</p>
                            </div>
                          </div>
                        </Link>
                      </div>
                    ) : <p className="text-center py-5">データが存在していません。</p>
                }
                </InfiniteScroll>
              }
            </div>
          </div> 
          { _400error && <Alert type="fail" hide={()=>set400Error('')}> {_400error} </Alert> } 
          { _success && <Alert type="success" hide={()=>setSuccess('')}> {_success} </Alert> }
        </section>
      </div>
    </div>
	)
}

export default AdminParents;