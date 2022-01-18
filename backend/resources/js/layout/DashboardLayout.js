import { Outlet } from 'react-router-dom';
import PageChangeHandler from '../component/page_change_handler';
import AlertStateMessage from '../component/alert_state_msg';

const DashboardLayout = ({side}) => {

  return (
    <main className="l-container meeting-consent">
      <PageChangeHandler />
      <AlertStateMessage />                    
      <Outlet />
      {side}
    </main>
  );
};

export default DashboardLayout;
