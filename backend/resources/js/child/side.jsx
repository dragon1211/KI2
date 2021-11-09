import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'

export default function Side() {
    const [selected, setSelected] = useState('');

    const child_img = document.getElementById('child_image').value;

    const handleLogout = () => {
        axios.get('/c-account/logout')
        .then(() => location.href = '/c-account/login')
    }

    return (
        <div className="l-side">
            <div className="l-side-logo">
                <a href=""><img src="/assets/img/common/logo.svg" alt="ロゴ" /></a>
            </div>
            <nav className="mypage-nav">
                <ul className="mypage-nav-list">
                    <li 
                        className={`mypage-nav-list__item -meeting ${(selected == 'meeting' || (selected == '' && document.getElementById('c_router').value == 'meeting')) && "nav-active"}`}
                        onClick={e => {
                            e.preventDefault();
                            setSelected('meeting');
                        }}>
                        <Link className='mypage-nav-list__link' to='/c-account/meeting'>
                            <i className="icon meeting"></i>
                            <span>ミーティング</span>
                        </Link>
                    </li>
                    <li className={`mypage-nav-list__item -search ${ (selected == 'search' || (selected == '' && document.getElementById('c_router').value == 'search')) && "nav-active"}`}
                        onClick={e => {
                            e.preventDefault();
                            setSelected('search');
                        }}>
                        <Link className='mypage-nav-list__link' to='/c-account/search'>
                            <i className="icon search"></i>
                            <span>検索</span>
                        </Link>
                    </li>
                    <li className={`mypage-nav-list__item -parentinfo ${ (selected == 'parent' || (selected == '' && document.getElementById('c_router').value == 'parent')) && "nav-active"}`}
                        onClick={e => {
                            e.preventDefault();
                            setSelected('parent');
                        }}>
                        <Link className='mypage-nav-list__link' to='/c-account/parent'>
                            <i className="icon parents"></i>
                            <span>親情報</span>
                        </Link>
                    </li>
                    
                    <li className={`mypage-nav-list__item -profile ${ (selected == 'profile' || (selected == '' && document.getElementById('c_router').value == 'profile')) && "nav-active"}`}
                        onClick={e => {
                            e.preventDefault();
                            setSelected('profile');
                        }}>
                        <Link className='user-icon mypage-nav-list__link' to='/c-account/profile'>
                            <figure>
                                <div className="prof-wrap">
                                    <img src={child_img} alt="avatar"/>
                                </div>
                            </figure>
                            <span>プロフィール</span>
                        </Link>
                    </li>
                    <li className={`mypage-nav-list__item -logout ${(selected == 'logout') && "nav-active"}`}
                        onClick={e => {
                            e.preventDefault();
                            setSelected('logout');
                        }}>

                        <a className="mypage-nav-list__link" onClick={handleLogout}>
                            <i className="icon log-out"></i><span>ログアウト</span>
                        </a>
                    </li>
                </ul>
            </nav>
        </div>
    );
}