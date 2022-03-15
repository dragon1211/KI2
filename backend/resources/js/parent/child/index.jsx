import React, { useRef, useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';

import { HeaderContext } from '../../context';
import Notification from '../../component/notification';
import Alert from '../../component/alert';
import PageLoader from '../../component/page_loader';
import InfiniteScroll from "react-infinite-scroll-component";

const INFINITE = 10;
const SCROLL_DELAY_TIME = 1500;

const ParentChilds = () => {

    const [notice, setNotice] = useState(-1);
    const father_id = localStorage.getItem('father_id');
    
    const [children_list, setChildrenList] = useState([]);
    const [fetch_children_list, setFetchChildrenList] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const [_success, setSuccess] = useState('');
    const [_400error, set400Error] = useState('');

    const isMountedRef = useRef(true);
    const { isAuthenticate } = useContext(HeaderContext);

    useEffect(() => {
        isMountedRef.current = false;
        if(isAuthenticate()){
            setLoaded(false);
            
            axios.get('/api/fathers/children/listOfFather', {params: {father_id: father_id}})
            .then(response => {
                if(isMountedRef.current) return;

                setLoaded(true);
                setNotice(response.data.notice);
                if(response.data.status_code==200){
                    setChildrenList(response.data.params);
                    var len = response.data.params.length;
                    if(len > INFINITE)
                        setFetchChildrenList(response.data.params.slice(0, INFINITE));
                    else setFetchChildrenList(response.data.params.slice(0, len));
                }
                else {
                    set400Error("失敗しました。");
                }
            })
        }
        return () => {
            isMountedRef.current = true;
        }
    }, []);


    const fetchMoreChildrenList = () => {
        setTimeout(() => {
            var x = fetch_children_list.length;
            var y = children_list.length;
            var c = 0;
            if(x+INFINITE < y) c = INFINITE;
            else c = y - x;
            setFetchChildrenList(children_list.slice(0, x+c));
        }, SCROLL_DELAY_TIME);
    };


	return (
        <div className="l-content">
            <div className="l-content__ttl">
                <div className="l-content__ttl__left">
                    <h2>子一覧</h2>
                    <div className="p-meetingAdd-btn">
                        <Link to = '/p-account/child/add' data-v-ade1d018="kikikanri"
                          className="btn-default btn-yellow btn-meeting btn-shadow btn-r8 btn-h48 btn-fz14">
                            <span className="ft-16">子追加</span>
                            <svg version="1.1" viewBox="0 0 500 500" className="icon svg-icon svg-fill svg-up">
                              <path fill="#000" stroke="none" pid="0" d="M250 437.6c-16.5 0-30-13.5-30-30V280.1H92.5c-16.5 0-30-13.5-30-30s13.5-30 30-30H220V92.6c0-16.5 13.5-30 30-30s30 13.5 30 30v127.5h127.5c16.5 0 30 13.5 30 30s-13.5 30-30 30H280v127.5c0 16.5-13.5 30-30 30z"></path>
                            </svg>
                        </Link>
                    </div>
                </div>
                <Notification notice={notice}/>
            </div>

            <div className="l-content-wrap">
            {
                !loaded && <PageLoader/>
            }
            {
                loaded &&
                <section className="search-container">
                    <div className="search-wrap">
                        <div className="search-content">
                            <InfiniteScroll
                                dataLength={fetch_children_list.length}
                                next={fetchMoreChildrenList}
                                hasMore={fetch_children_list.length != children_list.length}
                                loader={
                                    <div id="dots3">
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                    </div>
                                }
                                style={{overflow:'none', position:'relative'}}
                            >
                            {
                                fetch_children_list.length>0 ?
                                    fetch_children_list.map((item, id)=>
                                    <div className="search-item border-0" key={id}>
                                        <Link to = {`/p-account/child/detail/${item.id}`}>
                                            <div className="user-wrap">
                                                <div className="user-avatar">
                                                    <img alt="name" className="avatar-img" src={item.image}/>
                                                </div>
                                                <div className="user-info">
                                                  <p className="user-name">{ item.last_name }  { item.first_name }</p>
                                                  <p className="user-tel">{ item.company }</p>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                    )
                                :<p className="text-center py-5 ft-xs-17">メンバーがいません</p>
                            }
                            </InfiniteScroll>
                        </div>
                    </div>
                </section>
            }
            { _success && <Alert type="success" hide={()=>setSuccess('')}>{_success}</Alert> }
            { _400error && <Alert type="fail" hide={()=>set400Error('')}>{_400error}</Alert> }
            </div>
        </div>
    )
}



export default ParentChilds;
