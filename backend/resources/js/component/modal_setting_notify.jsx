import React, { useRef, useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { CircularProgress  } from '@material-ui/core';

import { HeaderContext } from '../context';
import Alert from '../component/alert';


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});


export default function ModalSettingNotify({show, handleClose, meetingId, handleLoadedChildren}){

  const [unapproval, setUnapproval ] = useState([]);
  const [approval, setApproval ] = useState([]);
  const [isApproval, setIsApproval ] = useState(false);
  const [_success, setSuccess] = useState('');
  const [_400error, set400Error] = useState('');
  const [loaded1, setLoaded1] = useState(false);
  const [loaded2, setLoaded2] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const isMountedRef = useRef(true);
  const { isAuthenticate } = useContext(HeaderContext);

  useEffect(() => {
    isMountedRef.current = false;
    if(isAuthenticate()){
      setLoaded1(false);
      axios.get('/api/fathers/meeting/approvals/listChildrenOfApprovel', {params: { meeting_id: meetingId }})
        .then((response) => {
          if(isMountedRef.current) return;
  
          setLoaded1(true);
          if(response.data.status_code==200){
            setApproval(response.data.params);
          }
        });
  
      setLoaded2(false);
      axios.get('/api/fathers/meeting/approvals/listChildrenOfUnapprovel', {params: { meeting_id: meetingId }})
        .then((response) => {
          if(isMountedRef.current) return;
          
          setLoaded2(true);
          if(response.data.status_code==200){
            setUnapproval(response.data.params);
          }
        });
    }

    return () => {
      isMountedRef.current = true;
    }
  }, []);


  useEffect(()=>{
    setLoaded(loaded1 && loaded2);
    handleLoadedChildren(loaded1 && loaded2);
  },[loaded1, loaded2]);


  const settingNotify = (email) => {
    if(isAuthenticate){
      const formdata = new FormData();
      formdata.append('email', JSON.stringify(new Array(email)));
      formdata.append('meeting_id', meetingId);
      axios.post('/api/fathers/meetingEditNotification', formdata)
      .then(response=>{
        if(isMountedRef.current) return;
        
        switch(response.data.status_code){
          case 200: setSuccess('通知に成功しました!'); break;
          case 400: set400Error('通知に失敗しました。'); break;
        }
      })
    }
  }


	return (
    <Dialog
    open={show}
    TransitionComponent={Transition}
    keepMounted
    aria-describedby="alert-dialog-slide-description"
    onClose={()=>{
      setSuccess('');
      set400Error('');
      handleClose();
    }}
    id="SettingNotifyModal"
    >
        <DialogTitle className="px-0 pt-3">
            <div className="modal-tab-area ft-16">
              <div onClick={e => {setIsApproval(false); }} className={`modal-tab-label ${isApproval ? "" : "is-active"}`}><span>未承知</span></div>
              <div onClick={e => {setIsApproval(true); }}  className={`modal-tab-label ${!isApproval ? "" : "is-active"}`}><span>承知済み</span></div>
           </div>
        </DialogTitle>
        <DialogContent className="position-relative">
          {
            !loaded &&
              <CircularProgress
                className="modal-css-loader"
                sx={{
                  animationDuration: '600ms',
                }}
                thickness={2}
              />
          }
          {
            loaded &&
            <>
              <div className={ `modal-content border-0 ${!isApproval ? "is-active" : ""}` } id="item01">
                {
                  unapproval.length > 0 ?
                  unapproval.map((item, ki) =>
                    <div className="modal-content-item" key={ki}>
                      <div className="user-wrap">
                        <Link to={`/p-account/child/detail/${item.child.id}`} >
                          <div className="user-avatar">
                            <img alt="name" className="avatar-img" src={item.child.image} />
                          </div>
                          <p className="user-name">{item.child.last_name}　{item.child.first_name}</p>
                        </Link>
                      </div>
                      <div className="p-notification-btn">
                        <a onClick={e => settingNotify(item.child.email)} className="btn-default btn-yellow btn-notification btn-r3 btn-h30 btn-w100p btn-fz14">
                          <span>再通知</span>
                        </a>
                      </div>
                    </div>
                  )
                  : <p className="text-center py-2 ft-xs-15">データはありません。</p>
                }
              </div>
              <div className={ `modal-content border-0 ${isApproval ? "is-active" : ""}` } id="item02">
                {
                  approval.length > 0 ?
                  approval?.map((item, kj) =>
                    <div className="modal-content-item" key={kj}>
                      <div className="user-wrap">
                        <Link to={`/p-account/child/detail/${item.child.id}`} >
                          <div className="user-avatar">
                            <img alt="name" className="avatar-img" src={item.child.image} />
                          </div>
                          <p className="user-name">{item.child.last_name}　{item.child.first_name}</p>
                        </Link>
                      </div>
                    </div>
                  )
                  : <p className="text-center py-2 ft-xs-15">データはありません。</p>
                }
              </div>
              { _400error && <Alert type="fail" hide={()=>set400Error('')}>{_400error}</Alert> }
              { _success && <Alert type="success"  hide={()=>setSuccess('')}>{_success}</Alert>}
            </>
          }
        </DialogContent>
    </Dialog>
	)
}

