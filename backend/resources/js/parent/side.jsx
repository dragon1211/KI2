import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'

export default function Side() {
    const [selected, setSelected] = useState('');

    const father_image = document.getElementById('father_image').value;

    const handleLogout = () => {
        axios.get('/p-account/logout')
        .then(() => location.href = '/p-account/login')
    }

    const handleSelected = (id) => {
        var navbar_list = document.getElementsByClassName("mypage-nav-list__item");
        for(let i=0; i<navbar_list.length; i++)
            navbar_list[i].classList.remove('nav-active');
        document.getElementsByClassName(id)[0].classList.add('nav-active');
        setSelected(id);
    }
    
    return (
        <div className="l-side">
            <div className="l-side-logo">
                <a href=""><img src="/assets/img/common/logo.svg" alt="ロゴ" /></a>
            </div>
            <nav className="mypage-nav">
                <ul className="mypage-nav-list">
                    <li className={`mypage-nav-list__item  -meeting  ${selected == '' && document.getElementById('p_router').value == 'meeting' && 'nav-active'}`}
                        onClick={e => handleSelected("-meeting")}>
                        <Link className='mypage-nav-list__link' to='/p-account/meeting'>
                            <i className="icon meeting"></i>
                            <span>ミーティング</span>
                        </Link>
                    </li>
                    <li className={`mypage-nav-list__item  -favorite  ${selected == '' && document.getElementById('p_router').value == 'favorite' && 'nav-active'}`}
                        onClick={e => handleSelected("-favorite")}>
                        <Link className='mypage-nav-list__link' to='/p-account/favorite'>
                            <i className="icon star"></i>
                            <span>お気に入り</span>
                        </Link>
                    </li>
                    <li className={`mypage-nav-list__item  -search  ${selected == '' && document.getElementById('p_router').value == 'search' && 'nav-active'}`}
                        onClick={e => handleSelected("-search")}>
                        <Link className='mypage-nav-list__link' to='/p-account/search'>
                            <i className="icon search"></i>
                            <span>検索</span>
                        </Link>
                    </li>
                    <li className={`mypage-nav-list__item  -child  ${selected == '' && document.getElementById('p_router').value == 'child' && 'nav-active'}`}
                        onClick={e => handleSelected("-child")}>
                        <Link className='mypage-nav-list__link' to='/p-account/child'>
                            <i className="icon parents"></i>
                            <span>子情報</span>
                        </Link>
                    </li>
                    <li className={`mypage-nav-list__item  -profile  ${selected == '' && document.getElementById('p_router').value == 'profile' && 'nav-active'}`}
                        onClick={e => handleSelected("-profile")}>
                        <Link className='user-icon mypage-nav-list__link' to='/p-account/profile'>
                            <figure>
                                <div className="prof-wrap">
                                    <img src={father_image} alt="image" />
                                </div>
                            </figure>
                            <span>プロフィール</span>
                        </Link>
                    </li>
                    <li className={`mypage-nav-list__item -logout ${(selected == '-logout') && "nav-active"}`}
                        onClick={e => handleSelected("-logout")}>
                        <a className="mypage-nav-list__link" onClick={handleLogout}>
                            <i className="icon log-out"></i><span>ログアウト</span>
                        </a>
                    </li>
                </ul>
            </nav>
        </div>
    );
}