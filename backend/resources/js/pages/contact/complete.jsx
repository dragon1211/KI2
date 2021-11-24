import React, { useState } from 'react';
import { Button } from '@material-ui/core';
import Alert from '../../component/alert';
import copy from 'clipboard-copy';


const ContactComplete = () => {

    const contactEmail = 'sample@gmail.com';
    const [_success, setSuccess] = useState('');

    const saveStorage = () => {
        copy(contactEmail);
        setSuccess('メールアドレスのコビーに成功しました');
    }

	return (
        <div>
            <p className="text-center font-weight-bold ft-25">お問い合わせ完了</p>
            <span className="mt-80-px ft-16 ft-md-16 l-alert__text--success">
                お問い合わせが完了しました。<br/>
                3営業日以内にお返事させていただきます。<br/><br/>
                万が一届かない場合は、以下のメールアドレスに 直接ご連絡くださいませ。
            </span>

            <div className="p-4 my-5 border text-center font-weight-bold">
                <p className="m-0 scale-1 pointer ft-xs-18" onClick={saveStorage}>{contactEmail}</p>
            </div>

            <div className="d-flex justify-content-between">
                <div className="w-50 pr-1">
                    <Button fullWidth className="btn-edit btn-default btn-h75 bg-yellow rounded-20" onClick={()=>{window.location.href="/p-account/login"}}>
                        <span className="ft-20 ft-xs-16 font-weight-bold text-black">親ログイン画面へ</span>
                    </Button>
                </div>
                <div className="w-50 pl-1">
                    <Button fullWidth className="btn-edit btn-default btn-h75 bg-yellow rounded-20"  onClick={()=>{window.location.href="/c-account/login"}}>
                        <span className="ft-20 ft-xs-16 font-weight-bold text-black">子ログイン画面へ</span>
                    </Button>
                </div>
            </div>
            {  _success &&  <Alert type="success" hide={()=>setSuccess('')}>{_success}</Alert> }
        </div>
	)
}


export default ContactComplete;