import React, { useState } from 'react';
import { Button } from '@material-ui/core';
import axios from 'axios';

import { CircularProgress  } from '@material-ui/core';



const ForgotPassword = () => {

    const [phone, setPhone] = useState('');

    const [loading, setLoading] = useState(false);
    const [_422errors, set422errors] = useState({phone:''})
    const [_400error, set400Error] = useState('')

    const handleSubmit = (e) => {

        e.preventDefault();

        const formdata = new FormData();
        formdata.append('tel', phone);

        // axios.post('/api/children/checkTel/', formdata)
        // .then(response => {
        //     if(response.data.status_code==200){
        //         set400Error({status:'success', msg:"パスワード再設定用URLをSMSで送信しました。<br> 1時間以内にパスワードの再設定を行ってくださ い。"})
        //     }
        //     elseif(response.data.status_code == 201)
        //     {
        //         set400Error({status:'success', msg:"子に招待URLの送信に成功しました！"})
        //     }
        //     elseif(response.data.status_code == 400)
        //     {
        //         set400Error({status:'error', msg:"電話番号が未登録です。別の電話番号を入力してください。"})
        //     }
        //     elseif(response.data.status_code == 401)
        //     {
        //         set400Error({status:'error', msg:"SNSの送信に失敗しました。管理者へお問い合わせください。"})
        //     }
        //     elseif(response.data.status_code == 422)
        //     {
        //         set400Error({status:'error', msg:"電話番号が正しくありません。"})
        //     }
        // })
        // .catch(err=>console.log(err))
    }


	return (
        <form onSubmit={handleSubmit} noValidate>
            <p className="pb-40-px text-center font-weight-bold ft-20">パスワードを忘れた方</p>
            {
                _400error.length != 0 && 
                <div className="mt-40-px">
                    <span className="l-alert__text--error ft-16 ft-md-14">
                        {_400error}
                    </span>
                </div>
            }
           
            <div className="edit-set">
                <label htmlFor="phone"   className="control-label ft-14 ft-md-12"> 電話番号 </label>
                <input type="text" name="phone" id="phone" className={`input-default input-h60 input-w480 ${ _422errors.phone && "is-invalid  c-input__target" }`}  value={phone} onChange={e=>setPhone(e.target.value)} autoFocus/>
                {   
                    _422errors.phone && 
                        <span className="l-alert__text--error ft-16 ft-md-14">
                            {_422errors.phone}
                        </span> 
                }
            </div>
          
            <div className="mt-5">
                <Button type="submit" fullWidth className="p-4 rounded-20 ft-15 ft-md-13 font-weight-bold text-black bg-color-2">
                    パスワード再設定URLを送信
                </Button>
            </div>

            { 
                loading &&  <div style={{position: 'fixed', left: 'calc( 50% - 20px)', top:'45%'}}> <CircularProgress /></div>
            }
        </form>
	)
}


export default ForgotPassword;