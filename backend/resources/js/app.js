import ReactDOM from 'react-dom';
import { BrowserRouter, useRoutes } from 'react-router-dom';
import { CookiesProvider } from "react-cookie";
import routes from './routes';
import {HeaderContextProvider} from './context'

import ScrollToTop from './component/scroll_top';


const KIKIAPP = () => {
  const routing = useRoutes(routes);
  return routing;
};


if(document.getElementById('root')){
  ReactDOM.render((
    <CookiesProvider>
      <BrowserRouter>
        <HeaderContextProvider>
        <ScrollToTop />
        <KIKIAPP />
        </HeaderContextProvider>
      </BrowserRouter>
    </CookiesProvider>
  ), document.getElementById('root'));
}

