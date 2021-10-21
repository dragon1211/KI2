import React, { useEffect, useState } from 'react';
import { CircularProgress  } from '@material-ui/core';
import Notification from '../../component/notification';
import moment from 'moment';
import axios from 'axios';
import { useHistory } from 'react-router-dom'

const Favorite = () => {
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [flg, setFlg] = useState(true);
  const [favorites, setFavorites ] = useState(null);
  const [others, setOthers ] = useState(null);
  const fatherId = document.getElementById('father_id').value;

  useEffect(() => {
    listOfFavoriteOfFather();
  }, []);

  useEffect(() => {
    listOfNonFavoriteOfFather();
  }, []);

  function listOfFavoriteOfFather() {
    axios.get('/api/meetings/listOfFavoriteOfFather', {params: { father_id: fatherId }}).then((response) => {
      if(response.data.status_code==200){
        console.log(response.data.params);
        setFavorites(response.data.params);
      } else if(response.data.status_code==400){
        //TODO
      }
      setLoading(false);
    });
  }

  function listOfNonFavoriteOfFather() {
    axios.get('/api/meetings/listOfNonFavoriteOfFather', {params: { father_id: fatherId }}).then((response) => {
      if(response.data.status_code==200){
        console.log(response.data.params);
        setOthers(response.data.params);
      } else if(response.data.status_code==400){
        //TODO
      }
    });
  }

  async function handleFavorite(meetingId, currentFavorite, stateName) {
    const formdata = new FormData();
    formdata.append('meeting_id', meetingId);
    formdata.append('is_favorite', currentFavorite == 1 ? 0 : 1);
    axios.post('/api/meetings/registerFavorite', formdata).then((response) => {})

    if(stateName == "favorites") {
      const newList = favorites.map((item) => {
        if (item.id === meetingId) {
          const updatedItem = {
            ...item,
            is_favorite: currentFavorite == 1 ? 0 : 1,
          };

          return updatedItem;
        }
        return item;
      });
      setFavorites(newList);
    } else {
      const newList = others.map((item) => {
        if (item.id === meetingId) {
          const updatedItem = {
            ...item,
            is_favorite: currentFavorite == 1 ? 0 : 1,
          };

          return updatedItem;
        }
        return item;
      });
      setOthers(newList);
    }  
  };

	return (
    <div className="l-content">
      <div className="l-content__ttl">
        <div className="l-content__ttl__left">
          <h2>お気に入り</h2>
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
        <Notification />
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
                    listOfFavoriteOfFather();
                  }} 
                  className={`tab-label ${flg ? "is-active" : ""}`} 
                  htmlFor="tab-01"><span>お気に入り</span></label>
                <label 
                  onClick={e => {
                    e.preventDefault();
                    setFlg(false);
                    listOfNonFavoriteOfFather();
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
                              <li className="numerator">0</li>
                              <li className="denominator">{item?.approvals.length}</li>
                            </ul>
                            <ul className="meeting-member-list" role="list">
                              { item?.approvals.map((v, inx1) => {
                                return (<li className="meeting-member__item" role="listitem">
                                  <div className="avatar">
                                    <img alt="name" className="avatar-img" src={v?.child.image} />
                                  </div>
                                </li>);
                              }) }
                            </ul>
                          </div>
                        </div>
                      </div>
                      
                    </a>
                    <button 
                      type="button" aria-label="お気に入り" data-tooltip="お気に入り" aria-pressed="false" 
                      onClick={e => {
                        e.preventDefault();
                        handleFavorite(item.id, item.is_favorite, 'favorites');
                      }} 
                      className={`icon a-icon like-icon ${item.is_favorite == 1 ? "icon-starFill" : "icon-star"} a-icon-size_medium`}
                    ></button>
                  </div>  
                );
                }) : <div style={{position: "relative", left: "50%"}}><CircularProgress /></div>}
              </div>
  
              <div className={ `meeting-content-wrap ${!flg ? "is-active" : ""}` }  id="item02">
                { others?.length > 0 && others.map((item, index) => {
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
                              <li className="numerator">0</li>
                              <li className="denominator">{item?.approvals.length}</li>
                          </ul>
                          <ul className="meeting-member-list" role="list">
                            { item?.approvals.map((v, inx2) => {
                              return (<li className="meeting-member__item" role="listitem">
                                <div className="avatar">
                                  <img alt="name" className="avatar-img" src={v?.child.image} />
                                </div>
                              </li>);
                            }) }
                          </ul>
                        </div>
                      </div>
                    </div>
                    
                  </a>
                  <button type="button" aria-label="お気に入り" data-tooltip="お気に入り" aria-pressed="false" 
                    onClick={e => {
                      e.preventDefault();
                      handleFavorite(item.id, item.is_favorite, 'others');
                    }} 
                    className={`icon a-icon like-icon ${item.is_favorite == 1 ? "icon-starFill" : "icon-star"} a-icon-size_medium`}
                  ></button>
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