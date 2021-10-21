import React, { useEffect, useState } from 'react';
import { CircularProgress  } from '@material-ui/core';
import moment from 'moment';
import axios from 'axios';
import { useHistory } from 'react-router-dom'

import Notification from '../../component/notification';



const Meeting = () => {
  
  
  const history = useHistory();
  const [keyword, setKeyword] = useState('')
  const [loading, setLoading] = useState(true);
  const [finish, setFinish] = useState(false);
  const [completeOfFather, setCompleteOfFather ] = useState(null);
  const [inCompleteOfFather, setInCompleteOfFather ] = useState(null);
  useEffect(() => {
    axios.get('/api/admin/fathers/meetings/listOfCompleteOfFather', {params: { father_id: 1 }}).then((response) => {
      if(response.data.status_code==200){
        console.log(response.data.params);
      } else if(response.data.status_code==400){
        //TODO
      }
      setCompleteOfFather(response.data.params);
    });
  }, []);

  useEffect(() => {
    axios.get('/api/admin/fathers/meetings/listOfIncompleteOfFather', {params: { father_id: 1 }}).then((response) => {
      if(response.data.status_code==200){
        console.log(response.data.params);
        setInCompleteOfFather(response.data.params);
        setLoading(false);
      } else if(response.data.status_code==400){
        //TODO
      }
    });
  }, []);

	return (
    <div className="l-content">
        <div className="l-content__ttl">
          <div className="l-content__ttl__left">
            <h2>ミーティング一覧</h2>
          </div>
        </div>

        <div className="l-content-wrap">
          <div className="meeting-tab-container">
            <div className="meeting-tab-wrap">
              <div className="meeting-head">
                  <form action="" className="meeting-form">
                      <label className="control-label" htmlFor="keyword">キーワード</label>
                      <input type="search" name="keyword" className="input-default input-keyword input-w380" id="keyword"  value={keyword} onChange={e=> setKeyword(e.target.value)}/>
                      <i className="icon icon-search"></i>
                  </form>
              </div>
              
              <div className="meeting-content">
                <div className={ `meeting-content-wrap ${!finish ? "is-active" : ""}` }  id="item01">
                  { !loading ? inCompleteOfFather?.map((item, index) => {
                  return (
                    <div className="meeting-item" key={index}>
                      <a 
                        className="meeting-link"
                        onClick={e => {
                          e.preventDefault();
                          history.push({
                            pathname: `/admin/meeting/detail/${item.id}`,
                            state: {}
                          });
                        }} >
                        <h3 className="meeting-ttl">{ item.title }</h3>
                        <p className="meeting-txt">{ item.text }</p>
                        <time dateTime="2021-07-30" className="meeting-time">
                          <span className="meeting-date">{ moment(item.updated_at).format('YYYY/MM/DD') || '' }</span>
                        </time>
                        <div className="meeting-member">
                          <div className="meeting-member-wrap">
                            <div data-url="login.html" className="meeting-member-link">
                              <ul className="meeting-member-count">
                                <li className="numerator">3</li>
                                <li className="denominator">4</li>
                              </ul>
      
                              <ul className="meeting-member-list" role="list">
                                <li className="meeting-member__item" role="listitem">
                                  <div className="avatar">
                                    <img alt="name" className="avatar-img" src="../assets/img/avatar/avatar-sample01@2x.png" />
                                  </div>
                                </li>
                                <li className="meeting-member__item" role="listitem">
                                  <div className="avatar">
                                    <img alt="name" className="avatar-img" src="../assets/img/avatar/avatar-sample02@2x.png" />
                                  </div>
                                </li>
                                <li className="meeting-member__item" role="listitem">
                                  <div className="avatar">
                                    <img alt="name" className="avatar-img" src="../assets/img/avatar/avatar-sample03@2x.png" />
                                  </div>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </a>
                    </div>
                  );
                  })  : <div style={{position: "relative", left: "calc( 50% - 20px)", top:'30px'}}><CircularProgress /></div>}
                </div>

              </div>
            </div>
          </div>
        </div>
    </div>
	)
}

export default Meeting;