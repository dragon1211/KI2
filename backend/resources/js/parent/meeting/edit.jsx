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
import Notification from '../notification';


const MeetingEdit = (props) => {

    const history = useHistory();
    const father_id = document.getElementById('father_id').value;
    const meeting_id = props.match.params.meeting_id;
    const [notice, setNotice] = useState(localStorage.getItem('notice'));
    
    const [title, setTitle] = useState('');
    const [memo, setMemo] = useState('');
    const [text, setText] = useState('');
    const [pdf, setPdf] = useState('');
    const [meeting_image, setMeetingImages] = useState([]);
    const [approval_list, setApproval] = useState([]);
    const [children_list, setChildrenList] = useState([]);

    const [_422errors, set422Errors] = useState({title:'', text:'', memo:'', pdf:'', image:''})
    const [_400error, set400Error] = useState('');
    const [_success, setSuccess] = useState('');

    const [loaded, setLoaded] = useState(false);
    const [submit, setSubmit] = useState(false);

    const [check_radio, setCheckRadio] = useState(null);


    useEffect(() => {
        setLoaded(false);
        axios.get(`/api/fathers/meetings/detail/${meeting_id}`, {params: { father_id: father_id}})
        .then(response => {
            setLoaded(true);
            setNotice(response.data.notice)
            if(response.data.status_code==200){
                setTitle(response.data.params?.title);
                setMemo(response.data.params?.memo);
                setText(response.data.params?.text);
                setMeetingImages(response.data.params?.meeting_image);
                setApproval(response.data.params?.approval);
                setPdf(response.data.params?.pdf);
                
                var list = [...response.data.params?.children];
                var approval = [...response.data.params?.approval];
                var arr = [];
                for(var i=0; i<list.length; i++){
                    if(approval.findIndex(ele=>ele.child_id == list[i].child_id) >= 0)
                        arr.push({...list[i], checked: true});
                    else arr.push({...list[i], checked: false});
                }
                setChildrenList(arr);
            } 
        });
    }, []);

//-------------------------------------------------------------
useEffect(()=>{
    var navbar_list = document.getElementsByClassName("mypage-nav-list__item");
    for(let i=0; i<navbar_list.length; i++)
        navbar_list[i].classList.remove('nav-active');
    document.getElementsByClassName("-meeting")[0].classList.add('nav-active');
},[]);



//--------------------------------------------------------
    useEffect(()=>{
        if(!loaded) return;      //if dont load data
        var list = [];
        if(check_radio=="false"){        //send all children
            list = [...children_list];
            for(var i=0; i<list.length; i++)
                list[i].checked = true;
        }
        else if(check_radio=="true"){                     //send pickup
            list = [...children_list];
            for(var i=0; i<list.length; i++){
                if(approval_list.findIndex(ele=>ele.child_id == list[i].child_id) >= 0)
                    list[i].checked = true;
                else list[i].checked = false;
            }
        }
        setChildrenList(list);
    },[check_radio])

//----------------------------------------------------------------------
    const handleSubmit = (e) => {
        e.preventDefault();
        set422Errors({title:'',memo:'',text:'',pdf:'',image:''});

        var approval_registerIndexes = [];
        var approval_deleteIndexes = [];
        for(let i=0; i<children_list.length; i++){
            if(children_list[i].checked){
                if(approval_list.findIndex(ele=>ele.child_id == children_list[i].child_id) < 0)
                    approval_registerIndexes.push(children_list[i].child_id);
            }
        }
        for(let i=0; i<approval_list.length; i++){
            if(children_list.findIndex(ele=> ele.checked && ele.child_id == approval_list[i].child_id) < 0)
                approval_deleteIndexes.push(approval_list[i].child_id);
        }

        const formdata = new FormData();
        formdata.append('children', JSON.stringify(approval_registerIndexes));
        axios.post('/api/fathers/meeting/approvals/register', formdata, {params:{meeting_id: meeting_id}})
        axios.delete('/api/fathers/meeting/approvals/delete', {params:{children: approval_deleteIndexes, meeting_id: meeting_id}})
        
        const request = { title: title, text: text, memo: memo, pdf: pdf };
        setSubmit(true);
        axios.put(`/api/fathers/meetings/update/${meeting_id}`, request)
        .then(response => {
            setNotice(response.data.notice);
            setSubmit(false);
            switch(response.data.status_code){
                case 200: {
                    history.push({
                        pathname: `/p-account/meeting/detail/${props.match.params?.meeting_id}`,
                        state: "編集が完了しました!"
                    });
                    break;
                }
                case 400: set400Error("編集が失敗しました。"); break;
                case 422: set422Errors(response.data.error_messages); break;
            }
        });
    }


    const handleImageChange = (e) => {
        e.preventDefault();
        let reader = new FileReader();
        let _file = e.target.files[0];
        if(!_file) return;
        reader.readAsDataURL(_file);
        reader.onloadend = () => {
            const formdata = new FormData();
            formdata.append('image', reader.result);
            axios.post(`/api/fathers/meeting/images/register`, formdata,  {params:{meeting_id: meeting_id}})
            .then(response => {
                setNotice(response.data.notice);
                switch(response.data.status_code){
                    case 200: setMeetingImages(response.data.params);  break;
                    case 400: set400Error(response.data.error_messages); break;
                    case 422: set422Errors(response.data.error_messages); break;
                } 
            });  
        };
    };

    const handleDeleteImage = (image_id) => {
        axios.delete(`/api/fathers/meeting/images/delete/${meeting_id}`, {params:{image_id: image_id}})
        .then(response=>{
            setNotice(response.data.notice);
            switch(response.data.status_code){
                case 200: setMeetingImages(response.data.params); break;
                case 400: set400Error("画像の削除に失敗しました。");
            }
        })
    }

    const handleChangePDF = (e) => {
        e.preventDefault();
        let reader = new FileReader();
        let _file = e.target.files[0];
        if(!_file) return;
        reader.readAsDataURL(_file);
        reader.onloadend = () => {
            setPdf(reader.result);
        }
    }

    const handleCheck = (e, index) => {
        var list = [...children_list];
        list[index].checked = e.target.checked;
        setChildrenList(list);
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
                    <Notification notice={notice}/>
                </div>
        
                <div className="l-content-wrap">
                    <div className="p-article">
                    <div className="p-article-wrap position-relative" style={{ minHeight:'500px'}}>
                    {
                        !loaded &&
                            <CircularProgress className="css-loader"/>
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
                                                <input type="file" name="file_pdf" accept=".pdf" id="file_pdf" onChange={handleChangePDF} />
                                            </label> 
                                            {
                                                pdf && 
                                                <IconButton
                                                    onClick={()=>setPdf('')}
                                                    style={{position: 'absolute',
                                                        top: '-6px',
                                                        right: '-6px'}}>
                                                    <RemoveIcon 
                                                        style={{width:'22px', height:'22px',
                                                        color: 'white',
                                                        background: '#dd0000',
                                                        borderRadius: '50%'}}/>
                                                </IconButton>
                                            }
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
                
                                        <div className="edit-set edit-set-send">
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
                
                                        <div className="edit-set-mt5 edit-set-send">
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
                                       
                                        <div className={`checkbox-wrap edit-bg ${check_radio!="true" && 'd-none'}`}>
                                            {
                                                children_list.length != 0 ?
                                                    children_list?.map((item, k)=>
                                                        <div className="checkbox" key={k}>
                                                            <label htmlFor={`user_name${k}`}>
                                                                <input className="boolean optional" 
                                                                    type="checkbox" 
                                                                    id={`user_name${k}`}
                                                                    checked =  {item.checked}
                                                                    onChange={e=>handleCheck(e, k)}/>
                                                                {`${item.first_name} ${item.last_name}`}
                                                            </label>
                                                        </div>
                                                    )
                                                : <p className="text-center">子はありません。</p>
                                            }
                                        </div>

                                        <LoadingButton 
                                            type="submit" fullWidth
                                            loading={submit}
                                            className="btn-edit btn-default btn-h75 bg-yellow rounded-15">
                                            <span className={`ft-20 ft-xs-16 font-weight-bold ${!submit && 'text-black'}`}>ミーティングを更新</span>
                                        </LoadingButton>
                                        {
                                            _400error && <Alert type="fail" hide={()=>set400Error('')}>{_400error}</Alert>
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