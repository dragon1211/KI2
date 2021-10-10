import React, { useEffect, useState } from 'react';
import { CircularProgress  } from '@material-ui/core';
import Notification from '../../component/notification';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { useHistory } from 'react-router-dom';



const Parent = () => {
  const [parent, setParent ] = useState(null);
  const [loading, setLoading] = useState(true);
  const history = useHistory();
  const state = history.location.state

  useEffect(() => {
    // axios.get('/api/children/listOfFather', {params: { father_id: 1 }}).then((response) => {
    //   if(response.data.status_code==200){
    //     console.log(response.data.params);
    //     setParent(response.data.params);
    //   } else if(response.data.status_code==400){
    //     //TODO
    //   }
    //   setLoading(false);
    //   if(state?.message) {
    //     toast.success(state?.message, {
    //       position: "top-center",
    //       autoClose: 5000,
    //       className:"bg-success",
    //       hideProgressBar: true,
    //       closeOnClick: true,
    //       pauseOnHover: true,
    //       draggable: false,
    //       progress: undefined,
    //       style:{ color: '#ffffff', opacity: 0.95}
    //     });
    //   }
    // });

    /////////////////////////////////////
    var obj = [
      {id:1, last_name:'山口', first_name:'太一', image:'/assets/img/avatar/avatar-sample03@2x.png', email:'mailaddress@info.com'},
      {id:2, last_name:'山口', first_name:'太一', image:'/assets/img/avatar/avatar-sample03@2x.png', email:'mailaddress@info.com'},
      {id:3, last_name:'山口', first_name:'太一', image:'/assets/img/avatar/avatar-sample03@2x.png', email:'mailaddress@info.com'},
      {id:4, last_name:'山口', first_name:'太一', image:'/assets/img/avatar/avatar-sample03@2x.png', email:'mailaddress@info.com'},
      {id:5, last_name:'山口', first_name:'太一', image:'/assets/img/avatar/avatar-sample03@2x.png', email:'mailaddress@info.com'}
    ];
    setLoading(false);
    setParent(obj);
    ////////////////////////////////////
  }, []);

	return (
    <div className="l-content">
      <ToastContainer />
      <div className="l-content__ttl">
        <div className="l-content__ttl__left">
          <h2>親一覧</h2>
        </div>
        <Notification />
      </div>
      <div className="l-content-wrap">
        <section className="search-container">

          <div className="meeting-head">
              <form action="" className="meeting-form">
                  <label className="control-label" htmlFor="keyword">キーワード</label>
                  <input type="search" name="keyword" className="input-default input-keyword input-w380" id="keyword" />
                  <i className="icon icon-search"></i>
              </form>
          </div>

          <div className="search-wrap">
            <div className="search-content">
              { !loading ? parent?.map((parent, index) => {
                return (
                  <div className="search-item">
                    <a onClick={e => {
                        e.preventDefault();
                        history.push({
                          pathname: `/admin/parent/detail/${parent.id}`,
                          state: { parent_id : parent.id }
                        });
                      }} >
                      <div className="user-wrap">
                        <div className="user-avatar">
                          <img alt="name" className="avatar-img" src={ parent.image } />
                        </div>
                        <div className="user-info">
                          <p className="user-name mb-1 font-weight-bold">{ parent.last_name }  { parent.first_name }</p>
                          <p className="user-tel">{ parent.email }</p>
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

export default Parent;