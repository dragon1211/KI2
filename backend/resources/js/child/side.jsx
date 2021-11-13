import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'

export default function Side() {
    const [selected, setSelected] = useState('');

    const child_img = document.getElementById('child_image').value;

    const handleLogout = () => {
        axios.get('/c-account/logout')
        .then(() => location.href = '/c-account/login')
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
                    <li 
                        className={`mypage-nav-list__item -meeting ${(selected == '' && document.getElementById('c_router').value == 'meeting') && "nav-active"}`}
                        onClick={e => handleSelected("-meeting")}>
                        <Link className='mypage-nav-list__link' to='/c-account/meeting'>
                            <i className="icon meeting"></i>
                            <span>ミーティング</span>
                        </Link>
                    </li>
                    <li className={`mypage-nav-list__item -search ${ (selected == '' && document.getElementById('c_router').value == 'search') && "nav-active"}`}
                        onClick={e => handleSelected("-search")}>
                        <Link className='mypage-nav-list__link' to='/c-account/search'>
                            <i className="icon search"></i>
                            <span>検索</span>
                        </Link>
                    </li>
                    <li className={`mypage-nav-list__item -parentinfo ${ (selected == '' && document.getElementById('c_router').value == 'parent') && "nav-active"}`}
                        onClick={e => handleSelected("-parentinfo")}>
                        <Link className='mypage-nav-list__link' to='/c-account/parent'>
                            <i className="icon parents"></i>
                            <span>親情報</span>
                        </Link>
                    </li>
                    
                    <li className={`mypage-nav-list__item -profile ${ (selected == '' && document.getElementById('c_router').value == 'profile') && "nav-active"}`}
                        onClick={e => handleSelected("-profile")}>
                        <Link className='user-icon mypage-nav-list__link' to='/c-account/profile'>
                            <figure>
                                <div className="prof-wrap">
                                    <img src={child_img} alt="avatar"/>
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