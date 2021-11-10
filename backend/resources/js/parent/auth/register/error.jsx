import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';


const ParentSignUpError = () => {

    const history = useHistory();

    const gotoLogin = () => {
        history.push({pathname: '/c-account/login',  state: {}});
    }

	return (
        <div>
            <p className="text-center font-weight-bold ft-25">本登録エラー</p>
            <span className="mt-80-px l-alert__text--error ft-18 ft-xs-16">
                登録の経過時間が過ぎております。<br/>
                お手数ですが再度招待ユーザーに連絡し、再登録 の手続きをお願いいたします。
            </span>
        </div>
	)
}



export default ParentSignUpError;