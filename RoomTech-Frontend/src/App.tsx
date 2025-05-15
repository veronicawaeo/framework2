// App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import RiwayatEksternal from './pages/eksternal/RiwayatPeminjaman-eksternal';
import RiwayatInternal from './pages/internal/RiwayatPeminjaman-internal';
import ProfilInternal from './pages/internal/Profil-internal';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import GedungPageInternal from './pages/internal/GedungPage-internal';
import GedungPageEksternal from './pages/eksternal/GedungPage-eksternal';
import KonfirmasiPage from './pages/eksternal/KonfirmasiPage-eksternal';
import AdmPage from './pages/AdmPage'; 
import About from './pages/About';
import HomeEksternal from './pages/eksternal/Home-eksternal-sudahlogin';
import HomeInternal from './pages/internal/Home-internal-sudahlogin';
import ProfilEksternal from './pages/eksternal/Profil-eksternal';
import KonfirmasiPageInternal from './pages/internal/KonfirmasiPage-internal';
import KonfirmasiPageEksternal from './pages/eksternal/KonfirmasiPage-eksternal';


const AppContent = () => {
  const location = useLocation();
  const hideLayout = location.pathname === '/register' 
  || location.pathname === '/login'
  || location.pathname === '/' 


  return (
    <>
      {!hideLayout && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home-internal" element={<HomeInternal />} />
        <Route path="/home-eksternal" element={<HomeEksternal />} />
        <Route path="/riwayat-eksternal" element={<RiwayatEksternal />} />
        <Route path="/riwayat-internal" element={<RiwayatInternal />} />

        <Route path="/eksternal/:gedungIdEksternal" element={<GedungPageEksternal />} />
        <Route path="/internal/:gedungId" element={<GedungPageInternal />} />

        <Route path="/profil-eksternal" element={<ProfilEksternal />} />
        <Route path="/profil-internal" element={<ProfilInternal />} />
        <Route
          path="/konfirmasi-eksternal"
          element={
            <KonfirmasiPageEksternal
              userType="umum"
              namaRuangan="Auditorium Sipil"
              namaGedung="Gedung Teknik SIpil"
              tanggal="Jumat, 11 April 2025"
              durasi={8}
              harga={1200000}
              fasilitas={[
                { nama: "Mouse", harga: 2000, satuan: "jam" },
                { nama: "Monitor", harga: 25000, satuan: "jam" }
              ]}
              statusRuangan="Ruangan Tersedia"
            />
          }
        />

        <Route path="/admin" element={<AdmPage />} />
        <Route path="/about" element={<About />} />
        <Route
          path="/konfirmasi-internal"
          element={
            <KonfirmasiPageInternal
              userType="umum"
              namaRuangan="Auditorium Sipil"
              namaGedung="Gedung Teknik SIpil"
              tanggal="Jumat, 11 April 2025"
              durasi={8}
              harga={0}
              fasilitas={[
                { nama: "Mic Wireless", harga: 0, satuan: "jam" },
                { nama: "Monitor", harga: 0, satuan: "jam" }
              ]}
              statusRuangan="Ruangan Tersedia"
            />
          }
        />
        

      </Routes>

      {!hideLayout && <Footer />}
    </>
  );
};

const App = () => { 
  return <AppContent />;
};


export default App;