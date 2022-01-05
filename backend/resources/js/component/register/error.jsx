import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Alert from '../alert';

const SignUpError = () => {

    const [_400error, set400Error] = useState(useLocation().state);
	return (
    <div className="l-single-container">
        <div className="l-single-inner">
            <p className="text-center font-weight-bold ft-25">本登録エラー</p>
            <span className="mt-80-px l-alert__text--error ft-18 ft-xs-16">
                登録の経過時間が過ぎております。<br/>
                お手数ですが再度招待ユーザーに連絡し、再登録の手続きをお願いいたします。
            </span>
            { _400error && <Alert type="fail"  hide={()=>set400Error('')}>{_400error}</Alert> }
        </div>
    </div>
	)
}

export default SignUpError;