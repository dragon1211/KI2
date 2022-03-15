import React, { useContext, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HeaderContext } from '../context';

export default function AdminSide() {

    const {
        selected_item_sidebar, 
        SetSelectedItemOfSidebar, 
        handleLogout
    } = useContext(HeaderContext);

    const {pathname} = useLocation();
    
    useEffect(()=>{
        SetSelectedItemOfSidebar(pathname.split('/')[2]);
    }, []);

    return (
        <div className="l-side">
            <div className="l-side-logo">
                <a href=""><img src="/assets/img/common/logo_w.svg" alt="ロゴ" /></a>
            </div>
            <nav className="mypage-nav">
                <ul className="mypage-nav-list">
                    <li
                        className={`mypage-nav-list__item  ${selected_item_sidebar == 'meeting' && "nav-active"}`}
                        onClick={e => {
                            SetSelectedItemOfSidebar('meeting');
                        }}>
                        <Link className='mypage-nav-list__link' to='/admin/meeting'>
                            <i className="icon meeting"></i>
                            <span>ミーティング</span>
                        </Link>
                    </li>

                    <li className={`mypage-nav-list__item  ${ selected_item_sidebar == 'child' && "nav-active"}`}
                        onClick={e => {
                            SetSelectedItemOfSidebar('child');
                        }}>
                        <Link className='mypage-nav-list__link' to='/admin/child'>
                            <i className="icon parents"></i>
                            <span>子情報</span>
                        </Link>
                    </li>

                    <li className={`mypage-nav-list__item  ${ selected_item_sidebar == 'parent' && "nav-active"}`}
                        onClick={e => {
                            SetSelectedItemOfSidebar('parent');
                        }}>
                        <Link className='mypage-nav-list__link' to='/admin/parent'>
                            <i className="icon parents"></i>
                            <span>親情報</span>
                        </Link>
                    </li>

                    <li className={`mypage-nav-list__item  ${ selected_item_sidebar == 'logout' && "nav-active"}`}
                        onClick={e => {
                            SetSelectedItemOfSidebar('logout');
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
