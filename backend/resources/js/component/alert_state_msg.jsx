import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Alert from './alert';

export default function AlertStateMessage() {
  const { pathname, state } = useLocation();
  const navigator = useNavigate();
  const [_success, setSuccess] = useState('');

  useEffect(() => {
      if(state){
        setSuccess(state);
        navigator(pathname);
      } 
  }, [pathname]);

  return (
    <>
    {  _success ?  <Alert type="success" hide={()=>setSuccess('')}>{ _success }</Alert> : null}
    </>
  );
}
