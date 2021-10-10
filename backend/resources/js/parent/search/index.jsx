import React, { useEffect, useState } from 'react';
import { CircularProgress  } from '@material-ui/core';
import Notification from '../../component/notification';
import moment from 'moment';
import axios from 'axios';
import { useHistory } from 'react-router-dom'

const Search = () => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [finish, setFinish] = useState(false);
  const [completeOfFather, setCompleteOfFather ] = useState(null);
  const [inCompleteOfFather, setInCompleteOfFather ] = useState(null);

  // useEffect(() => {
  //   axios.get('/api/meetings/searchOfCompleteOfFather', {params: { father_id: 1, keyword: '' }}).then((response) => {
  //     if(response.data.status_code==200){
  //       console.log(response.data.params);
  //       setCompleteOfFather(response.data.params);
  //     } else if(response.data.status_code==400){
  //       //TODO
  //     }
  //   });
  // }, []);

  // useEffect(() => {
  //   axios.get('/api/meetings/searchOfIncompleteOfFather', {params: { father_id: 1, keyword: '' }}).then((response) => {
  //     if(response.data.status_code==200){
  //       console.log(response.data.params);
  //       setInCompleteOfFather(response.data.params);
  //     } else if(response.data.status_code==400){
  //       //TODO
  //     }
  //     setLoading(false);
  //   });
  // }, []);

  async function search() {
    setLoading(true);
    finish 
      ? axios.get('/api/meetings/searchOfCompleteOfFather', {params: { father_id: 1, keyword: keyword }}).then((response) => {
          if(response.data.status_code==200){
            console.log(response.data.params);
            setCompleteOfFather(response.data.params);
          } else if(response.data.status_code==400){
            //TODO
          }
          setLoading(false);
        })
      : axios.get('/api/meetings/searchOfIncompleteOfFather', {params: { father_id: 1, keyword: keyword }}).then((response) => {
          if(response.data.status_code==200){
            console.log(response.data.params);
            setInCompleteOfFather(response.data.params);
          } else if(response.data.status_code==400){
            //TODO
          }
          setLoading(false);
      });
  };

	return (
    <div className="l-content">
      <div className="l-content__ttl">
        <div className="l-content__ttl__left">
          <h2>検索</h2>
        </div>
        <Notification/>
      </div>

      <div className="l-content-wrap">
        <section className="meeting-tab-container meeting-search">
          <div className="meeting-tab-wrap">
            <div className="meeting-head">
              <form action="" className="meeting-form">
                <label className="control-label" htmlFor="keyword">キーワード</label>
                <input type="search" name="keyword"  value={keyword} onChange={e=> setKeyword(e.target.value)} className="input-default input-keyword input-h56 input-w380" id="keyword" />
                <i className="icon icon-search" onClick={search} ></i>
              </form>

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
                  {  !loading ? inCompleteOfFather?.map((item, index) => {
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
                                { item?.meeting_image.map((v, inx) => {
                                  return (<li className="meeting-member__item" role="listitem">
                                    <div className="avatar">
                                      <img alt="name" className="avatar-img" src={v.image} />
                                    </div>
                                  </li>);
                                  }) }
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
                                { item?.meeting_image.map((v, inx2) => {
                                return (<li className="meeting-member__item" role="listitem">
                                  <div className="avatar">
                                    <img alt="name" className="avatar-img" src={v.image} />
                                  </div>
                                </li>);
                                 }) }
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
        </section>
      </div>
    </div>
	)
}

export default Search;