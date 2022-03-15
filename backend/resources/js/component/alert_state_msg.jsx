import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Alert from './alert';

export default function AlertStateMessage() {
  const { pathname, state } = useLocation();
  const navigator = useNavigate();
  const [_success, setSuccess] = useState('');
  const [_400error, set400Error] = useState('');

  useEffect(() => {
    if(state){
      if( pathname.search('/register/error') > 0){
        set400Error(state);
      }
      else{
        setSuccess(state);
      }
      navigator(pathname);
    } 
  }, [pathname]);

  return (
    <>
    {  _400error ? <Alert type="fail" hide={()=>set400Error('')}>{_400error}</Alert> : null}
    {  _success ?  <Alert type="success" hide={()=>setSuccess('')}>{ _success }</Alert> : null}
    </>
  );
}
