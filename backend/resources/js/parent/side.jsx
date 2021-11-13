import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'

export default function Side() {
    const [selected, setSelected] = useState('');

    const father_image = document.getElementById('father_image').value;

    const handleLogout = () => {
        axios.get('/p-account/logout')
        .then(() => location.href = '/p-account/login')
    }
    return (
        <div className="l-side">
            <div className="l-side-logo">
                <a href=""><img src="../../../assets/img/common/logo.svg" alt="ロゴ" /></a>
            </div>
            <nav className="mypage-nav">
                <ul className="mypage-nav-list">
                    <li 
                        className={ (selected == 'meeting' || (selected == '' && document.getElementById('p_router').value == 'meeting')) ? "mypage-nav-list__item nav-active" : "mypage-nav-list__item" }
                        onClick={e => {
                            e.preventDefault();
                            setSelected('meeting');
                        }}>
                        <Link className='mypage-nav-list__link' to='/p-account/meeting'>
                            <i className="icon meeting"></i>
                            <span>ミーティング</span>
                        </Link>
                    </li>
                    <li 
                        className={ (selected == 'favorite' || (selected == '' && document.getElementById('p_router').value == 'favorite')) ? "mypage-nav-list__item -favorite nav-active" : "mypage-nav-list__item -favorite" }
                        onClick={e => {
                            e.preventDefault();
                            setSelected('favorite');
                        }}>
                        <Link className='mypage-nav-list__link' to='/p-account/favorite'>
                            <i className="icon star"></i>
                        </Link>
                    </li>
                    <li className={ (selected == 'search' || (selected == '' && document.getElementById('p_router').value == 'search')) ? "mypage-nav-list__item nav-active" : "mypage-nav-list__item" }
                        onClick={e => {
                            e.preventDefault();
                            setSelected('search');
                        }}>
                        <Link className='mypage-nav-list__link' to='/p-account/search'>
                            <i className="icon search"></i>
                            <span>検索</span>
                        </Link>
                    </li>
                    <li className={ (selected == 'child' || (selected == '' && document.getElementById('p_router').value == 'child')) ? "mypage-nav-list__item nav-active" : "mypage-nav-list__item" }
                        onClick={e => {
                            e.preventDefault();
                            setSelected('child');
                        }}>
                        <Link className='mypage-nav-list__link' to='/p-account/child'>
                            <i className="icon parents"></i>
                            <span>子情報</span>
                        </Link>
                    </li>
                    <li className={ (selected == 'profile' || (selected == '' && document.getElementById('p_router').value == 'profile')) ? "mypage-nav-list__item nav-active" : "mypage-nav-list__item" }
                        onClick={e => {
                            e.preventDefault();
                            setSelected('profile');
                        }}>
                        <Link className='user-icon mypage-nav-list__link' to='/p-account/profile'>
                            <figure>
                                <div className="prof-wrap">
                                    <img src={father_image} alt="image" />
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