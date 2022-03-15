import React, { useState } from 'react';
import { Button } from '@material-ui/core';
import { useNavigate, useLocation } from 'react-router-dom';
import Alert from '../alert';

const SignUpComplete = () => {

    const navigator = useNavigate();

    const { pathname, state } = useLocation();
    const [_success, setSuccess] = useState(state);

    const gotoLogin = () => {
        var url;
        if(pathname.includes('c-account')) url = '/c-account/login';
        else if(pathname.includes('p-account')) url = '/p-account/login';

        navigator(url,  {state: ''});
    }

	return (
    <div className="l-single-container">
        <div className="l-single-inner">
            <p className="text-center font-weight-bold ft-25">本登録完了</p>
            <span className="mt-80-px ft-18 ft-md-16 l-alert__text--success">
                本登録が完了しました。<br/>
                ログイン画面より、ログインを行ってください。
            </span>
            <div className="mt-5">
                <Button type="submit" fullWidth
                    className="btn-edit btn-default btn-h75 bg-yellow rounded-20"
                    onClick={gotoLogin}>
                    <span className="ft-16 font-weight-bold text-black">ログイン画面へ</span>
                </Button>
            </div>
        </div>
        { _success && <Alert type="success"  hide={()=>setSuccess('')}>{_success}</Alert> }
    </div>
	)
}



export default SignUpComplete;
