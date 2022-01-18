import { Outlet } from 'react-router-dom';
import AlertStateMessage from '../component/alert_state_msg';

const MainLayout = () => {

  return (
    <main className="l-single-main">
        <div className="l-centeringbox">
            <div className="l-centeringbox-wrap">
                <AlertStateMessage/>
                <Outlet />
            </div>
        </div>
    </main>
  );
};

export default MainLayout;
