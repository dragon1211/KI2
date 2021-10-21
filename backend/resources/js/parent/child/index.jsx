import React, { useEffect, useState } from 'react';
import { CircularProgress  } from '@material-ui/core';
import Notification from '../../component/notification';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { useHistory } from 'react-router-dom'

const Child = () => {
  const [children, setChildren ] = useState(null);
  const [loading, setLoading] = useState(true);
  const history = useHistory();
  const fatherId = document.getElementById('father_id').value;
  const state = history.location.state

  useEffect(() => {
    axios.get('/api/children/listOfFather', {params: { father_id: fatherId }}).then((response) => {
      if(response.data.status_code==200){
        console.log(response.data.params);
        setChildren(response.data.params);
      } else if(response.data.status_code==400){
        //TODO
      }
      setLoading(false);
      if(state?.message) {
        toast.success(state?.message, {
          position: "top-center",
          autoClose: 5000,
          className:"bg-success",
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: false,
          progress: undefined,
          style:{ color: '#ffffff', opacity: 0.95}
        });
      }
    });
  }, []);

	return (
    <div className="l-content">
      <ToastContainer />
      <div className="l-content__ttl">
        <div className="l-content__ttl__left">
          <h2>子一覧</h2>
          <div className="p-meetingAdd-btn">
              <a
                onClick={e => {
                  e.preventDefault();
                  history.push({
                    pathname: '/p-account/child/add',
                    state: {}
                  });
                }} 
                data-v-ade1d018="" 
                className="btn-default btn-yellow btn-meeting btn-shadow btn-r8 btn-h48 btn-fz14">
                  <span>子を追加</span>
                  <svg version="1.1" viewBox="0 0 500 500" className="icon svg-icon svg-fill svg-up">
                    <path fill="#000" stroke="none" pid="0" d="M250 437.6c-16.5 0-30-13.5-30-30V280.1H92.5c-16.5 0-30-13.5-30-30s13.5-30 30-30H220V92.6c0-16.5 13.5-30 30-30s30 13.5 30 30v127.5h127.5c16.5 0 30 13.5 30 30s-13.5 30-30 30H280v127.5c0 16.5-13.5 30-30 30z"></path>
                  </svg>
              </a>
            </div>
        </div>
        <Notification />
      </div>
      <div className="l-content-wrap">
        <section className="search-container">
          <div className="search-wrap">
            <div className="search-content">
              { !loading ? children?.map((child, index) => {
                return (
                  <div className="search-item">
                    <a onClick={e => {
                        e.preventDefault();
                        history.push({
                          pathname: `/p-account/child/detail/${child.id}`,
                          state: { child_id : child.id }
                        });
                      }} >
                      <div className="user-wrap">
                        <div className="user-avatar">
                          <img alt="name" className="avatar-img" src={ child.image } />
                        </div>
                        <div className="user-info">
                          <p className="user-name">{ child.last_name }  { child.first_name }</p>
                          <p className="user-tel">{ child.company }</p>
                        </div>
                      </div>
                    </a>
                  </div>
                );
              }) : <div style={{position: "relative", left: "50%"}}><CircularProgress /></div>}
            </div>
          </div>
        </section>
      </div>
    </div>
	)
}

export default Child;