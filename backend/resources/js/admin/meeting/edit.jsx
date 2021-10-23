import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { CircularProgress  } from '@material-ui/core';

import { LoadingButton } from '@material-ui/lab';


const MeetingEdit = (props) => {
    const [meeting, setMeeting] = useState(null);
    const [title, setTitle] = useState('');
    const [memo, setMemo] = useState('');
    const [text, setText] = useState('');
    const [pdf, setPdf] = useState('');

    const [_422errors, set422Errors] = useState({title:'', text:'', memo:'', pdf:''})

    const [loaded, setLoaded] = useState(false);
    const [submit, setSubmit] = useState(false);

    useEffect(() => {
        setLoaded(false);

        axios.get(`/api/admin/meetings/detail/${props.match.params?.meeting_id}`, {params: { father_id: 1 }})
        .then((response) => {
            setLoaded(true);
            if(response.data.status_code==200){
                console.log(response.data.params[0]);
                setMeeting(response.data.params[0]);
                setTitle(response.data.params[0]?.title);
                setMemo(response.data.params[0]?.memo);
                setText(response.data.params[0]?.text);
            } else if(response.data.status_code==400){
                //TODO
            }
        });
      }, []);

     async function handleSubmit() {

        set422Errors({
          title:'',
          memo:'',
          text:'',
          pdf:'',
          images:''
        });
    
        try {
          const formdata = new FormData();
          formdata.append('father_id', fatherId);
          formdata.append('title', title);
          formdata.append('memo', memo);
          formdata.append('text', text);
        //   formdata.append('pdf', pdf);
        //   formdata.append('images', images);

        setSubmit(true);
    
        //   axios.post('/api/meetings/register', formdata)
        //     .then(response => {
        //       if(response.data.status_code==200){
        //         history.push({
        //           pathname: "/p-account/meetings/detail/1",
        //           state: {message : "ミーティングを作成しました！"}
        //         });
        //       } else {
        //         setMessageAlert('error');
        //         setShowAlert(true);
        //       }
        //     });
        } catch (error) {
          console.log('error', error);
        }
      }


	return (
        <div className="l-content">
            <div className="l-content-w560">
                <div className="l-content__ttl">
                    <div className="l-content__ttl__left">
                        <h2>ミーティング編集</h2>
                    </div>
                </div>
        
                <div className="l-content-wrap">
                    <div className="p-article">
                    <div className="p-article-wrap position-relative" style={{ minHeight:'500px'}}>
                    {
                        !loaded &&
                        <CircularProgress color="secondary" style={{top:'150px',  left:'calc(50% - 22px)', color:'green', position:'absolute'}}/>
                    }
                    {
                        loaded && 
                        <article className="p-article__body">
                            <div className="p-article__content">       
                                <div className="p-article__context">
                                    <form className="edit-form" onSubmit={handleSubmit}>
                                        <div className="edit-set">
                                            <label className="control-label" htmlFor="title">タイトル</label>
                                            <input type="text" name="title"   value={ title } onChange={e=>setTitle(e.target.value)} className={`input-default input-title input-h60 input-w480 ${  _422errors.title && 'is-invalid c-input__target'} `} id="title" />
                                            {
                                                _422errors.title &&
                                                    <span className="l-alert__text--error ft-16 ft-md-14">
                                                        {_422errors.title}
                                                    </span> 
                                            }
                                        </div>
                                        <div className="edit-set">
                                            <label className="control-label" htmlFor="meeting_textarea">本文</label>
                                            <textarea value={ text } onChange={e=>setText(e.target.value)} rows="8" className={`textarea-default  ${  _422errors.text && 'is-invalid c-input__target'} `}  id="meeting_textarea" />
                                            {
                                                _422errors.text &&
                                                    <span className="l-alert__text--error ft-16 ft-md-14">
                                                        {_422errors.text}
                                                    </span> 
                                            }
                                        </div>
                                        <div className="edit-set">
                                            <label className="control-label" htmlFor="meeting_textarea">メモ</label>
                                            <textarea value={ memo } onChange={e=>setMemo(e.target.value)}  rows="8" className={`textarea-default  ${  _422errors.memo && 'is-invalid c-input__target'} `} id="meeting_textarea" />
                                            {
                                                _422errors.memo &&
                                                    <span className="l-alert__text--error ft-16 ft-md-14">
                                                        {_422errors.memo}
                                                    </span> 
                                            }
                                        </div>
                                        <div className="edit-set edit-set-mt15">
                                            <label className="edit-set-file-label" htmlFor="file_pdf">
                                                PDFアップロード
                                                <input type="file" name="file_pdf" accept=".pdf" id="file_pdf" />
                                            </label> 
                                            {
                                                _422errors.pdf &&
                                                  <span className="l-alert__text--error ft-16 ft-md-14">
                                                      {_422errors.pdf}
                                                  </span> 
                                            }
                                        </div>
                                        <div className="edit-set edit-set-mt15">
                                            <label className="edit-set-file-label" htmlFor="file_image">
                                                画像アップロード
                                                <input type="file" name="file_image" accept=".png, .jpg, .jpeg" id="file_image" /> 
                                            </label>
                                            {
                                                _422errors.pdf &&
                                                  <span className="l-alert__text--error ft-16 ft-md-14">
                                                      {_422errors.pdf}
                                                  </span> 
                                            }
                                        </div>
                                        
                                        <div className="p-file-image">
                                            <figure className="image-upload"><img src="../../../assets/img/dummy/post-dummy01.jpg" alt="" /></figure>
                                            <figure className="image-upload"><img src="../../../assets/img/dummy/post-dummy02.jpg" alt="" /></figure>
                                            <figure className="image-upload"><img src="../../../assets/img/dummy/post-dummy03.jpg" alt="" /></figure>
                                            <figure className="image-upload"><img src="../../../assets/img/dummy/post-dummy04.jpg" alt="" /></figure>
                                            <figure className="image-upload"><img src="../../../assets/img/dummy/post-dummy05.jpg" alt="" /></figure>
                                            <figure className="image-upload"><img src="../../../assets/img/dummy/post-dummy01.jpg" alt="" /></figure>
                                            <figure className="image-upload"><img src="../../../assets/img/dummy/post-dummy02.jpg" alt="" /></figure>
                                            <figure className="image-upload"><img src="../../../assets/img/dummy/post-dummy03.jpg" alt="" /></figure>
                                            <figure className="image-upload"><img src="../../../assets/img/dummy/post-dummy04.jpg" alt="" /></figure>
                                            <figure className="image-upload"><img src="../../../assets/img/dummy/post-dummy05.jpg" alt="" /></figure>
                                        </div>
                
                                        <div className="edit-set edit-set-send">
                                            <label htmlFor="allmember_send">
                                            <input className="boolean optional" type="checkbox" name="allmember_send" id="allmember_send" />全員に送信</label>
                                        </div>
                
                                        <div className="edit-set-mt5 edit-set-send">
                                            <label htmlFor="pickup_send">
                                            <input className="boolean optional" type="checkbox" name="pickup_send" id="pickup_send" />選んで送信</label>
                                        </div>
                
                                        <div className="checkbox-wrap edit-bg">
                                            <div className="checkbox">
                                                <label htmlFor="user_name01">
                                                <input className="boolean optional" type="checkbox" name="chk[]" id="user_name01" />田中 達也</label>
                                            </div>
                                            <div className="checkbox">
                                                <label htmlFor="user_name02">
                                                <input className="boolean optional" type="checkbox" name="chk[]" id="user_name02" />田中 達也</label>
                                            </div>
                                            <div className="checkbox">
                                                <label htmlFor="user_name03">
                                                <input className="boolean optional" type="checkbox" name="chk[]" id="user_name03" />田中 達也</label>
                                            </div>
                                            <div className="checkbox">
                                                <label htmlFor="user_name04">
                                                <input className="boolean optional" type="checkbox" name="chk[]" id="user_name04" />田中 達也</label>
                                            </div>
                                            <div className="checkbox">
                                                <label htmlFor="user_name05">
                                                <input className="boolean optional" type="checkbox" name="chk[]" id="user_name05" />田中 達也</label>
                                            </div>
                                        </div>
                
                                        <LoadingButton 
                                            type="submit" 
                                            loading={submit}
                                            className="btn-edit btn-default btn-h70 btn-r14 btn-yellow rounded-20"
                                            style={{fontSize:'18px',fontWeight:'bold', backgroundColor:'#ffed4a'}}>ミーティングを更新</LoadingButton>
                                    </form>
                                </div>     
                            </div>
                        </article>
                    }
                        
                    </div>
                    </div>
                </div>
            </div>
        </div>   
	)
}

export default MeetingEdit;