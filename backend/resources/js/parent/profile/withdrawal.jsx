import React, { useState } from 'react';
import { LoadingButton } from '@material-ui/lab';
import Notification from '../../component/notification';
import Alert from '../../component/alert';

const ParentProfileWithdrawal = () => {

    const father_id = localStorage.getItem('kiki_acc_id');
    const [notice, setNotice] = useState(localStorage.getItem('notice'));
    
    const [submit, setSubmit] = useState(false);
    const [_400error, set400Error] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmit(true);
        
        await axios.delete('/api/fathers/withdrawal', {params:{father_id: father_id}})
        .then(response => {
            setSubmit(false);
            setNotice(response.data.notice);
            switch(response.data.status_code){
                case 200: window.location.href = "/p-account/withdrawal/complete"; break;
                case 400: set400Error("失敗しました。"); break;
            }
        })
    }
    
	return (
    <div className="l-content">
        <div className="l-content-w560">
            <div className="l-content__ttl">
                <div className="l-content__ttl__left">
                    <h2>退会確認</h2>
                </div>
                <Notification notice={notice}/>
            </div>

            <div className="l-content-wrap">
                <section className="edit-container">
                    <div className="edit-wrap">
                        <div className="edit-content">
                            <form className="edit-form" onSubmit={handleSubmit} noValidate>
                                <div className="edit-set-bg ft-xs-16">
                                    <p>本当に退会してもよろしいでしょうか？</p>
                                </div>
                                <div>
                                    <LoadingButton type="submit" fullWidth 
                                        loading = {submit}
                                        className="btn-edit btn-default btn-h75 bg-yellow rounded-20">
                                        <span className={`ft-16 font-weight-bold ${!submit && 'text-black'}`}>退会する</span>
                                    </LoadingButton>
                                </div>
                            </form>
                        </div>
                    </div>
                    {  _400error &&  <Alert type="fail" hide={()=>set400Error('')}>{_400error}</Alert> } 
                </section>
            </div>
        </div>
    </div>
    )
}


export default ParentProfileWithdrawal;