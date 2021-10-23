import React, { useEffect, useState } from 'react';
import { CircularProgress  } from '@material-ui/core';
import moment from 'moment';
import axios from 'axios';
import { useHistory, Link } from 'react-router-dom';

import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import { areIntervalsOverlapping } from 'date-fns';

import Alert from '../../component/alert';


const Meeting = () => {
  
  const history = useHistory();
  const [keyword, setKeyword] = useState('')
  const [loaded, setLoaded] = useState(false);
  const [finish, setFinish] = useState(false);
  const [meeting_list, setMeetingList ] = useState(null);
  const [_422errors, set422errors] = useState({keyword:''});
  const [_400error, set400error] = useState('');

  useEffect(() => {
    setLoaded(false);
    axios.get('/api/admin/meetings/list').then((response) => {

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
          //------------------------------------------------------------

          setMeetingList(arr);

      } else if(response.data.status_code==400){
        //TODO
      }
    });
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
    setMeetingList(null);

    const formdata = new FormData();
    formdata.append('keyword', keyword);

    axios.post('/api/admin/meetings/search',formdata)
    .then((response) => {

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
          //------------------------------------------------------------

          setMeetingList(arr);

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
            <h2>ミーティング一覧</h2>
        </div>
    </div>

    <div className="l-content-wrap">
        <div className="search-container">
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
                    meeting_list && meeting_list.length > 0 ?
                      meeting_list.map((item, ki) => 
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
                                                <li className="meeting-member__item" role="listitem" key={kj}>
                                                    <div className="avatar">
                                                        <img alt="name" className="avatar-img" src={x.child.image} alt={x.child.image} />
                                                    </div>
                                                </li>
                                                )
                                            }
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                      )
                    : <p className="text-center py-5">データが存在していません。</p>
                  )
                }
              </div>
            </div>
            {
              _400error && <Alert type="fail">{_400error}</Alert>
            }
        </div>
    </div>
  </div>
	)
}

export default Meeting;