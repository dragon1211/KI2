import React, { useRef, useEffect, useState, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { LoadingButton } from '@material-ui/lab';
import IconButton from '@mui/material/IconButton';
import RemoveIcon from '@mui/icons-material/Remove';

import { HeaderContext } from '../../context';
import Alert from '../../component/alert';
import Notification from '../../component/notification';
import PreviewPDF from '../../component/preview_pdf';
import PageLoader from '../../component/page_loader';
import UploadingProgress from '../../component/modal_uploading';




const ParentMeetingEdit = () => {

    const navigator = useNavigate();
    const params = useParams();
    const { isAuthenticate } = useContext(HeaderContext);
    
    const father_id = localStorage.getItem('father_id');
    const meeting_id = params?.meeting_id;
    const [notice, setNotice] = useState(-1);
    
    const [title, setTitle] = useState('');
    const [memo, setMemo] = useState('');
    const [text, setText] = useState('');
    const [pdf, setPdf] = useState('');
    const [pdf_url, setPDFURL] = useState('');
    const [meeting_image, setMeetingImages] = useState([]);
    const [approval_list, setApproval] = useState([]);
    const [children_list, setChildrenList] = useState([]);
    const [meeting, setMeeting] = useState(null);

    const [_422errors, set422Errors] = useState({title:'', text:'', memo:'', pdf:'', image:''})
    const [_400error, set400Error] = useState('');
    const [_404error, set404Error] = useState('');
    const [_success, setSuccess] = useState('');

    const [loaded, setLoaded] = useState(false);
    const [submit, setSubmit] = useState(false);

    const [check_radio, setCheckRadio] = useState(null);
    const [image_sending, setImageSending] = useState(false);

    const isMountedRef = useRef(true);

    useEffect(() => {
        isMountedRef.current = false;
        if(isAuthenticate()){
            setLoaded(false);
    
            axios.get(`/api/fathers/meetings/detail/${meeting_id}`, {params: { father_id: father_id}})
            .then(response => {
                if(isMountedRef.current) return;
    
                setLoaded(true);
                setNotice(response.data.notice);
                if(response.data.status_code==200){
                    setMeeting(response.data.params);
                    setTitle(response.data.params?.title);
                    setMemo(response.data.params.memo ? response.data.params.memo: '');
                    setText(response.data.params.text ? response.data.params.text: '');
                    setMeetingImages(response.data.params?.meeting_image);
                    setApproval(response.data.params?.approval);
                    setPdf(response.data.params?.pdf);
                    setPDFURL(response.data.params?.pdf);
                    
                    var list = [...response.data.params?.children];
                    var approval = [...response.data.params?.approval];
                    var arr = [];
                    for(var i in list){
                        if(approval.findIndex(ele=>ele.child_id == list[i].id) >= 0)
                            arr.push({...list[i], checked: true});
                        else arr.push({...list[i], checked: false});
                    }
                    setChildrenList(arr);
                    if((approval.length==list.length) && approval.length > 0)
                        setCheckRadio('all_send');
                    else if((approval.length != list.length) && approval.length > 0)
                        setCheckRadio('pickup_send');
                    else setCheckRadio('');
                }
                else{
                    set400Error("?????????????????????");
                }
            })
            .catch(err=>{
                if(isMountedRef.current) return;
    
                setLoaded(true);
                setNotice(err.response.data.notice);
                if(err.response.status==404){
                    set404Error(err.response.data.message);
                }
            })
        }

        return () => {
            isMountedRef.current = true;
        }
    }, []);



//--------------------------------------------------------
    useEffect(()=>{
        if(!loaded) return;      //if dont load data
        var list = [...children_list];
        if(check_radio=="all_send"){        //send all children
            for(var i=0; i<list.length; i++)
                list[i].checked = true;
        }
        else if(check_radio=="pickup_send"){                     //send pickup
            for(var i in list){
                if(approval_list.findIndex(ele=>ele.child_id == list[i].id) >= 0)
                    list[i].checked = true;
                else list[i].checked = false;
            }
        }
        setChildrenList(list);
    },[check_radio])

//----------------------------------------------------------------------
    const handleSubmit = (e) => {
        e.preventDefault();

        if(isAuthenticate()){
            set422Errors({title:'',memo:'',text:'',pdf:'',image:''});
    
            var approval_registerIndexes = [];
            var approval_deleteIndexes = [];
            for(let i in children_list){
                if(children_list[i].checked){
                    if(approval_list.findIndex(ele=>ele.child_id == children_list[i].id) < 0)
                        approval_registerIndexes.push(children_list[i].id);
                }
            }
            for(let i in approval_list){
                if(children_list.findIndex(ele=> ele.checked && ele.id == approval_list[i].child_id) < 0)
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
                if(isMountedRef.current) return;
    
                setNotice(response.data.notice);
                setSubmit(false);
                switch(response.data.status_code){
                    case 200: {
                        navigator(`/p-account/meeting/detail/${meeting_id}`,  { state: '???????????????????????????!' });
                        break;
                    }
                    case 400: set400Error("??????????????????????????????"); break;
                    case 422: window.scrollTo(0, 0); set422Errors(response.data.error_messages); break;
                }
            });
        }
    }


    const handleImageChange = (e) => {
        e.preventDefault();

        if(isAuthenticate()){
            const files = Array.from(e.target.files);
            if(e.target.files.length + meeting_image.length > 10)
            {
                set400Error("???????????????10??????????????????");
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
    
            Promise.all(promises).then( images => {
                set422Errors({image:''});
                const formdata = new FormData();
                formdata.append('image', JSON.stringify(images));
                setImageSending(true);
                axios.post(`/api/fathers/meeting/images/register`, formdata,  {params:{meeting_id: meeting_id}})
                .then(response=>{
                    if(isMountedRef.current) return;
    
                    setImageSending(false);
                    setNotice(response.data.notice);
                    switch(response.data.status_code){
                        case 200: setMeetingImages(response.data.params); break;
                        case 400: set400Error("???????????????????????????????????????"); break;
                        case 422: window.scrollTo(0, 0); set422Errors(response.data.error_messages); break;
                    }
                })
            }, 
            error => { console.error(error); });
        }
    };


    const handleDeleteImage = (index, image_id) => {
        if(isAuthenticate()){
            let list = [...meeting_image];
            list.splice(index, 1);
            setMeetingImages(list);
            
            axios.delete(`/api/fathers/meeting/images/delete/${meeting_id}`, {params:{image_id: image_id}})
            .then(response=>{
                if(isMountedRef.current) return;
                
                setNotice(response.data.notice);
                switch(response.data.status_code){
                    case 400: set400Error("???????????????????????????????????????");
                }
            })
        }
    }

    const handlePDFChange = (e) => {
        e.preventDefault();
        let reader = new FileReader();
        let _file = e.target.files[0];
        if(!_file) return;
        setPDFURL(URL.createObjectURL(_file))
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


	return (
        <div className="l-content">
            <div className="l-content-w560">
                <div className="l-content__ttl">
                    <div className="l-content__ttl__left">
                        <h2>????????????????????????</h2>
                    </div>
                    <Notification notice={notice}/>
                </div>
        
                <div className="l-content-wrap">
                    <div className="p-article">
                    <div className="p-article-wrap position-relative" style={{ minHeight:'500px'}}>
                    {
                        (!loaded || image_sending) &&
                            <PageLoader/>
                    }
                    {
                        loaded && meeting &&
                        <article className="p-article__body">
                            <div className="p-article__content">       
                                <div className="p-article__context">
                                    <form className="edit-form" onSubmit={handleSubmit}>
                                        <div className="edit-set">
                                            <label className="control-label" htmlFor="title">????????????</label>
                                            <input type="text" name="title"   value={ title } onChange={e=>setTitle(e.target.value)} className={`input-default input-title input-h60 input-w480 ${  _422errors.title && 'is-invalid c-input__target'} `} id="title" />
                                            {
                                                _422errors.title &&
                                                    <span className="l-alert__text--error ft-16 ft-md-14">
                                                        {_422errors.title}
                                                    </span> 
                                            }
                                        </div>
                                        <div className="edit-set">
                                            <label className="control-label" htmlFor="meeting_textarea">??????</label>
                                            <textarea value={ text } onChange={e=>setText(e.target.value)} rows="8" className={`textarea-default  ${  _422errors.text && 'is-invalid c-input__target'} `}  id="meeting_textarea" />
                                            {
                                                _422errors.text &&
                                                    <span className="l-alert__text--error ft-16 ft-md-14">
                                                        {_422errors.text}
                                                    </span> 
                                            }
                                        </div>
                                        <div className="edit-set">
                                            <label className="control-label" htmlFor="meeting_textarea">??????</label>
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
                                                PDF??????????????????
                                                <input type="file" name="file_pdf" accept=".pdf" id="file_pdf" onChange={handlePDFChange} />
                                            </label> 
                                            {
                                                pdf && 
                                                <IconButton
                                                    onClick={()=>{setPdf(''); setPDFURL('');}}
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
                                            <PreviewPDF pdf_url={pdf_url}></PreviewPDF>
                                        </div>
                                        <div className="edit-set edit-set-mt15">
                                            <label className="edit-set-file-label" htmlFor={meeting_image.length < 10 ? 'file_image': ''}>
                                                ????????????????????????
                                                <input type="file" multiple="multiple" name="file_image[]" accept=".png, .jpg, .jpeg" id="file_image"  onChange={handleImageChange}/> 
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
                                                        onClick={e=>handleDeleteImage(k, x.id)}
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
                                            <label htmlFor="all_send">
                                                <input className="boolean optional" 
                                                    type="radio"
                                                    id="all_send"
                                                    name="check_radio" 
                                                    onChange={e=>setCheckRadio(e.target.id)}
                                                    checked = {(check_radio=='all_send') ? true : false}
                                                    disabled = {meeting.children.length == 0 ? true:false}
                                                    />
                                                <span className="lbl padding-16">???????????????</span>
                                            </label>
                                        </div>
                
                                        <div className="edit-set-mt5 edit-set-send">
                                            <label htmlFor="pickup_send">
                                                <input className="boolean optional" 
                                                    type="radio"
                                                    id="pickup_send"
                                                    name="check_radio" 
                                                    onChange={e=>setCheckRadio(e.target.id)}
                                                    checked = {(check_radio=='pickup_send') ? true : false}
                                                    disabled = {meeting.children.length == 0 ? true:false}
                                                    />
                                                <span className="lbl padding-16">???????????????</span>
                                            </label>
                                        </div>
                                       
                                        <div className={`checkbox-wrap edit-bg d-none ${(check_radio == "pickup_send" ) && 'd-block'}`}>
                                            {
                                                children_list.length > 0 ?
                                                    children_list?.map((item, k)=>
                                                        <div className="checkbox" key={k}>
                                                            <label htmlFor={`user_name${k}`}>
                                                                <input className="boolean optional" 
                                                                    type="checkbox" 
                                                                    id={`user_name${k}`}
                                                                    checked =  {item.checked}
                                                                    onChange={e=>handleCheck(e, k)}/>
                                                                <span className="lbl padding-16">
                                                                    {`${item.last_name} ${item.first_name}`}
                                                                </span>
                                                            </label>
                                                        </div>
                                                    )
                                                : <p className="text-center">????????????????????????</p>
                                            }
                                        </div>
                                        <UploadingProgress show={submit}/>
                                        <LoadingButton 
                                            type="submit" fullWidth
                                            loading={submit}
                                            className="btn-edit btn-default btn-h75 bg-yellow rounded-15">
                                            <span className={`ft-18 ft-xs-16 font-weight-bold ${!submit && 'text-black'}`}>???????????????????????????</span>
                                        </LoadingButton>
                                    </form>
                                </div>     
                            </div>
                        </article>
                    }
                        
                    { _400error && <Alert type="fail"  hide={()=>set400Error('')}>{_400error}</Alert> }
                    { _success && <Alert type="success"  hide={()=>setSuccess('')}>{_success}</Alert> }
                    { _404error && 
                        <Alert type="fail" hide={()=>{
                            set404Error('');
                            navigator('/p-account/meeting', { state:'' });
                        }}>
                        {_404error}
                        </Alert>
                    }
                    </div>
                    </div>
                </div>
            </div>
        </div>   
	)
}

export default ParentMeetingEdit;