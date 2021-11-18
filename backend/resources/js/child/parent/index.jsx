import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useHistory, Link } from 'react-router-dom';
import { CircularProgress  } from '@material-ui/core';

import Notification from '../notification';
import Alert from '../../component/alert';
import InfiniteScroll from "react-infinite-scroll-component";

const INFINITE = 10;
const SCROLL_DELAY_TIME = 1500;

const Parent = () => {
    
    const history = useHistory();
    const [notice, setNotice] = useState(localStorage.getItem('notice'));
    const [parent_list, setParentList] = useState([]);
    const [fetch_parent_list, setFetchParentList] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const [_400error, set400Error] = useState('');
    const [_success, setSuccess] = useState('');


    useEffect(() => {
        setLoaded(false);
        let child_id = document.getElementById('child_id').value;
        axios.get('/api/children/fathers/listOfChild', {params: {child_id: child_id}})
        .then(response => {
            setLoaded(true);
            setNotice(response.data.notice);
            if(response.data.status_code==200){
                setParentList(response.data.params);
                var len = response.data.params.length;
                if(len > INFINITE)
                    setFetchParentList(response.data.params.slice(0, INFINITE));
                else setFetchParentList(response.data.params.slice(0, len));
            }
            else {
                set400Error("失敗しました。");
            }
        })
    }, []);


    const fetchMoreParentList = () => {
        setTimeout(() => {
            var x = fetch_parent_list.length;
            var y = parent_list.length;
            var c = 0;
            if(x+INFINITE < y) c = INFINITE;
            else c = y - x;
            setFetchParentList(parent_list.slice(0, x+c));
        }, SCROLL_DELAY_TIME);
    };

    
	return (
        <div className="l-content">
            <div className="l-content__ttl">
                <div className="l-content__ttl__left">
                    <h2>親一覧</h2>
                </div>
                <Notification notice={notice}/>
            </div>

            <div className="l-content-wrap">
            {
                !loaded &&
                    <CircularProgress className="css-loader"/>
            }
            {
                loaded && 
                <section className="search-container">
                    <div className="search-wrap">
                        <div className="search-content">
                            <InfiniteScroll
                                dataLength={fetch_parent_list.length}
                                next={fetchMoreParentList}
                                hasMore={fetch_parent_list.length != parent_list.length}
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
                                fetch_parent_list.length>0 ?
                                    fetch_parent_list.map((item, id)=>
                                    <div className="search-item border-0" key={id}>
                                        <Link to={`/c-account/parent/detail/${item.id}`}>
                                            <div className="user-wrap">
                                                <div className="user-avatar">
                                                    <img alt="name" className="avatar-img" src={item.image}/>
                                                </div>
                                                <div className="user-info">
                                                    <p className="user-name">{item.company}</p>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                    )
                                :<p className="text-center py-5 ft-xs-17">親データはありません。</p>
                            }
                            </InfiniteScroll>
                        </div>
                    </div>
                </section>
            }
            {  _400error && <Alert type="fail" hide={()=>set400Error('')}>{_400error}</Alert> } 
            {  _success &&  <Alert type="success" hide={()=>setSuccess('')}>{_success}</Alert> }
            </div>
        </div>
        
    )
}



export default Parent;