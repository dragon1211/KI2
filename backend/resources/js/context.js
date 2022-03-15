import  { createContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const HeaderContext = createContext({});

export const HeaderContextProvider = ({ children }) => {

  const {pathname} = useLocation();
  const navigator = useNavigate();
  const acc_type = pathname.split('/')[1];

  const [selected_item_sidebar, SetSelectedItemOfSidebar] = useState('');

  const handleLogout = () => {
    axios.get(`/${acc_type}/logout`)
    .then(() => {
        localStorage.removeItem(`${acc_type}_token`);
        navigator(`/${acc_type}/login`);
    })
  }

  const isAuthenticate = () => {
    let token = localStorage.getItem(`${acc_type}_token`);
    if(!token){
        navigator(`/${acc_type}/login`);
        return false;
    }
    else{
      token = JSON.parse(token);
      let expires = token.expires;
      let now = new Date().getTime();  //current timestamp
      if(now >= expires){
        handleLogout();
        return false;
      }
    }
    return true;
  }


  return (
    <HeaderContext.Provider
      value={{
        selected_item_sidebar, SetSelectedItemOfSidebar,
        handleLogout,
        isAuthenticate
      }}
    >
      {children}
    </HeaderContext.Provider>
  );
};
