import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { HeaderContext } from '../context';

const Notification = ({ notice }) => {

    const {selected_item_sidebar, SetSelectedItemOfSidebar} = useContext(HeaderContext);
    
    const navigator = useNavigate();
    const { pathname } = useLocation();
    const [number, setNumber] = useState(-1);

    const handleClick = () => {
        SetSelectedItemOfSidebar('meeting');
        navigator(`/${pathname.split('/')[1]}/meeting`);
    }

    useEffect(()=>{

        let token = localStorage.getItem(`${pathname.split('/')[1]}_token`);
        if(!token) return;
        token = JSON.parse(token);
        if(notice < 0){
            setNumber(token.notice);
        } else {
            token.notice = notice;
            localStorage.setItem(`${pathname.split('/')[1]}_token`, JSON.stringify(token));
            setNumber(notice);
        }
    }, [notice]);

	return (
    <div className="p-notification" onClick={handleClick}>
        <div className="p-notification-icon">
            <div className="p-notification-icon-wrap">
                {
                    number > 0 &&
                    <div className="count">{number}</div>
                }
                <div className="p-notification-icon-bg"></div>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22.742 19.855" className="icon svg-icon svg-fill svg-y50" ><g fill="none" stroke="#080808" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" data-name="Icon feather-alert-triangle" transform="translate(0.777 0.75)"><path d="M11.188,5.322,2.6,19.659A2.028,2.028,0,0,0,4.334,22.7H21.51a2.028,2.028,0,0,0,1.734-3.042L14.656,5.322a2.028,2.028,0,0,0-3.468,0Z" data-name="パス 3" transform="translate(-2.328 -4.346)"/><path d="M18,13.5v6.91" data-name="パス 4" transform="translate(-7.406 -8.547)"/><path d="M18,25.5h0" data-name="パス 5" transform="translate(-7.406 -11.2)"/></g></svg>
            </div>
        </div>
    </div>
    )
}

export default Notification;