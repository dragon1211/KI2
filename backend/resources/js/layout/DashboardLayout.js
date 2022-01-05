import { Outlet } from 'react-router-dom';
import PageChangeHandler from '../component/page_change_handler';

const DashboardLayout = ({side}) => {

  return (
    <main className="l-container meeting-consent">
      <PageChangeHandler />
      <Outlet />
      {side}
    </main>
  );
};

export default DashboardLayout;
