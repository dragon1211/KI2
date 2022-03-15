import { Outlet } from 'react-router-dom';
import CheckAuthenticate from '../component/check_auth';
import AlertStateMessage from '../component/alert_state_msg';

const DashboardLayout = ({side}) => {

  return (
    <main className="l-container meeting-consent">
      <AlertStateMessage />                  
      <CheckAuthenticate />
      <Outlet />
      {side}
    </main>
  );
};

export default DashboardLayout;
