import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const WithdrawalComplete = () => {
    const { pathname } = useLocation();
    var url;

    if(pathname.includes('c-account')) url = '/c-account/login';
    else if(pathname.includes('p-account')) url = '/p-account/login';
    
	return (
    <div className="l-single-container">
        <div className="l-single-inner">
            <p className="text-center font-weight-bold ft-25">退会完了</p>
            <div className="edit-set-bg u-mb30-lose u-mb25-gain ft-xs-16 mt-5">
                退会完了しました。<br/>
                今後とも、KIKI管理をよろしくお願いいたします。
            </div>
            <div className="text-center">
                <Link to={url} className="ft-xs-16">トップページへ戻る</Link>
            </div>
        </div>
    </div>
	)
}

export default WithdrawalComplete;