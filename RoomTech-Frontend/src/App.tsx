import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import RiwayatInternal from './pages/internal/RiwayatPeminjaman-internal';
import ProfilInternal from './pages/internal/Profil-internal';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import GedungPageInternal from './pages/internal/GedungPage-internal';
import AdmPage from './pages/AdmPage'; 
import About from './pages/About';
import HomeInternal from './pages/internal/Home-internal-sudahlogin';
import KonfirmasiPageInternal from './pages/internal/KonfirmasiPage-internal';

const AppContent = () => {
  const location = useLocation();
  const hideLayout = location.pathname === '/register' 
  || location.pathname === '/login'
  || location.pathname === '/' 
  || location.pathname === '/admin' 


  return (
    <>
      {!hideLayout && <Navbar />}

      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home-internal" element={<HomeInternal />} />
        <Route path="/riwayat-internal" element={<RiwayatInternal />} />
        <Route path="/internal/gedung/:gedungId" element={<GedungPageInternal />} />
        <Route path="/profil-internal" element={<ProfilInternal />} />
        <Route path="/admin" element={<AdmPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/konfirmasi-internal" element={<KonfirmasiPageInternal/>} />
      </Routes>

      {!hideLayout && <Footer />}
    </>
  );
};

const App = () => { 
  return <AppContent />;
};

export default App;