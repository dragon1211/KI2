import React, { useEffect, useState } from 'react';
import { CircularProgress  } from '@material-ui/core';
import moment from 'moment';
import axios from 'axios';
import { useHistory, Link } from 'react-router-dom';

import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import { areIntervalsOverlapping } from 'date-fns';

import Alert from '../../component/alert';


const Child = () => {

  const history = useHistory();
  const [keyword, setKeyword] = useState('')
  const [loaded, setLoaded] = useState(false);
  const [finish, setFinish] = useState(false);
  const [children_list, setChildrenList ] = useState(null);
  const [_422errors, set422errors] = useState({keyword:''});
  const [_400error, set400error] = useState('');

  useEffect(() => {
    setLoaded(false);
    axios.get('/api/admin/children/list')
    .then((response) => {
      if(response.data.status_code==200){
        console.log(response.data.params);
        setChildrenList(response.data.params);
      } else if(response.data.status_code==400){
        //TODO
      }
      setLoaded(true);
    });
    ////////////////////////////////////
  }, []);


  const handleSearch = (e) => {
    e.preventDefault();
    initErrors();
    if(keyword == '')
    {
      document.getElementById('keyword').focus();
      return;
    }

    setLoaded(false);
    setChildrenList(null);

    const formdata = new FormData();
    formdata.append('keyword', keyword);

    axios.post('/api/admin/children/search',formdata)
    .then((response) => {

      setLoaded(true);
      if(response.data.status_code==200){
        setChildrenList(response.data.params);
      } else if(response.data.status_code==400){
        //TODO
      }
    });
  }

  const initErrors = () => {
    set422errors({keyword:''});
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

          <div className="meeting-head mt-4"  onSubmit={handleSearch}>
              <form className="position-relative">
                  <label className="control-label" htmlFor="keyword">キーワード</label>
                  <input type="search" name="keyword" 
                      className="input-default input-keyword input-w380 input-h60"
                      id="keyword"  value={keyword} 
                      onChange={e=> setKeyword(e.target.value)}
                  />
                  <IconButton size="large" style={{position:'absolute', bottom:'3px', right:'5px'}} type="submit">
                    <SearchIcon fontSize="large" style={{color:'#d0d0d0'}}/>
                  </IconButton>
              </form>
          </div>

          <div className="search-wrap">
            <div className="search-content position-relative" style={{minHeight:'100px'}}>
              {
                !loaded &&
                      <CircularProgress color="secondary" style={{top:'20px', left:'calc(50% - 22px)', color:'green', position:'absolute'}}/>
              }
              { 
                loaded && 
                (
                  children_list && children_list.length>0 ?
                    children_list.map((child, k) => 
                      <div className="search-item" key={k}>
                        <Link to = {`/admin/child/detail/${child.id}`}>
                          <div className="user-wrap">
                            <div className="user-avatar">
                              <img alt="name" className="avatar-img" src={ child.image } />
                            </div>
                            <div className="user-info">
                              <p className="user-name mb-1 font-weight-bold">{ child.last_name }  { child.first_name }</p>
                              <p className="user-tel">{ child.tel }</p>
                            </div>
                          </div>
                        </Link>
                      </div>
                    ) : <p className="text-center py-5">データが存在していません。</p>
                )
              }

            </div>
          </div>
        </section>
      </div>
    </div>
	)
}

export default Child;