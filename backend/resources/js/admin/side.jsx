import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'

export default function Side() {
    const [selected, setSelected] = useState('');

    const handleLogout = () => {
        axios.get('/admin/logout')
        .then(() => location.href = '/admin/login')
    }

    return (
        <div className="l-side">
            <div className="l-side-logo">
                <a href=""><img src="/assets/img/common/logo.svg" alt="ロゴ" /></a>
            </div>
            <nav className="mypage-nav">
                <ul className="mypage-nav-list">
                    <li 
                        className={`mypage-nav-list__item  ${(selected == 'meeting' || (selected == '' && document.getElementById('admin_router').value == 'meeting')) && "nav-active"}`}
                        onClick={e => {
                            e.preventDefault();
                            setSelected('meeting');
                        }}>
                        <Link className='mypage-nav-list__link' to='/admin/meeting'>
                            <i className="icon meeting"></i>
                            <span>ミーティング</span>
                        </Link>
                    </li>
                    
                    <li className={`mypage-nav-list__item  ${ (selected == 'child' || (selected == '' && document.getElementById('admin_router').value == 'child')) && "nav-active"}`}
                        onClick={e => {
                            e.preventDefault();
                            setSelected('child');
                        }}>
                        <Link className='mypage-nav-list__link' to='/admin/child'>
                            <i className="icon parents"></i>
                            <span>子情報</span>
                        </Link>
                    </li>

                    <li className={`mypage-nav-list__item  ${ (selected == 'parent' || (selected == '' && document.getElementById('admin_router').value == 'parent')) && "nav-active"}`}
                        onClick={e => {
                            e.preventDefault();
                            setSelected('parent');
                        }}>
                        <Link className='mypage-nav-list__link' to='/admin/parent'>
                            <i className="icon parents"></i>
                            <span>親情報</span>
                        </Link>
                    </li>
                    
                    <li className={`mypage-nav-list__item  ${(selected == 'logout') && "nav-active"}`}
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