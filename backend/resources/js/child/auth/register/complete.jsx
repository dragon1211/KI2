import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { Button } from '@material-ui/core';
import Alert from '../../../component/alert';


const SignUpComplete = () => {

    const gotoLogin = () => {
        window.location.href = "/login/c-account/";
    }

	return (
        <div>
            <p className="text-center font-weight-bold ft-20">本登録完了</p>
            <span className="mt-80-px ft-16 ft-md-13 l-alert__text--success">
                本登録が完了しました。<br/>
                ログイン画面より、ログインを行ってください。
            </span>
            <div className="mt-4">
                <Button type="submit" fullWidth className="p-4 rounded-20 ft-16 ft-md-13 font-weight-bold text-black bg-yellow" 
                    onClick={gotoLogin}>ログイン画面へ
                </Button>
            </div>
        </div>
	)
}



export default SignUpComplete;