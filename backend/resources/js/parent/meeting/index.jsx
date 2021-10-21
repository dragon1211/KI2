import React, { useEffect, useState } from 'react';
import { CircularProgress  } from '@material-ui/core';
import Notification from '../../component/notification';
import moment from 'moment';
import axios from 'axios';
import { useHistory } from 'react-router-dom'

const Meeting = () => {
  const history = useHistory();
  const fatherId = document.getElementById('father_id').value;
  const [loading, setLoading] = useState(true);
  const [finish, setFinish] = useState(false);
  const [completeOfFather, setCompleteOfFather ] = useState(null);
  const [inCompleteOfFather, setInCompleteOfFather ] = useState(null);
  useEffect(() => {
    axios.get('/api/meetings/listOfCompleteOfFather', {params: { father_id: fatherId }}).then((response) => {
      if(response.data.status_code==200){
        console.log(response.data.params);
        setCompleteOfFather(response.data.params);
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

  async function handleFavorite(meetingId, currentFavorite, stateName) {
    const formdata = new FormData();
    formdata.append('meeting_id', meetingId);
    formdata.append('is_favorite', currentFavorite == 1 ? 0 : 1);
    axios.post('/api/meetings/registerFavorite', formdata).then((response) => {})

    if(stateName == "inCompleteOfFather") {
      const newList = inCompleteOfFather.map((item) => {
        if (item.id === meetingId) {
          const updatedItem = {
            ...item,
            is_favorite: currentFavorite == 1 ? 0 : 1,
          };
  
          return updatedItem;
        }
        return item;
      });
      setInCompleteOfFather(newList);
    } else {
      const newList = completeOfFather.map((item) => {
        if (item.id === meetingId) {
          const updatedItem = {
            ...item,
            is_favorite: currentFavorite == 1 ? 0 : 1,
          };
  
          return updatedItem;
        }
        return item;
      });
      setCompleteOfFather(newList);
    }  
  };

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
                  { !loading ? inCompleteOfFather?.map((item, index1) => {
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
                                <li className="numerator">{item?.approvals.length}</li>
                                <li className="denominator">{item?.total}</li>
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
                      <button type="button" aria-label="お気に入り" data-tooltip="お気に入り" aria-pressed="false" 
                        onClick={e => {
                          e.preventDefault();
                          handleFavorite(item.id, item.is_favorite, 'inCompleteOfFather');
                        }} 
                        className={`icon a-icon like-icon ${item.is_favorite == 1 ? "icon-starFill" : "icon-star"} a-icon-size_medium`}></button>
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
                                <li className="numerator">{item?.approvals.length}</li>
                                <li className="denominator">{item?.total}</li>
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
                          handleFavorite(item.id, item.is_favorite, 'completeOfFather');
                        }} 
                        className={`icon a-icon like-icon ${item.is_favorite == 1 ? "icon-starFill" : "icon-star"} a-icon-size_medium`}></button>
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