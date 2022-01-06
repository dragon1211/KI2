import axios from "axios";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCookies } from 'react-cookie';

export default function PageChangeHandler() {
  const { pathname } = useLocation();
  const navigator = useNavigate();
  const [cookies, setCookie] = useCookies(['user']);

  useEffect(() => {
    loginAccountCheck();
  }, [pathname]);

  const loginAccountCheck = () => {
    let acc = pathname.split('/')[1];
    let acc_type = localStorage.getItem('kiki_acc_type');
    if((acc_type && (acc != acc_type)) || cookies.logged != 'success') {
      axios.get(`/${acc}/logout`)
      .then(()=>{
        navigator(`/${acc}/login`);
      })
    }
  }

  return null;
}
