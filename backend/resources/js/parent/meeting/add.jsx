import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { CircularProgress  } from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
import IconButton from '@mui/material/IconButton';
import RemoveIcon from '@mui/icons-material/Remove';
import Alert from '../../component/alert';
import Notification from '../notification';


const MeetingAdd = (props) => {

    const history = useHistory();
    const father_id = document.getElementById('father_id').value;
    const [notice, setNotice] = useState(localStorage.getItem('notice'));
    
    const [title, setTitle] = useState('');
    const [memo, setMemo] = useState('');
    const [text, setText] = useState('');
    const [pdf, setPdf] = useState('');
    const [meeting_image, setMeetingImages] = useState([]);
    const [children_list, setChildrenList] = useState([]);
    
    const [_422errors, set422Errors] = useState({title:'', text:'', memo:'', pdf:'', image:''})
    const [_400error, set400Error] = useState('');

    const [loaded, setLoaded] = useState(false);
    const [submit, setSubmit] = useState(false);
    const [check_radio, setCheckRadio] = useState('');

    
    useEffect(()=>{
        setLoaded(false);
        const state = props.history.location.state;
        if(state){
            setLoaded(true);
            setTitle(state?.title);
            setMemo(state?.memo);
            setText(state?.text);
            setPdf(state?.pdf);
            let images = [];
            for(let i in state.meeting_image){
                images.push(state.meeting_image[i].image);
            }
            setMeetingImages(images);
            var arr = [];
            for(let i in state.children){
                arr.push({...state.children[i], checked: false})
            }
            setChildrenList(arr);
        }
        else{
            axios.get('/api/fathers/children/listOfFather', {params:{father_id: father_id}})
            .then(response=>{
                setLoaded(true);
                setNotice(response.data.notice);
                if(response.data.status_code == 200){
                    var list = response.data.params;
                    var arr = [];
                    for(var i in list)
                        arr.push({...list[i], checked: false})
                    setChildrenList(arr);
                }
                else {
                    set400Error("失敗しました。");
                }
            })
        }
    },[])

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
      var list = [...children_list];
      for(var i in list){
        if(check_radio == 'false')
          list[i].checked = true;
        else list[i].checked = false;
      }
      setChildrenList(list);
    },[check_radio])

//----------------------------------------------------------------------
    const handleSubmit = (e) => {
        e.preventDefault();
        set422Errors({title:'',memo:'',text:'',pdf:'',image:''});
        const request = { title: title, text: text, memo: memo, pdf: pdf };

        const formdata = new FormData();
        formdata.append('father_id', father_id);
        formdata.append('title', title);        
        formdata.append('text', text);        
        formdata.append('memo', memo);        
        formdata.append('pdf', pdf);
        formdata.append('image', JSON.stringify(meeting_image));        
        let c_arr = [];
        for(let i in children_list){
            if(children_list[i].checked) c_arr.push(children_list[i].id);
        }
        formdata.append('children', JSON.stringify(c_arr));

        setSubmit(true);
        axios.post('/api/fathers/meetings/register', formdata)
        .then(response => {
            setSubmit(false);
            setNotice(response.data.notice);
            switch(response.data.status_code){
                case 200: {
                    history.push({
                    pathname: `/p-account/meeting/detail/${response.data.params.meeting_id}`,
                    state: "登録成功しました"});
                    break;
                }
                case 400: set400Error("登録失敗しました。"); break;
                case 422: set422Errors(response.data.error_messages); break;
            }
        });
    }


    const handleImageChange = (e) => {
        e.preventDefault();
        const files = Array.from(e.target.files);
        if(e.target.files.length + meeting_image.length > 10)
        {
            set400Error("画像は最大10個までです。");
            return;
        }
        const promises = files.map(_file => {
            return (new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.addEventListener('load', (ev) => {
                    resolve(ev.target.result);
                });
                reader.addEventListener('error', reject);
                reader.readAsDataURL(_file);
            }))
        });

        Promise.all(promises).then(images => {
            setMeetingImages([...meeting_image, ...images]);
        }, 
        error => { console.error(error); });
    };

    const handlePDFChange = (e) => {
        e.preventDefault();
        let reader = new FileReader();
        let _file = e.target.files[0];
        if(!_file) return;
        reader.readAsDataURL(_file);
        reader.onloadend = () => {
            setPdf(reader.result);
        }
    }

    const handleRemoveImage = (image_id) => {
        let list = [...meeting_image];
        list.splice(image_id, 1);
        setMeetingImages(list);
    }

    const handleCheck = (e, index) => {
        var list = [...children_list];
        list[index].checked = e.target.checked;
        setChildrenList(list);
    }


	return (
    <div className="l-content">
        <div className="l-content-w560">
            <div className="l-content__ttl">
                <div className="l-content__ttl__left">
                    <h2>ミーティング作成</h2>
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
                                                <input type="file" name="file_pdf" accept=".pdf" id="file_pdf" onChange={handlePDFChange} />
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
                                            <label className="edit-set-file-label" htmlFor={meeting_image.length < 10 ? 'file_image': ''}>
                                                画像アップロード
                                                <input type="file"  multiple="multiple" name="file_image[]" accept=".png, .jpg, .jpeg" id="file_image"  onChange={handleImageChange}/> 
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
                                                    <img src={x} alt={x} />
                                                    <IconButton
                                                        onClick={e=>handleRemoveImage(k)}
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
                                                <span className="lbl padding-16">全員に送信</span>
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
                                                <span className="lbl padding-16">選んで送信</span>
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
                                                                <span className="lbl padding-16">
                                                                    {`${item.first_name} ${item.last_name}`}
                                                                </span>
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
                                            <span className={`ft-18 ft-xs-16 font-weight-bold ${!submit && 'text-black'}`}>ミーティングを登録</span>
                                        </LoadingButton>
                                        {  _400error && <Alert type="fail" hide={()=>set400Error('')}>{_400error}</Alert>  } 
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

export default MeetingAdd;