import React, { useRef, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import moment from 'moment';
import Notification from '../../component/notification';
import ModalConfirm from '../../component/modal_confirm';
import Alert from '../../component/alert';
import PageLoader from '../../component/page_loader';

const ParentChildDetail = () => {

    const navigator = useNavigate();
    const params = useParams();

    const [notice, setNotice] = useState(-1);
    const [loaded, setLoaded] = useState(false);
    const [show_delete, setShowDelete] = useState(false);
    const [submit, setSubmit] = useState(false);
    const [child, setChild] = useState(null);
    const [_400error, set400Error] = useState('');
    const [_404error, set404Error] = useState('');
    const [_success, setSuccess] = useState('');
    
    const father_id = localStorage.getItem('father_id');
    const child_id = params?.child_id;
    const isMountedRef = useRef(true);
    
    useEffect(() => {
      isMountedRef.current = false;
      setLoaded(false);

      axios.get('/api/fathers/children/detail/'+child_id, {params:{father_id: father_id}})
        .then(response => {
          if(isMountedRef.current) return;

          setLoaded(true);
          setNotice(response.data.notice);
          if(response.data.status_code==200){
            setChild(response.data.params);
          }
          else {
            set400Error("失敗しました。");
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

      return () => {
        isMountedRef.current = true
      }
    },[]);

  //-------------------------------------------------------------
  useEffect(()=>{
      var navbar_list = document.getElementsByClassName("mypage-nav-list__item");
      for(let i=0; i<navbar_list.length; i++)
          navbar_list[i].classList.remove('nav-active');
      document.getElementsByClassName("-child")[0].classList.add('nav-active');
  },[]);

  //---------------------------------------------------------------
  const handleAcceptDelete = () => {
    setSubmit(true);
    axios.delete(`/api/fathers/relations/deleteRelationChild/${child_id}`)
    .then(response => {
      if(isMountedRef.current) return;
      
      setSubmit(false);
      setShowDelete(false);
      setNotice(response.data.notice);
      switch(response.data.status_code){
        case 200: {
          navigator('/p-account/child', { state: "子の削除に成功しました。" });  
          break;
        }
        case 400: set400Error('子の削除に失敗しました。'); break;
      }
    });
  };
    
	return (
    <div className="l-content">      
        <div className="l-content-w560">
            <div className="l-content__ttl">
                <div className="l-content__ttl__left">
                    <h2>子詳細</h2>
                </div>
                <Notification notice={notice}/>
            </div>

            <div className="l-content-wrap">
              {
                !loaded && <PageLoader/>
              }
              {
                loaded && child &&
                <section className="profile-container">
                  <div className="profile-wrap">
                    <div className="profile-content">
                      <div className="profile-thumb">
                          <img src={child.image} className="profile-image" alt="child-image" />                    
                      </div>
                      <p className="profile-name ft-xs-16">{`${child.last_name} ${child.first_name}`}</p>
                      <div className="profile-info ft-xs-17">
                        <div className="profile-info__item">
                            <p className="profile-info__icon">
                                <img src="/assets/img/icon/building.svg" alt="会社名"/>
                            </p>
                            <p className="txt">{child.company ? child.company: '未入力'}</p>
                        </div>
                        <div className="profile-info__item">
                            <p className="profile-info__icon">
                              <img src="/assets/img/icon/calendar.svg" alt="日付" />
                            </p>
                            <p className="txt">{ moment(child.father_relations?.hire_at).format('YYYY/MM/DD') || '' }</p>
                        </div>
                      </div>
                      <div className="p-profile-btn">
                        <Link to={`/p-account/child/edit/hire-date/${child_id}`}
                          data-v-ade1d018="kikikanri" 
                          className="btn-default btn-yellow btn-profile btn-r8 btn-h52">
                            <span>入社日を変更</span>
                        </Link>
                      </div>
                      <div className="p-profile-txtLink">
                          <a className="btn-default btn-password btn-r8 btn-h30"
                              onClick={e=>setShowDelete(true)}>
                              <span className="ft-xs-16">削除する</span>
                          </a>
                      </div>
                    </div>
                  </div>
                  <ModalConfirm 
                    show={show_delete} 
                    message={"全てのミーティングの情報から\n消えますがよろしいでしょうか?"}
                    handleClose={()=>setShowDelete(false)} 
                    handleAccept={handleAcceptDelete} 
                    loading={submit}
                  />
                </section>
              }
            </div>
            { _400error && <Alert type="fail" hide={()=>set400Error('')}>{_400error}</Alert> }
            { _success && <Alert type="success" hide={()=>setSuccess('')}>{_success}</Alert> }
            { _404error && 
                <Alert type="fail" hide={()=>{
                    set404Error('');
                    navigator('/p-account/child', {state: ''});
                }}>
                {_404error}
                </Alert>
            }
        </div>
    </div>
    )
}



export default ParentChildDetail;