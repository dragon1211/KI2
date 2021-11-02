import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { CircularProgress  } from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
import IconButton from '@mui/material/IconButton';
import RemoveIcon from '@mui/icons-material/Remove';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Alert from '../../component/alert';


const MeetingEdit = (props) => {

    const history = useHistory();
    
    const [title, setTitle] = useState('');
    const [memo, setMemo] = useState('');
    const [text, setText] = useState('');
    const [pdf, setPdf] = useState('');
    const [meeting_image, setMeetingImages] = useState([]);
    const [approval_list, setApproval] = useState([]);

    const [_422errors, set422Errors] = useState({title:'', text:'', memo:'', pdf:'', image:''})
    const [_400error, set400Error] = useState('');
    const [_success, setSuccess] = useState('');

    const [loaded, setLoaded] = useState(false);
    const [submit, setSubmit] = useState(false);

    const [check_radio, setCheckRadio] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState([]);


    useEffect(() => {
        setLoaded(false);
        axios.get(`/api/admin/meetings/detail/${props.match.params?.meeting_id}`)
        .then(response => {
            setLoaded(true);
            if(response.data.status_code==200){
                setTitle(response.data.params?.title);
                setMemo(response.data.params?.memo);
                setText(response.data.params?.text);
                setMeetingImages(response.data.params?.meeting_image);
                setApproval(response.data.params?.approval);
                setPdf(response.data.params?.pdf);
            } 
            else if(response.data.status_code==400){
                //TODO
            }
        });
    }, []);


    const handleSubmit = (e) => {
        e.preventDefault();
        set422Errors({title:'',memo:'',text:'',pdf:'',image:''});
        try {
            const request = { title: title, text: text, memo: memo, pdf: pdf };
            setSubmit(true);
            axios.put(`/api/admin/meetings/update/${props.match.params?.meeting_id}`, request)
            .then(response => {
                setSubmit(false);
                switch(response.data.status_code){
                    case 200: setSuccess("更新成功しました!"); break;
                    case 400: set400Error("更新失敗しました。"); break;
                    case 422: set422Errors(response.data.error_messages); break;
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
            const formdata = new FormData();
            formdata.append('image', reader.result);
            axios.post(`/api/admin/meeting/images/register`, formdata,  {params:{meeting_id: props.match.params.meeting_id}})
            .then(response => {
                switch(response.data.status_code){
                    case 200: setMeetingImages(response.data.params); notify_save(); break;
                    case 400: set400Error(response.data.error_messages); break;
                    case 422: set422Errors(response.data.error_messages); break;
                } 
            });

        };
    };

    const handlePDFChange = (e) => {
        e.preventDefault();
        let reader = new FileReader();
        let _file = e.target.files[0];
        reader.readAsDataURL(_file);
        reader.onloadend = () => {
            setPdf(reader.result);
        }
    }

    const handleDeleteImage = (image_id) => {
        axios.delete(`/api/admin/meeting/images/delete/${props.match.params?.meeting_id}`, {params:{image_id: image_id}})
        .then(response=>{
            switch(response.data.status_code){
                case 200: setMeetingImages(response.data.params); notify_delete(); break;
                case 400: set400Error("画像の削除に失敗しました。");
            }
        })
    }

    const handleApproval = (e) => {
        console.log(e.target.value);
    }


    const notify_delete = () => 
    toast.success("削除成功しました。", {
        position: "top-right",
        autoClose: 5000,
        className:"bg-danger",
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
        style:{ color: '#ffffff'}
    });

    const notify_save = () => 
    toast.success("更新が成功しました。", {
        position: "top-right",
        autoClose: 5000,
        className:"bg-danger",
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
        style:{ color: '#ffffff'}
    });


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
                                                <input type="file" name="file_pdf" accept=".pdf" id="file_pdf" onChange={handlePDFChange} />
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
                                                <input type="file" name="file_image" accept=".png, .jpg, .jpeg" id="file_image"  onChange={handleImageChange}/> 
                                            </label>
                                            {
                                                _422errors.image &&
                                                  <span className="l-alert__text--error ft-16 ft-md-14">
                                                      {_422errors.image}
                                                  </span> 
                                            }
                                        </div>
                                        
                                        <div className="p-file-image justify-content-start">
                                        {
                                            meeting_image?.map((x, k)=>
                                                <figure className="image-upload" key={k}>
                                                    <img src={x.image} alt={x.image} />
                                                    <IconButton
                                                        onClick={e=>handleDeleteImage(x.id)}
                                                        style={{position: 'absolute',
                                                            bottom: '-6px',
                                                            right: '-6px'}}>
                                                        <RemoveIcon 
                                                            style={{width:'22px', height:'22px',
                                                            color: 'white',
                                                            background: '#dd0000',
                                                            borderRadius: '50%'}}/>
                                                    </IconButton>
                                                </figure>
                                            )
                                        }
                                        {
                                            [...Array(10-meeting_image.length)]?.map((x, k)=>
                                                <figure className="image-upload" key={k}></figure>
                                            )
                                        }
                                        </div>
                
                                        <div className={`edit-set edit-set-send ${approval_list.length == 0 && 'd-none'}`}>
                                            <label htmlFor="allmember_send">
                                                <input className="boolean optional" 
                                                    type="radio"
                                                    id="allmember_send"
                                                    name="check_radio" 
                                                    value={false}
                                                    onClick={e=>setCheckRadio(e.target.value)}
                                                    />
                                                <span>全員に送信</span>
                                            </label>
                                        </div>
                
                                        <div className={`edit-set-mt5 edit-set-send ${approval_list.length == 0 && 'd-none'}`}>
                                            <label htmlFor="pickup_send">
                                                <input className="boolean optional" 
                                                    type="radio"
                                                    id="pickup_send"
                                                    name="check_radio" 
                                                    value={true}
                                                    onClick={e=>setCheckRadio(e.target.value)}
                                                    />
                                                <span>選んで送信</span>
                                            </label>
                                        </div>
                                       
                                        <div className={`checkbox-wrap edit-bg ${(approval_list.length == 0 || check_radio!="true") && 'd-none'}`}>
                                            {
                                                approval_list?.map((item, k)=>
                                                    <div className="checkbox" key={k}>
                                                        <label htmlFor={`user_name${k}`}>
                                                            <input className="boolean optional" 
                                                                type="checkbox" 
                                                                id={`user_name${k}`} 
                                                                onChange={handleApproval}/>
                                                            {`${item.child.first_name} ${item.child.last_name}`}
                                                        </label>
                                                    </div>
                                                )
                                            }
                                        </div>

                                        <LoadingButton 
                                            type="submit" fullWidth
                                            loading={submit}
                                            className="btn-edit btn-default btn-h60 bg-yellow rounded-15">
                                            <span className={`ft-20 font-weight-bold ${!submit && 'text-black'}`}>ミーティングを更新</span>
                                        </LoadingButton>
                                        {
                                            _400error && <Alert type="fail" hide={()=>set400Error('')}>{_400error}</Alert>
                                        } 
                                        {
                                            _success && 
                                            <Alert type="success" 
                                            hide={()=>  
                                                history.push({
                                                pathname: `/admin/meeting/detail/${props.match.params?.meeting_id}`,
                                                state: {}
                                            })}>{_success}</Alert>
                                        }
                                    </form>
                                </div>     
                            </div>
                        </article>
                    }
                        
                    </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>   
	)
}

export default MeetingEdit;