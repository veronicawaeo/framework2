import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Profil = () => {
  return (
    <div>
      <Navbar />
      <div className="container mt-5">
        <h2>Profil Pengguna</h2>
        <p>Halaman ini menampilkan informasi akun pengguna.</p>
      </div>
      <Footer />
    </div>
  );
};

export default Profil;
