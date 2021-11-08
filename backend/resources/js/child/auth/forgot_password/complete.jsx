import React, { useEffect, useState } from 'react';
import { Button } from '@material-ui/core';
import { useHistory } from 'react-router';

const ChildForgotPasswordComplete = () => {

    const history = useHistory();

    const gotoLogin = () => {
        history.push({pathname: '/c-account/login',  state: {}});
    }

	return (
        <div>
            <p className="text-center font-weight-bold ft-25">本登録完了</p>
            <span className="mt-80-px ft-18 ft-md-15 l-alert__text--success">
                本登録が完了しました。<br/>
                ログイン画面より、ログインを行ってください。
            </span>
            <div className="mt-5">
                <Button type="submit" fullWidth 
                    className="btn-edit btn-default btn-h60 bg-yellow rounded-20 py-5"
                    onClick={gotoLogin}>
                    <span className="ft-16 font-weight-bold text-black">ログイン画面へ</span>
                </Button>
            </div>
        </div>
	)
}



export default ChildForgotPasswordComplete;