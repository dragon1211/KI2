import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

import axios from 'axios';

import Notification from '../../component/notification';

const ProfileWithdrawal = () => {

    const handleSubmit = (e) => {
        e.preventDefault();
        // axios.delete('/api/children/delete/1')
        // .then(response => {
        //     if(response.data.status_code==200){
                
        //     }
        //     else if(response.data.status_code==400){
                
        //     }
        // })
        // .catch(err=>console.log(err))
    }
    
	return (
    <div className="l-content">
        <div className="l-content-w560">
            <div className="l-content__ttl">
                <div className="l-content__ttl__left">
                    <h2>退会確認</h2>
                </div>
                <Notification/>
            </div>

            <div className="l-content-wrap">
                <section className="edit-container">
                    <div className="edit-wrap">
                        <div className="edit-content">
            
                            <form className="edit-form" onSubmit={handleSubmit} noValidate>
                                <div className="edit-set-bg ft-xs-14">
                                    <p>本当に退会してもよろしいでしょうか？</p>
                                </div>
                                
                                <button type="submit" className="btn-edit btn-default btn-h70 btn-r20 btn-yellow ft-xs-15">退会する</button>
                            </form>
        
                        </div>
                    </div>
                </section>
            </div>
        </div>
    </div>
    )
}


export default ProfileWithdrawal;