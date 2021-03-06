import React, { useState } from 'react';
import { Button } from '@material-ui/core';
import Alert from '../../component/alert';
import copy from 'copy-to-clipboard';


const ContactComplete = () => {

    const contactEmail = '56@zotman.jp';
    const [_success, setSuccess] = useState('');
    const [_error, setError] = useState('');

    const saveStorage = () => {
        if(copy(contactEmail)){
            setSuccess('メールアドレスのコビーに成功しました')
        } else {
            setError('コピー失敗しました。')
        }
    }

	return (
    <div className="l-single-container">
        <div className="l-single-inner">
            <p className="text-center font-weight-bold ft-25">お問い合わせ完了</p>
            <span className="mt-80-px ft-16 ft-md-16 l-alert__text--success">
                お問い合わせが完了しました。<br/>
                3営業日以内にお返事させていただきます。<br/><br/>
                万が一届かない場合は、以下のメールアドレスに 直接ご連絡くださいませ。
            </span>

            <div className="clip-copy" onClick={saveStorage}>
                <a>{contactEmail}</a>
            </div>

            <div className="d-flex justify-content-between">
                <div className="w-50 pr-1">
                    <Button fullWidth className="btn-edit btn-default btn-h75 bg-yellow rounded-20" onClick={()=>{window.location.href="/p-account/login"}}>
                        <span className="ft-18 ft-xs-16 font-weight-bold text-black">親ログイン画面へ</span>
                    </Button>
                </div>
                <div className="w-50 pl-1">
                    <Button fullWidth className="btn-edit btn-default btn-h75 bg-yellow rounded-20"  onClick={()=>{window.location.href="/c-account/login"}}>
                        <span className="ft-18 ft-xs-16 font-weight-bold text-black">子ログイン画面へ</span>
                    </Button>
                </div>
            </div>
            {  _success &&  <Alert type="success" hide={()=>setSuccess('')}>{_success}</Alert> }
            { _error && <Alert type="fail" hide={()=>setError('')}>{_error}</Alert> }
        </div>
    </div>
	)
}


export default ContactComplete;