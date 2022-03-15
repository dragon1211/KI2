import React, { useEffect, useState } from 'react';
import { Button } from '@material-ui/core';
import { useNavigate, useLocation } from 'react-router-dom';

const PasswordResetComplete = () => {

    const navigator = useNavigate();
    const { pathname } = useLocation();

    const gotoLogin = () => {
        navigator(`/${pathname.split('/')[1]}/login`);
    }

	return (
    <div className="l-single-container">
        <div className="l-single-inner">
            <p className="text-center font-weight-bold ft-25">登録完了</p>
            <span className="mt-80-px ft-18 ft-xs-16 l-alert__text--success">
                パスワードの更新が完了しました。<br/>
                ログイン画面に遷移して、新しいパスワードをご利用ください。
            </span>
            <div className="mt-5">
                <Button type="submit" fullWidth 
                    className="btn-edit btn-default btn-h75 bg-yellow rounded-20"
                    onClick={gotoLogin}>
                    <span className="ft-16 font-weight-bold text-black">ログイン画面へ</span>
                </Button>
            </div>
        </div>
    </div>
	)
}



export default PasswordResetComplete;