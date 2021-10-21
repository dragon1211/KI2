import React, { useEffect, useState } from 'react';
import Notification from '../../component/notification';
import ModalAlert from '../../component/modal_alert';
import axios from 'axios';
import { useHistory } from 'react-router-dom'

const MeetingAdd = () => {
  const [textColor, setTextColor] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [messageAlert, setMessageAlert] = useState(null);
  const fatherId = document.getElementById('father_id').value;
  const [images, setImages] = useState([]);
  const [pdf, setPdf] = useState(null);
  const [title, setTitle] = useState(null);
  const [memo, setMemo] = useState(null);
  const [text, setText] = useState(null);
  const history = useHistory();

  const [errors, setErrors] = useState({
    title:'',
    memo:'',
    text:'',
    pdf:'',
    images:''
  })

  async function handleClick() {
    setErrors({
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
      formdata.append('pdf', pdf);
      formdata.append('images', images);

      axios.post('/api/meetings/register', formdata)
        .then(response => {
          if(response.data.status_code==200){
            history.push({
              pathname: "/p-account/meetings/detail/1",
              state: {message : "ミーティングを作成しました！"}
            });
          } else {
            setMessageAlert('error');
            setShowAlert(true);
          }
        });
    } catch (error) {
      console.log('error', error);
    }
  }

  const handleImageChange = (e) => {
    e.preventDefault();
    let reader = new FileReader();
    let _file = e.target.files[0];
    reader.readAsDataURL(_file);
    reader.onloadend = () => {
      setImages([...images, reader.result]);
    };
    // //upload image
    // try {
    //   const formdata = new FormData();
    //   formdata.append('father_id', fatherId);
    //   formdata.append('image', _file);
    //   axios.put("/api/fathers/updateImage", formdata)
    //     .then(response => {
    //       if(response.data.status_code == 200){
    //         setMessageAlert(response.data.success_messages);
    //         setTextColor("black");
    //       } else {
    //         setMessageAlert(response.data.success_messages);
    //       }
    //       setShowAlert(true);
    //     });
    // } catch (error) {
    //   console.log('error', error);
    // }
  };

  const handlePdfChange = (e) => {
    e.preventDefault();
    let reader = new FileReader();
    let _file = e.target.files[0];
    reader.readAsDataURL(_file);
    reader.onloadend = () => {
        setPdf(reader.result);
    };
  };

  async function handleCloseAlert() {
    setShowAlert(false);
  };

	return (
    <div className="l-content">
      <div className="l-content-w560">
        <div className="l-content__ttl">
          <div className="l-content__ttl__left">
            <h2>ミーティング作成</h2>
          </div>
          <Notification />
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
                        <input type="text" name="title"  value={ title } onChange={e=>setTitle(e.target.value)}  className="input-default input-title input-h60 input-w480" id="title" />
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
                          <input type="file" name="file_pdf" accept=".pdf" id="file_pdf"  onChange={(e) => handlePdfChange(e)} />
                        </label> 
                      </div>
                      <div className="edit-set edit-set-mt15">
                        <label className="edit-set-file-label" htmlFor="file_image">
                          画像アップロード
                          <input type="file" name="file_image" accept=".png, .jpg, .jpeg" id="file_image" onChange={(e) => handleImageChange(e)}  /> 
                        </label>
                      </div>
                      
                      <div className="p-file-image">
                      { images?.length > 0 && images.map((url,inx) => {
                        return (
                          <figure className="image-upload"><img src={url} alt="" /></figure>
                          );
                        })}
                      </div>

                      <div className="edit-set edit-set-send">
                        <label htmlFor="allmember_send">
                        <input className="boolean optional" type="checkbox" name="allmember_send" id="allmember_send" />全員に送信</label>
                      </div>

                      <div className="edit-set-mt5 edit-set-send">
                        <label htmlFor="pickup_send">
                        <input className="boolean optional" type="checkbox" name="pickup_send" id="pickup_send" />選んで送信</label>
                      </div>

                      <button 
                        type="button" 
                        onClick={e => {
                          e.preventDefault();
                          handleClick();
                        }}
                        className="btn-edit btn-default btn-h70 btn-r14 btn-yellow">ミーティングを作成</button>
                    </form>
                  </div>     
                </div>
              </article>
            </div>
          </div>
        </div>
      </div>
      <ModalAlert 
        show={showAlert}
        message={messageAlert}
        textColor={textColor}
        handleClose={handleCloseAlert} 
      />
    </div>    
	)
}

export default MeetingAdd;