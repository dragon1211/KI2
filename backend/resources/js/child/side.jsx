import React, { useContext, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HeaderContext } from '../context';


export default function ChildSide() {

    const {
        selected_item_sidebar, 
        SetSelectedItemOfSidebar,
        handleLogout
    } = useContext(HeaderContext);

    const {pathname} = useLocation();

    useEffect(()=>{
        SetSelectedItemOfSidebar(pathname.split('/')[2]);
    }, [])


    return (
        <div className="l-side">
            <div className="l-side-logo">
                <a href=""><img src="/assets/img/common/logo_w.svg" alt="ロゴ" /></a>
            </div>
            <nav className="mypage-nav">
                <ul className="mypage-nav-list">
                    <li 
                        className={`mypage-nav-list__item -meeting ${ selected_item_sidebar == 'meeting' && "nav-active"}`}
                        onClick={e => SetSelectedItemOfSidebar('meeting')}>
                        <Link className='mypage-nav-list__link' to='/c-account/meeting'>
                            <i className="icon meeting"></i>
                            <span>ミーティング</span>
                        </Link>
                    </li>
                    <li className={`mypage-nav-list__item -search ${ selected_item_sidebar == 'search' && "nav-active"}`}
                        onClick={e => SetSelectedItemOfSidebar('search')}>
                        <Link className='mypage-nav-list__link' to='/c-account/search'>
                            <i className="icon search"></i>
                            <span>検索</span>
                        </Link>
                    </li>
                    <li className={`mypage-nav-list__item -parentinfo ${ selected_item_sidebar == 'parent' && "nav-active"}`}
                        onClick={e => SetSelectedItemOfSidebar('parent')}>
                        <Link className='mypage-nav-list__link' to='/c-account/parent'>
                            <i className="icon parents"></i>
                            <span>親情報</span>
                        </Link>
                    </li>
                    
                    <li className={`mypage-nav-list__item -profile ${ selected_item_sidebar == 'profile' && "nav-active"}`}
                        onClick={e => SetSelectedItemOfSidebar('profile')}>
                        <Link className='user-icon mypage-nav-list__link' to='/c-account/profile'>
                            <figure>
                                <div className="prof-wrap">
                                    <img src={document.getElementById('child_image').value} alt="avatar"/>
                                </div>
                            </figure>
                            <span>プロフィール</span>
                        </Link>
                    </li>
                    <li className={`mypage-nav-list__item -logout ${ selected_item_sidebar == 'logout' && "nav-active"}`}
                        onClick={e => SetSelectedItemOfSidebar('logout')}>

                        <a className="mypage-nav-list__link" onClick={handleLogout}>
                            <i className="icon log-out"></i><span>ログアウト</span>
                        </a>
                    </li>
                </ul>
            </nav>
        </div>
    );
}