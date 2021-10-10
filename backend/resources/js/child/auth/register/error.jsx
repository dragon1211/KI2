import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { Button } from '@material-ui/core';
import Alert from '../../../component/alert';


const SignUpError = () => {

    const gotoLogin = () => {
        window.location.href = "/login/c-account/";
    }

	return (
        <div>
            <p className="text-center font-weight-bold ft-20">本登録エラー</p>
            <span className="mt-80-px l-alert__text--error ft-16 ft-md-13">
                登録の経過時間が過ぎております。<br/>
                お手数ですが再度招待ユーザーに連絡し、再登録 の手続きをお願いいたします。
            </span>
            <div className="mt-4">
                <Button type="submit" fullWidth className="p-4 rounded-20 ft-16 ft-md-13 font-weight-bold text-black bg-color-2"
                     onClick={gotoLogin}>ログイン画面へ
                </Button>
            </div>
        </div>
	)
}



export default SignUpError;