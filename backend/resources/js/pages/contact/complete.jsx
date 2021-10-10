import React, { useState } from 'react';
import { Button } from '@material-ui/core';
import Alert from '../../component/alert';



const ContactComplete = () => {

    const [contactEmail, SetContactEmail] = useState('sample@gmail.com');
    const [saveFlag, SetSaveFlag] = useState(false);

    const saveStorage = () => {
        navigator.clipboard.writeText(contactEmail).then(function() {
            SetSaveFlag(true);
        })
    }

	return (
        <div>
            <p className="text-center font-weight-bold ft-20">お問い合わせ完了</p>
            <span className="mt-80-px ft-16 ft-md-13 l-alert__text--success">
                お問い合わせが完了しました。<br/>
                3営業日以内にお返事させていただきます。<br/><br/>
                万が一届かない場合は、以下のメールアドレスに 直接ご連絡くださいませ。
            </span>

            <div className="p-3 my-5 border text-center font-weight-bold">
                <p className="m-0 scale-1 pointer ft-xs-16" onClick={saveStorage}>{contactEmail}</p>
            </div>

            <div className="d-flex justify-content-between">
                <div className="w-50 pr-1">
                    <Button fullWidth className="p-4 rounded-20 ft-16 ft-md-13 font-weight-bold text-black bg-color-2" onClick={()=>{window.location.href="/login/p-account/"}}>親ログイン画面へ</Button>
                </div>
                <div className="w-50 pl-1">
                    <Button fullWidth className="p-4 rounded-20 ft-16 ft-md-13 font-weight-bold text-black bg-color-2"  onClick={()=>{window.location.href="/login/c-account/"}}>子ログイン画面へ</Button>
                </div>
            </div>
            {
                saveFlag && <Alert type="success" hide={()=>SetSaveFlag(false)}>メールアドレスのコビーに成功しました!</Alert>
            }
        </div>
	)
}


export default ContactComplete;