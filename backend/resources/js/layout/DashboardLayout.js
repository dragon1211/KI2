import { Outlet } from 'react-router-dom';
import CheckLoginStatus from '../component/check_login_status';
import AlertStateMessage from '../component/alert_state_msg';

const DashboardLayout = ({side}) => {

  return (
    <main className="l-container meeting-consent">
      <AlertStateMessage />                  
      <CheckLoginStatus />  
      <Outlet />
      {side}
    </main>
  );
};

export default DashboardLayout;
