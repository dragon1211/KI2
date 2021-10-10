import React, { useEffect, useState } from 'react';
import { CircularProgress  } from '@material-ui/core';
import moment from 'moment';
import axios from 'axios';
import { useHistory } from 'react-router-dom'

const Meeting = () => {
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [finish, setFinish] = useState(false);
  const [completeOfFather, setCompleteOfFather ] = useState(null);
  const [inCompleteOfFather, setInCompleteOfFather ] = useState(null);
  useEffect(() => {
    axios.get('/api/meetings/listOfCompleteOfFather', {params: { father_id: 1 }}).then((response) => {
      if(response.data.status_code==200){
        console.log(response.data.params);
      } else if(response.data.status_code==400){
        //TODO
      }
      setCompleteOfFather(response.data.params);
    });
  }, []);

  useEffect(() => {
    axios.get('/api/meetings/listOfIncompleteOfFather', {params: { father_id: 1 }}).then((response) => {
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
            <div className="p-meetingAdd-btn">
              <a 
                onClick={e => {
                  e.preventDefault();
                  history.push({
                    pathname: '/p-account/meeting/new',
                    state: {}
                  });
                }} 
                data-v-ade1d018="" 
                className="btn-default btn-yellow btn-meeting btn-shadow btn-r8 btn-h48 btn-fz14">
                  <span>ミーティングを追加</span>
                  <svg version="1.1" viewBox="0 0 500 500" className="icon svg-icon svg-fill svg-up">
                    <path fill="#000" stroke="none" pid="0" d="M250 437.6c-16.5 0-30-13.5-30-30V280.1H92.5c-16.5 0-30-13.5-30-30s13.5-30 30-30H220V92.6c0-16.5 13.5-30 30-30s30 13.5 30 30v127.5h127.5c16.5 0 30 13.5 30 30s-13.5 30-30 30H280v127.5c0 16.5-13.5 30-30 30z"></path>
                  </svg>
              </a>
            </div>
          </div>
          <div className="p-notification">
            <div className="p-notification-icon">
              <div className="p-notification-icon-wrap">
                <div className="count">1</div>
                <div className="p-notification-icon-bg"></div>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22.742 19.855" className="icon svg-icon svg-fill svg-y50" >
                  <g fill="none" stroke="#080808" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" data-name="Icon feather-alert-triangle" transform="translate(0.777 0.75)"><path d="M11.188,5.322,2.6,19.659A2.028,2.028,0,0,0,4.334,22.7H21.51a2.028,2.028,0,0,0,1.734-3.042L14.656,5.322a2.028,2.028,0,0,0-3.468,0Z" data-name="パス 3" transform="translate(-2.328 -4.346)"/><path d="M18,13.5v6.91" data-name="パス 4" transform="translate(-7.406 -8.547)"/><path d="M18,25.5h0" data-name="パス 5" transform="translate(-7.406 -11.2)"/></g>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="l-content-wrap">
          <div className="meeting-tab-container">
            <div className="meeting-tab-wrap">
              <div className="meeting-head">
                <input className="tab-switch" id="tab-01" type="radio" name="tab_btn" />
                <input className="tab-switch" id="tab-02" type="radio" name="tab_btn" />
    
                <div className="meeting-tab">
                  <label 
                    onClick={e => {
                      e.preventDefault();
                      setFinish(false);
                    }} 
                    className={`tab-label ${finish ? "" : "is-active"}`} 
                    htmlFor="tab-01">
                      <span>未完了</span>
                  </label>
                  <label 
                    onClick={e => {
                      e.preventDefault();
                      setFinish(true);
                    }} 
                    className={`tab-label ${finish ? "is-active" : ""}`}  
                    htmlFor="tab-02">
                      <span>完了済み</span>
                  </label>
                </div>
              </div>
              
              <div className="meeting-content">
                <div className={ `meeting-content-wrap ${!finish ? "is-active" : ""}` }  id="item01">
                  { !loading ? inCompleteOfFather?.map((item, index) => {
                  return (
                    <div className="meeting-item">
                      <a 
                        className="meeting-link"
                        onClick={e => {
                          e.preventDefault();
                          history.push({
                            pathname: `/p-account/meeting/detail/${item.id}`,
                            state: {}
                          });
                        }} >
                        <h3 className="meeting-ttl">{ item.title }</h3>
                        <p className="meeting-txt">{ item.text }</p>
                        <time dateTime="2021-07-30" className="meeting-time">
                          <span className="meeting-date">{ moment(item.updated_at).format('YYYY/MM/DD HH:mm') || '' }</span>
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
                      <button type="button" aria-label="お気に入り" data-tooltip="お気に入り" aria-pressed="false" className="icon a-icon like-icon icon-star a-icon-size_medium"></button>
                    </div>
                  );
                  })  : <CircularProgress /> }
                </div>

                <div className={`meeting-content-wrap ${finish ? "is-active" : ""}`} id="item02">
                { completeOfFather?.length > 0 && completeOfFather.map((item, index2) => {
                  return (
                    <div className="meeting-item">
                      <a 
                        className="meeting-link"
                        onClick={e => {
                          e.preventDefault();
                          history.push({
                            pathname: `/p-account/meeting/detail/${item.id}`,
                            state: {}
                          });
                        }} >
                        <h3 className="meeting-ttl">{ item.title }</h3>
                        <p className="meeting-txt">{ item.text }</p>
                        <time dateTime="2021-07-30" className="meeting-time">
                          <span className="meeting-date">{ moment(item.updated_at).format('YYYY/MM/DD HH:mm') || '' }</span>
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
                      <button type="button" aria-label="お気に入り" data-tooltip="お気に入り" aria-pressed="false" className="icon a-icon like-icon icon-star a-icon-size_medium"></button>
                    </div>
                  );
                  }) }
                </div>

              </div>
            </div>
          </div>
        </div>
    </div>
	)
}

export default Meeting;