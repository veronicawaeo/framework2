// App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Riwayat from './pages/RiwayatPeminjaman';
import Profil from './pages/Profil';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import GedungPage from './pages/GedungPage';
import KonfirmasiPage from './pages/KonfirmasiPage';

const AppContent = () => {
  const location = useLocation();
  const hideLayout = location.pathname === '/register' || location.pathname === '/login';

  return (
    <>
      {!hideLayout && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/riwayat" element={<Riwayat />} />
        <Route path="/profil" element={<Profil />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/:gedungId" element={<GedungPage />} />
        <Route
          path="/konfirmasi"
          element={
            <KonfirmasiPage
              userType="umum"
              namaRuangan="Ruang A"
              namaGedung="Gedung Utama"
              tanggal="Jumat, 14 Februari 2025"
              durasi={2}
              harga={1200000}
              fasilitas={[
                { nama: "Mouse", harga: 2000, satuan: "jam" },
                { nama: "Monitor", harga: 25000, satuan: "jam" }
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