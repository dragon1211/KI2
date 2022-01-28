import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Alert from './alert';

export default function CheckLoginStatus() {
  const { pathname } = useLocation();
  const [_success, setSuccess] = useState('');
  const navigator = useNavigate();

  useEffect(() => {
    const acc_type = pathname.split('/')[1];

    let token = localStorage.getItem(`${acc_type}_token`);
    if(!token){
      navigator(`/${acc_type}/login`);
    }
    else{
      token = JSON.parse(token);
      if(token.from_login) {
        setSuccess('ログインに成功しました');
        token.from_login = false;
        localStorage.setItem(`${acc_type}_token`, JSON.stringify(token));
      }
    }
  }, [pathname]);

  return (
    <>
    {  _success ?  <Alert type="success" hide={()=>setSuccess('')}>{ _success }</Alert> : null}
    </>
  );
}
