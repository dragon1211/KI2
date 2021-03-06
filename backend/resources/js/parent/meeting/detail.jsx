import React, { useRef, useEffect, useState, useContext } from 'react';
import moment from 'moment';
import { useNavigate, Link, useParams } from 'react-router-dom';
import copy from 'copy-to-clipboard';

import { HeaderContext } from '../../context';
import ModalEditMemo from '../../component/modal_edit_memo';
import ModalConfirm from '../../component/modal_confirm';
import ModalPdf from '../../component/pdf/modal_pdf';
import Notification from '../../component/notification';
import ModalSettingNotify from '../../component/modal_setting_notify';
import Alert from '../../component/alert';
import Thumbnail from '../../component/thumbnail';
import PageLoader from '../../component/page_loader';

const ParentMeetingDetail = () => {

  const navigator = useNavigate();
  const params = useParams();
  const { isAuthenticate } = useContext(HeaderContext);

  const [notice, setNotice] = useState(-1);
  const father_id = localStorage.getItem('father_id');

  const [loaded, setLoaded] = useState(false);
  const [loaded_children, setLoadedChildren] = useState(false);
  const [submit_delete, setSubmitDelete] = useState(false);
  const [submit_notify, setSubmitNotify] = useState(false);
  const [_success, setSuccess] = useState('');
  const [_400error, set400Error] = useState('');
  const [_404error, set404Error] = useState('');

  const [show_delete_modal, setShowDeleteModal] = useState(false);
  const [show_notify_all_modal, setShowNotifyAllModal] = useState(false);
  const [show_memo_modal, setShowMemoModal] = useState(false);
  const [show_notify_pickup_modal, setShowNotifySelectModal] = useState(false);
  const [show_pdf_modal, setShowPDFModal] = useState(false);

  const [meeting, setMeeting] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);

  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = false;

    if(isAuthenticate()){
      setLoaded(false);
  
      axios.get(`/api/fathers/meetings/detail/${params?.meeting_id}`, {params: { father_id: father_id}})
      .then((response) => {
        if(isMountedRef.current) return;

        setLoaded(true);
        setNotice(response.data.notice);
        if(response.data.status_code==200){
          var list = response.data.params;
          var total=0, num=0;
          for(var i in list.approval)
          {
            if(list.approval[i].approval_at) num ++;
            total ++;
          }
          setMeeting({...list, denominator:total, numerator:num});
          setThumbnail(response.data.params.meeting_image[0]?.image);
        }
        else {
          set400Error("?????????????????????");
        }
      })
      .catch(err=>{
        if(isMountedRef.current) return;

        setLoaded(true);
        setNotice(err.response.data.notice);
        if(err.response.status==404){
          set404Error(err.response.data.message);
        }
      })
    }
    return () => {
      isMountedRef.current = true;
    }
  }, []);


  const handleAcceptDelete = () => {
    if(isAuthenticate()){
      setSubmitDelete(true);
      axios.delete(`/api/fathers/meetings/delete/${params?.meeting_id}`)
      .then(response => {
        if(isMountedRef.current) return;
  
        setNotice(response.data.notice);
        setSubmitDelete(false);
        setShowDeleteModal(false);
        switch(response.data.status_code){
          case 200: {
            navigator('/p-account/meeting', {state: "???????????????????????????????????????????????????" });
            break;
          }
          case 400: set400Error('???????????????????????????????????????????????????'); break;
        }
      });
    }
  };


  function handleFavorite(meetingId, currentFavorite) {
    if(isAuthenticate()){
      const formdata = new FormData();
      formdata.append('meeting_id', meetingId);
      formdata.append('is_favorite', currentFavorite == 1 ? 0 : 1);
      axios.post('/api/fathers/meetings/registerFavorite', formdata)
  
      const updatedItem = {
        ...meeting,
        is_favorite: currentFavorite == 1 ? 0 : 1,
      };
      setMeeting(updatedItem);
    }
  };

  const handleNotifyAllChild = () => {
    if(isAuthenticate()){
      setSubmitNotify(true);
      axios.get('/api/fathers/meeting/approvals/listChildrenOfUnapprovel', {params:{meeting_id: params?.meeting_id}})
      .then(response => {
        if(isMountedRef.current) return;

        setNotice(response.data.notice);
        if(response.data.status_code == 200){
          var list = response.data.params;
          const email_list = [];
          for(var i in list){
            email_list.push(list[i].child.email);
          }
          const formdata = new FormData();
          formdata.append('email', JSON.stringify(email_list));
          formdata.append('meeting_id', params?.meeting_id);
          axios.post('/api/fathers/meetingEditNotification', formdata)
          .then(response=>{
            if(isMountedRef.current) return;

            setSubmitNotify(false);
            setShowNotifySelectModal(false);
            switch(response.data.status_code){
              case 200: setSuccess('???????????????????????????!'); break;
              case 400: set400Error('??????????????????????????????'); break;
            }
          })
        }
      });
    }
  }


  const handleUpdateMemo = (modal_memo) => {
    if(isAuthenticate()){
      let _tmp = meeting;
      _tmp.memo = modal_memo;
      setMeeting(_tmp);
      const post = {
        meeting_id: meeting.id,
        memo: modal_memo
      }
      axios.put('/api/fathers/meetings/updateMemo', post)
    }
  }


  const handlePDFOpen = (pdf) => {
    var pieces = pdf.split('/');
    var file_name = pieces[pieces.length-1];
    window.open(`/pdf/${file_name}`, '_blank');
  }

  const handleLoadedChildren = (flag) => {
    setLoadedChildren(flag);
  }

  const saveStorage = () => {
    let txt = `${meeting.father.company}????????????\n???????????????????????????\n??????????????????????????????????????????\n\nhttps://kikikan.xyz/c-account/meeting/detail/${params?.meeting_id}`; 
    if(copy(txt)){
      setSuccess('????????????????????????')
    } else {
      set400Error('??????????????????????????????')
    }
  }

  const cloneMeeting = (meeting) => {
    localStorage.setItem('cloneMeeting', JSON.stringify(meeting));
    navigator('/p-account/meeting/new');
  }


  return (
      <div className="l-content">
        <div className="l-content-w560">
          <div className="l-content__ttl">
            <div className="l-content__ttl__left">
              <h2>????????????????????????</h2>
            </div>
            <Notification notice={notice}/>
          </div>
          {
            !(loaded && loaded_children) && <PageLoader />
          }
          {
            (loaded && loaded_children) && meeting &&
            <div className="l-content-wrap">
              <div className="p-article">
                <div className="p-article-wrap">
                  <article className="p-article__body">
                    <div className="p-article__content">
                      <div className="meeting-member">
                        <div className="meeting-member-wrap">
                          <div className="meeting-member-link" onClick={()=>setShowNotifyAllModal(true)} >
                            <ul className="meeting-member-count">
                              <li className="numerator">{meeting?.numerator}</li>
                              <li className="denominator">{meeting?.denominator}</li>
                            </ul>

                            <ul className="meeting-member-list" role="list">
                              {
                                meeting.approval?.map((v, inx) =>
                                {
                                  if(v.approval_at)
                                  return(
                                  <li className="meeting-member__item" role="listitem" key={inx}>
                                    <div className="avatar">
                                      <img alt="name" className="avatar-img" src={v?.child.image} />
                                    </div>
                                  </li>)
                                })
                              }
                            </ul>
                          </div>
                        </div>
                      </div>
                      <h3 className="meeting-ttl">{ meeting?.title }</h3>
                      <time dateTime="2021-07-30" className="meeting-time">
                        <span className="meeting-date">{ moment(meeting?.updated_at).format('YYYY/MM/DD') }</span>
                      </time>
                      <div className="clip-copy" onClick={saveStorage}>
                          <a>???????????????URL??????????????????</a>
                          <img src="/assets/img/icon/icon-copy.svg" alt="kiki"/>
                      </div>
                      <ul className="p-article-btn-list">
                        <li className="p-article-btn__item">
                          <Link to={`/p-account/meeting/edit/${params?.meeting_id}`}
                              className="btn-default btn-yellow btn-pdf btn-r8 btn-h48">??????</Link>
                        </li>
                        <li className="p-article-btn__item">
                          <a onClick={()=>setShowDeleteModal(true)}
                            className="btn-default btn-yellow btn-pdf btn-r8 btn-h48">??????</a>
                        </li>
                        <li className="p-article-btn__item">
                          <a onClick={()=>cloneMeeting(meeting)}
                            className="btn-default btn-yellow btn-pdf btn-r8 btn-h48">??????</a>
                        </li>
                        <li className="p-article-btn__item">
                          <a onClick={()=>setShowNotifySelectModal(true)}
                            className="btn-default btn-yellow btn-pdf btn-r8 btn-h48">?????????</a>
                        </li>
                      </ul>

                      <div className="p-article__context">

                        <div className="p-file-list">
                          <Thumbnail image={thumbnail}/>
                          <div className="p-file-nav">
                          {
                            meeting.meeting_image.map((v, inx) =>
                              <figure onClick={() => setThumbnail(v.image)}  key={inx}>
                                <img src={v.image} alt="" />
                              </figure>
                            )
                          }
                          </div>
                        </div>

                        <div className="p-article__pdf">
                          <div className="p-article__pdf__btn">
                          {
                            meeting.pdf ?
                            <a data-v-ade1d018="" className="btn-default btn-yellow btn-pdf btn-r8 btn-h52"
                              href={meeting.pdf}
                              target='_blank'
                              // onClick={()=>handlePDFOpen(meeting.pdf)}
                            >
                              <span>PDF???????????????</span>
                            </a>
                            :
                            <a data-v-ade1d018="" className="btn-default btn-yellow btn-pdf btn-r8 btn-h52 btn-disabled">
                              <span>PDF???????????????</span>
                            </a>
                          }
                          </div>
                          <button type="button"
                              aria-label="???????????????" data-tooltip="???????????????"
                              aria-pressed="false"
                              className="icon a-icon like-icon icon-textFill icon-textFill-wrap a-icon-size_medium"
                              onClick = {()=>setShowMemoModal(true)} />
                          <button type="button"
                            onClick={e => handleFavorite(meeting.id, meeting.is_favorite)}
                            aria-label="???????????????" data-tooltip="???????????????" aria-pressed="false" className={`icon a-icon like-icon  ${meeting.is_favorite == 1 ? "icon-starFill icon-starFill-wrap" : "icon-star icon-star-wrap"} a-icon-size_medium`}></button>
                        </div>
                        <p className="p-article__txt">{ meeting.text }</p>
                      </div>
                    </div>
                  </article>
                </div>
              </div>
              <ModalEditMemo
                show={show_memo_modal}
                title={"??????"}
                content={meeting.memo}
                handleClose={()=>setShowMemoModal(false)}
                handleUpdateMemo = {handleUpdateMemo}
              />
              <ModalConfirm
                show={show_delete_modal}
                message={"????????????????????????\n??????????????????????????????"}
                handleClose={()=>setShowDeleteModal(false)}
                handleAccept={handleAcceptDelete}
                loading={submit_delete}
              />
              <ModalConfirm
                show={show_notify_pickup_modal}
                message={"???????????????????????????????????????\n??????????????????????????????"}
                handleClose={()=>setShowNotifySelectModal(false)}
                handleAccept={handleNotifyAllChild}
                loading = {submit_notify}
              />
              <ModalPdf
                show={show_pdf_modal}
                pdfPath={meeting.pdf}
                handleClose={()=>setShowPDFModal(false)}
              />
            </div>
          }
          {
            loaded && meeting &&
              <ModalSettingNotify
                show={show_notify_all_modal}
                meetingId={meeting.id}
                handleClose={()=>setShowNotifyAllModal(false)}
                handleLoadedChildren = {handleLoadedChildren}
              />
          }
        </div>
        { _400error && <Alert type="fail"  hide={()=>set400Error('')}>{_400error}</Alert> }
        { _success && <Alert type="success"  hide={()=>setSuccess('')}>{_success}</Alert> }
        { _404error &&
            <Alert type="fail" hide={()=>{
                set404Error('');
                navigator('/p-account/meeting', {state: ''});
            }}>
            {_404error}
            </Alert>
        }
      </div>
	)
}

export default ParentMeetingDetail;
