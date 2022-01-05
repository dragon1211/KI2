import axios from "axios";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function PageChangeHandler() {
  const { pathname } = useLocation();
  const navigator = useNavigate();

  useEffect(() => {
    loginAccountCheck();
  }, [pathname]);

  const loginAccountCheck = () => {
    let acc = pathname.split('/')[1];
    if(localStorage.getItem('kiki_acc_type') && (acc != localStorage.getItem('kiki_acc_type'))) {
      axios.get(`/${acc}/logout`);
      navigator(`/${acc}/login`);
    }
  }

  return null;
}
