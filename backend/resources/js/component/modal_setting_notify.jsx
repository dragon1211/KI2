import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/styles';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const useStyles = makeStyles(theme => ({
    show: {
        display: 'block',
    },
    hide: {
        display: 'none',
    },
}));

export default function ModalSettingNotify({show, meetingId}){
  const classes = useStyles();
  const [unapprovel, setUnapprovel ] = useState(null);
  const [approvel, setApprovel ] = useState(null);
  const [isApprovel, setIsApprovel ] = useState(false);

  useEffect(() => {
    axios.get(`/api/children/listOfMeetingNotifyApprovel/${meetingId}`, {params: { meeting_id: meetingId }}).then((response) => {
      if(response.data.status_code==200){
        console.log(response.data.params);
        setApprovel(response.data.params);
      } else if(response.data.status_code==400){
        //TODO
      }
    });
  }, []);

  useEffect(() => {
    axios.get(`/api/children/listOfMeetingNotifyUnapprovel/${meetingId}`, {params: { meeting_id: meetingId }}).then((response) => {
      if(response.data.status_code==200){
        console.log(response.data.params);
        setUnapprovel(response.data.params);
      } else if(response.data.status_code==400){
        //TODO
      }
    });
  }, []);
  
  async function settingNotify(meetingId) {
    // const formdata = new FormData();
    // formdata.append('meeting_id', meetingId);
    // axios.post('/api/meetings/registerFavorite', formdata).then((response) => {})
    console.log(meetingId);
    toast.success("SMSの送信に成功しました！", {
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
  };

	return (
    <div className={`modal-area modal-up65 ${show ? classes.show : classes.hide}`} >
      <div className="modal-bg"></div>
      <div className="modal-box">
        <ToastContainer />
        <div className="modal-wrap">
          <div className="modal-tab-area">
            <div onClick={e => {setIsApprovel(false); }} className={`modal-tab-label ${isApprovel ? "" : "is-active"}`}><span>未承知</span></div>
            <div onClick={e => {setIsApprovel(true); }}  className={`modal-tab-label ${!isApprovel ? "" : "is-active"}`}><span>承知済み</span></div>
          </div>

          <div className="modal-content-area">
              <div className={ `modal-content ${!isApprovel ? "is-active" : ""}` }  style={{border:"none"}} id="item01">
                { unapprovel?.map((item, index) => {
                  return (
                    <div className="modal-content-item">
                      <div className="user-wrap">
                        <a href={`/c-account/profile/detail/${item.id}`} >
                          <div className="user-avatar">
                            <img alt="name" className="avatar-img" src={item.image} />
                          </div>
                          <p className="user-name">{item.last_name}　{item.first_name}</p>
                        </a>
                      </div>
                      <div className="p-notification-btn">
                        <a onClick={e => settingNotify(item.id)} className="btn-default btn-yellow btn-notification btn-r3 btn-h30 btn-w100p btn-fz14">
                          <span>通知</span>
                        </a>
                      </div>
                    </div>
                  ) 
                })}
                    <div className="modal-content-item">
                      <div className="user-wrap">
                      <a href={`/c-account/profile/detail/1`} >
                          <div className="user-avatar">
                            <img alt="name" className="avatar-img" src="../../../assets/img/avatar/avatar-sample03@2x.png" />
                          </div>
                          <p className="user-name">Data test 1</p>
                        </a>
                      </div>
                      <div className="p-notification-btn">
                        <a onClick={e => settingNotify(1)}  className="btn-default btn-yellow btn-notification btn-r3 btn-h30 btn-w100p btn-fz14">
                          <span>通知</span>
                        </a>
                      </div>
                    </div>
              </div>    
              <div className={ `modal-content ${isApprovel ? "is-active" : ""}` }  style={{border:"none"}} id="item02">
                { approvel?.map((item, index) => {
                  return (
                    <div className="modal-content-item">
                      <div className="user-wrap">
                        <a href={`/c-account/profile/detail/${item.id}`} >
                          <div className="user-avatar">
                            <img alt="name" className="avatar-img" src={item.image} />
                          </div>
                          <p className="user-name">{item.last_name}　{item.first_name}</p>
                        </a>
                      </div>
                      <div className="p-notification-btn">
                        <a onClick={e => settingNotify(item.id)} className="btn-default btn-yellow btn-notification btn-r3 btn-h30 btn-w100p btn-fz14">
                          <span>通知</span>
                        </a>
                      </div>
                    </div>
                  ) 
                })}
                    <div className="modal-content-item">
                      <div className="user-wrap">
                      <a href={`/c-account/profile/detail/2`} >
                          <div className="user-avatar">
                            <img alt="name" className="avatar-img" src="../../../assets/img/avatar/avatar-sample03@2x.png" />
                          </div>
                          <p className="user-name">Data test 2</p>
                        </a>
                      </div>
                      <div className="p-notification-btn">
                        <a onClick={e => settingNotify(2)} className="btn-default btn-yellow btn-notification btn-r3 btn-h30 btn-w100p btn-fz14">
                          <span>通知</span>
                        </a>
                      </div>
                    </div>
              </div>
            </div>
        </div>
      </div>
    </div>
	)
}

