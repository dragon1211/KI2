import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCookies } from 'react-cookie';
import Alert from './alert';

export default function PageChangeHandler() {
  const { pathname } = useLocation();
  const navigator = useNavigate();
  const [cookies, setCookie] = useCookies(['user']);
  const [_success, setSuccess] = useState('');

  useEffect(() => {
    if(localStorage.getItem('kiki_login_flag')) {
      setSuccess('ログインに成功しました');
      localStorage.removeItem('kiki_login_flag');
    }
    loginAccountCheck();
  }, [pathname]);

  const loginAccountCheck = () => {
    let acc = pathname.split('/')[1];
    let acc_type = localStorage.getItem('kiki_acc_type');
    if((acc_type && (acc != acc_type))) {
      window.location.href = `/${acc}/login`;
      axios.get(`/${acc}/logout`);
    }
  }

  return (
    <>
    {  _success ?  <Alert type="success" hide={()=>setSuccess('')}>{ _success }</Alert> : null}
    </>
  );
}
