import { Outlet } from 'react-router-dom';

const MainLayout = () => {

  return (
    <main className="l-single-main">
        <div className="l-centeringbox">
            <div className="l-centeringbox-wrap">
                <Outlet />
            </div>
        </div>
    </main>
  );
};

export default MainLayout;
