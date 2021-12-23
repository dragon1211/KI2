import React, { useRef, useEffect, useState } from 'react';
import axios from 'axios';
import { useHistory, Link } from 'react-router-dom';

import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import InfiniteScroll from "react-infinite-scroll-component";
import Alert from '../../component/alert';
import PageLoader from '../../component/page_loader';

const INFINITE = 10;
const SCROLL_DELAY_TIME = 1500;

const Child = (props) => {

  const [keyword, setKeyword] = useState('')
  const [loaded, setLoaded] = useState(false);
  const [children_list, setChildrenList ] = useState([]);
  const [fetch_children_list, setFetchChildrenList] = useState([]);

  const [_422errors, set422errors] = useState({keyword:''});
  const [_400error, set400Error] = useState('');
  const [_success, setSuccess] = useState(props.history.location.state);

  const isMountedRef = useRef(true);
  
  useEffect(() => {
    isMountedRef.current = false;
    setLoaded(false);
    axios.get('/api/admin/children/list')
    .then((response) => {
      setLoaded(true);
      if(response.data.status_code==200){
        setChildrenList(response.data.params);
        var len = response.data.params.length;
        if(len > INFINITE)
            setFetchChildrenList(response.data.params.slice(0, INFINITE));
        else setFetchChildrenList(response.data.params.slice(0, len));
      }
      else {
        set400Error("失敗しました。");
      }
    });
  }, []);

  const fetchMoreChildrenList = () => {
      setTimeout(() => {
          var x = fetch_children_list.length;
          var y = children_list.length;
          var c = 0;
          if(x+INFINITE < y) c = INFINITE;
          else c = y - x;
          setFetchChildrenList(children_list.slice(0, x+c));
      }, SCROLL_DELAY_TIME);
  };


  const handleSearch = (e) => {
    e.preventDefault();
    if(keyword == '')
    {
      document.getElementById('keyword').focus();
      return;
    }
    setLoaded(false);
    set422errors({keyword:''});
    setChildrenList([]);
    axios.get('/api/admin/children/search', {params:{keyword: keyword}})
    .then((response) => {
      setLoaded(true);
      if(response.data.status_code==200){
        setChildrenList(response.data.params);
        var len = response.data.params.length;
        if(len > INFINITE)
            setFetchChildrenList(response.data.params.slice(0, INFINITE));
        else setFetchChildrenList(response.data.params.slice(0, len));
      }
    });
  }


	return (
    <div className="l-content">
      <div className="l-content__ttl">
        <div className="l-content__ttl__left">
          <h2>子一覧</h2>
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
                  dataLength={fetch_children_list.length}
                  next={fetchMoreChildrenList}
                  hasMore={fetch_children_list.length != children_list.length}
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
                    fetch_children_list.length>0 ?
                      fetch_children_list.map((child, k) => 
                        <div className="search-item" key={k}>
                          <Link to = {`/admin/child/detail/${child.id}`}>
                            <div className="user-wrap">
                              <div className="user-avatar">
                                <img alt="name" className="avatar-img" src={ child.image } />
                              </div>
                              <div className="user-info">
                                <p className="user-name mb-1 font-weight-bold">{`${child.last_name} ${child.first_name}`}</p>
                                <p className="user-tel">{ child.tel }</p>
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

export default Child;