import React, { useRef, useEffect, useState } from 'react';
import ja from "date-fns/locale/ja";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
registerLocale("ja", ja);
import axios from 'axios';
import moment from 'moment';
import { LoadingButton } from '@material-ui/lab';
import Notification from '../notification';
import Alert from '../../component/alert';
import PageLoader from '../../component/page_loader';
import { useHistory } from 'react-router';

const ChildEdit = (props) => {

  const history = useHistory();
  const [notice, setNotice] = useState(localStorage.getItem('notice'));
  const [_success, setSuccess] = useState('');
  const [_400error, set400Error] = useState('');
  const [_404error, set404Error] = useState('');
  const [_422errors, set422Errors] = useState({hire_at: ''});

  const [hire_at, setHireAt] = useState(null);
  const [submit, setSubmit] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const father_id = document.getElementById('father_id').value;
  const child_id = props.match.params.child_id;

  const isMountedRef = useRef(true);
  
  useEffect(() => {
    isMountedRef.current = false;
    setLoaded(false);
    axios.get('/api/fathers/children/detail/'+child_id, {params:{father_id: father_id}})
    .then(response => {
        setNotice(response.data.notice);
        setLoaded(true);
        if(response.data.status_code==200){
          let hire_at = moment(response.data.params.father_relations?.hire_at).toDate();
          setHireAt(hire_at);
        } else {
          set400Error("失敗しました。");
        }
    })
    .catch(err=>{
      setLoaded(true);
      setNotice(err.response.data.notice);
      if(err.response.status==404){
        set404Error(err.response.data.message);
      }
    })
  },[]);

  const handleSubmit = (e) => {
      e.preventDefault();
      set422Errors({hire_at: ''});
      const request = {
        father_id: father_id,
        hire_at: hire_at
      }
      setSubmit(true);
      axios.put(`/api/fathers/relations/updateHireDate/${child_id}`, request)
      .then(response => {
        setSubmit(false);
        setNotice(response.data.notice);
        switch(response.data.status_code){
          case 200:{
            history.push({
                pathname: '/p-account/child/detail/'+child_id,
                state: response.data.success_messages
            });
            break;
          } 
          case 400: set400Error(response.data.error_messages); break;
          case 422: window.scrollTo(0, 0); set422Errors(response.data.error_messages); break;
        }
      });
  }
  
	return (
    <div className="l-content">
      <div className="l-content-w560">
        <div className="l-content__ttl">
          <div className="l-content__ttl__left">
            <h2>入社日を変更</h2>
          </div>
          <Notification notice={notice}/>
        </div>

        <div className="l-content-wrap">
          <section className="edit-container">
            { 
              !loaded && <PageLoader/>
            }
            {
              loaded && hire_at &&
              <div className="edit-wrap">
                <div className="edit-content">
                  <form className="edit-form" onSubmit={handleSubmit}>
                    <div className="edit-set">
                      <label className="control-label" htmlFor="hire_at">入社日</label>
                      <div>
                        <label htmlFor="hire_at"><i className="icon icon-calendar"></i></label>
                        <DatePicker 
                          id="hire_at"
                          selected={hire_at} 
                          className={`input-default input-hire_at input-h60 input-w480 ${  _422errors.hire_at && 'is-invalid c-input__target'} `}
                          onChange={date => setHireAt(date)} 
                          dateFormat="yyyy/MM/dd"
                          locale="ja"
                        />
                        {
                          _422errors.hire_at &&
                            <span className="l-alert__text--error ft-16 ft-md-14">
                                {_422errors.hire_at}
                            </span> 
                        }
                      </div>
                    </div>
                    <LoadingButton 
                        type="submit" fullWidth
                        loading={submit}
                        className="btn-edit btn-default btn-h75 bg-yellow rounded-20"
                        style={{marginTop:'50px'}}>
                        <span className={`ft-18 ft-xs-16 font-weight-bold ${!submit && 'text-black'}`}>変更内容を保存する</span>
                    </LoadingButton>
                  </form>
                </div>
              </div>
            }
          </section>
        </div>
      </div>
      { _success && <Alert type="success" hide={()=>setSuccess('')}>{_success}</Alert> }
      { _400error && <Alert type="fail" hide={()=>set400Error('')}>{_400error}</Alert> }
      { _404error && 
        <Alert type="fail" hide={()=>{
            set404Error('');
            history.push({
                pathname: "/p-account/child"
            });
        }}>
        {_404error}
        </Alert>
      }
    </div>
	)
}

export default ChildEdit;