import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MeetingEdit = (props) => {
    const [meeting, setMeeting] = useState(null);
    const [title, setTitle] = useState(null);
    const [memo, setMemo] = useState(null);
    const [text, setText] = useState(null);
    const fatherId = document.getElementById('father_id').value;
    useEffect(() => {
        axios.get(`/api/meetings/detail/${props.match.params?.id}`, {params: { father_id: 1 }}).then((response) => {
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

     async function handleClick() {
        // setErrors({
        //   title:'',
        //   memo:'',
        //   text:'',
        //   pdf:'',
        //   images:''
        // });
    
        try {
          const formdata = new FormData();
          formdata.append('father_id', fatherId);
          formdata.append('title', title);
          formdata.append('memo', memo);
          formdata.append('text', text);
        //   formdata.append('pdf', pdf);
        //   formdata.append('images', images);
    
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
    if (!meeting) return null;
	return (
        <div className="l-content">
            <div className="l-content__ttl">
                <div className="l-content__ttl__left">
                <h2>ミーティング作成</h2>
                </div>
                <div className="p-notification">
                <div className="p-notification-icon">
                    <div className="p-notification-icon-wrap">
                    <div className="count">1</div>
                    <div className="p-notification-icon-bg"></div>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22.742 19.855" className="icon svg-icon svg-fill svg-y50" ><g fill="none" stroke="#080808" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" data-name="Icon feather-alert-triangle" transform="translate(0.777 0.75)"><path d="M11.188,5.322,2.6,19.659A2.028,2.028,0,0,0,4.334,22.7H21.51a2.028,2.028,0,0,0,1.734-3.042L14.656,5.322a2.028,2.028,0,0,0-3.468,0Z" data-name="パス 3" transform="translate(-2.328 -4.346)"/><path d="M18,13.5v6.91" data-name="パス 4" transform="translate(-7.406 -8.547)"/><path d="M18,25.5h0" data-name="パス 5" transform="translate(-7.406 -11.2)"/></g></svg>
                    </div>
                </div>
                </div>
            </div>
    
            <div className="l-content-wrap">
                <div className="p-article">
                <div className="p-article-wrap">
                    <article className="p-article__body">
                    <div className="p-article__content">       
                        <div className="p-article__context">
                        <form action="" className="edit-form">
                            <div className="edit-set">
                            <label className="control-label" htmlFor="title">タイトル</label>
                            <input type="text" name="title"   value={ title } onChange={e=>setTitle(e.target.value)} className="input-default input-title input-h60 input-w480" id="title" />
                            </div>
                            <div className="edit-set">
                            <label className="control-label" htmlFor="meeting_textarea">本文</label>
                            <textarea value={ text } onChange={e=>setText(e.target.value)} rows="8" className="textarea-default" id="meeting_textarea" />
                            </div>
                            <div className="edit-set">
                            <label className="control-label" htmlFor="meeting_textarea">メモ</label>
                            <textarea value={ memo } onChange={e=>setMemo(e.target.value)}  rows="8" className="textarea-default" id="meeting_textarea" />
                            </div>
                            <div className="edit-set edit-set-mt15">
                            <label className="edit-set-file-label" htmlFor="file_pdf">
                                PDFアップロード
                                <input type="file" name="file_pdf" accept=".pdf" id="file_pdf" />
                            </label> 
                            </div>
                            <div className="edit-set edit-set-mt15">
                            <label className="edit-set-file-label" htmlFor="file_image">
                                画像アップロード
                                <input type="file" name="file_image" accept=".png, .jpg, .jpeg" id="file_image" /> 
                            </label>
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
    
                            <button 
                                type="button" 
                                onClick={e => {
                                    e.preventDefault();
                                    handleClick();
                                }}
                                className="btn-edit btn-default btn-h70 btn-r14 btn-yellow">ミーティングを更新</button>
                        </form>
                        </div>     
                    </div>
                    </article>
                </div>
                </div>
            </div>
        </div>   
	)
}

export default MeetingEdit;