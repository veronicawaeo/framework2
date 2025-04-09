import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Riwayat = () => {
  return (
    <div>
      <Navbar />
      <div className="container mt-5">
        <h2>Riwayat Peminjaman</h2>
        <p>Halaman ini menampilkan daftar riwayat peminjaman ruangan kamu.</p>
      </div>
      <Footer />
    </div>
  );
};

export default Riwayat;
