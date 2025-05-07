import React from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = () => {
  const location = useLocation();
  const hideLayout = location.pathname === '/login' || location.pathname === '/register';

  return (
    <>
      {!hideLayout && <Navbar />}
      <main style={{ paddingTop: !hideLayout ? '80px' : '0' }}>
        <Outlet />
      </main>
      {!hideLayout && <Footer />}
    </>
  );
};

export default Layout;
