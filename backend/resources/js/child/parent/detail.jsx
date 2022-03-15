import React, { useRef, useEffect, useState, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { HeaderContext } from '../../context';
import Notification from '../../component/notification';
import Alert from '../../component/alert';
import PageLoader from '../../component/page_loader';

const ChildParentDetail = () => {

    const { isAuthenticate } = useContext(HeaderContext);
    const navigator = useNavigate();
    const params = useParams();

    const [notice, setNotice] = useState(-1);
    const [loaded, setLoaded] = useState(false);
    const [parent, setParent] = useState(null);

    const [_400error, set400Error] = useState('');
    const [_404error, set404Error] = useState('');
    const [_success, setSuccess] = useState('');
    
    const isMountedRef = useRef(true);
    
    useEffect(() => {
        isMountedRef.current = false;

        if(isAuthenticate){
            setLoaded(false);
    
            axios.get('/api/children/fathers/detail/'+ params?.father_id)
            .then(response => {
                if(isMountedRef.current) return;
    
                setLoaded(true);
                setNotice(response.data.notice);
                if(response.data.status_code==200){
                    setParent(response.data.params);
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
        }
            
        return () => {
            isMountedRef.current = true;
        }
    },[]);

    
	return (
    <div className="l-content">      
        <div className="l-content-w560">
            <div className="l-content__ttl">
                <div className="l-content__ttl__left">
                    <h2>親詳細</h2>
                </div>
                <Notification notice={notice}/>
            </div>

            <div className="l-content-wrap">
                <section className="profile-container">
                {
                    !loaded && <PageLoader/>
                }
                {
                    loaded && parent &&
                    <div className="profile-wrap">
                        <div className="profile-content">
                            <div className="profile-thumb">
                                <img src={parent.image} className="profile-image" alt="parent-image" />                    
                            </div>
                            <p className="profile-name">{parent.company}</p>
                            <div className="profile-info">
                                <div className="profile-info__item">
                                    <a href={`mailto:${parent.email}`}>
                                        <p className="profile-info__icon">
                                            <img src="/assets/img/icon/mail.svg" alt="メール"/>
                                        </p>
                                        <p className="txt">{parent.email}</p>
                                    </a>
                                </div>
                                <div className="profile-info__item">
                                    <a href={`tel:${parent.tel}`}>
                                        <p className="profile-info__icon">
                                            <img src="/assets/img/icon/phone.svg" alt="電話" />
                                        </p>
                                        <p className="txt">{parent.tel}</p>
                                    </a>
                                </div>
                                <div className="profile-info__item txt-long">
                                    <p className="txt">{parent.profile ? parent.profile: '未入力'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                }
                {  _400error && <Alert type="fail" hide={()=>set400Error('')}>{_400error}</Alert> } 
                {  _success &&  <Alert type="success" hide={()=>setSuccess('')}>{_success}</Alert> }
                {  _404error && 
                    <Alert type="fail" hide={()=>{
                        navigator('/c-account/parent');
                    }}>
                    {_404error}
                    </Alert>
                }
                </section>
            </div>
        </div>
    </div>
    )
}



export default ChildParentDetail;