import React, { useEffect, useState } from 'react';
import { CircularProgress  } from '@material-ui/core';
import moment from 'moment';
import axios from 'axios';
import { useHistory } from 'react-router-dom'

const Favorite = () => {
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [flg, setFlg] = useState(true);
  const [favorites, setFavorites ] = useState(null);
  const [others, setOthers ] = useState(null);
  
  useEffect(() => {
    axios.get('/api/meetings/listOfFavoriteOfFather', {params: { father_id: 1 }}).then((response) => {
      if(response.data.status_code==200){
        console.log(response.data.params);
        setFavorites(response.data.params);
      } else if(response.data.status_code==400){
        //TODO
      }
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    axios.get('/api/meetings/listOfNonFavoriteOfFather', {params: { father_id: 1 }}).then((response) => {
      if(response.data.status_code==200){
        console.log(response.data.params);
        setOthers(response.data.params);
      } else if(response.data.status_code==400){
        //TODO
      }
    });
  }, []);

	return (
    <div className="l-content">
      <div className="l-content__ttl">
        <div className="l-content__ttl__left">
          <h2>お気に入り</h2>
        </div>
        <div className="p-notification">
          <div className="p-notification-icon">
            <div className="p-notification-icon-wrap">
              <div className="count">1</div>
              <div className="p-notification-icon-bg"></div>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22.742 19.855" className="icon svg-icon svg-fill svg-y50" ><g fill="none" stroke="#080808" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" data-name="Icon feather-alert-triangle" transform="translate(0.777 0.75)"><path d="M11.188,5.322,2.6,19.659A2.028,2.028,0,0,0,4.334,22.7H21.51a2.028,2.028,0,0,0,1.734-3.042L14.656,5.322a2.028,2.028,0,0,0-3.468,0Z" data-name="パス 3" transform="translate(-2.328 -4.346)"/><path d="M18,13.5v6.91" data-name="パス 4" transform="translate(-7.406 -8.547)"/><path d="M18,25.5h0" data-name="パス 5" transform="translate(-7.406 -11.2)"/></g></svg>
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
                    setFlg(true);
                  }} 
                  className={`tab-label ${flg ? "is-active" : ""}`} 
                  htmlFor="tab-01"><span>お気に入り</span></label>
                <label 
                  onClick={e => {
                    e.preventDefault();
                    setFlg(false);
                  }} 
                  className={`tab-label ${flg ? "" : "is-active"}`} 
                  htmlFor="tab-02"><span>その他</span></label>
              </div>
            </div>
            
            <div className="meeting-content">
              <div className={ `meeting-content-wrap ${flg ? "is-active" : ""}` }  id="item01">
                { !loading ? favorites?.map((item, index) => {
                return (
                  <div className="meeting-item">
                    <a href="" className="meeting-link">
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
                    <button type="button" aria-label="お気に入り" data-tooltip="お気に入り" aria-pressed="false" className="icon a-icon like-icon icon-starFill a-icon-size_medium"></button>
                  </div>  
                );
                }) : <div style={{position: "relative", left: "50%"}}><CircularProgress /></div>}
              </div>
  
              <div className={ `meeting-content-wrap ${!flg ? "is-active" : ""}` }  id="item02">
                { others?.length > 0 && others.map((item, index) => {
                return (
                <div className="meeting-item">
                  <a href="" className="meeting-link">
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

export default Favorite;