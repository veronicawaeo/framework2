import React from 'react';
import './Profil.css';

const Profil: React.FC = () => {
  const fotoURL = 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?fit=crop&w=500&h=500'; // Ganti dengan URL avatar pengguna

  return (
    <div className="profil-wrapper">
      <div className="profil-card">
        <div className="profil-header">
          <div className="profil-avatar-wrapper">
            <img src={fotoURL} alt="User" className="profil-avatar" />
          </div>
          <div className="profil-text">
            <div className="profil-nama">Nama Pengguna</div>
            <div className="profil-email">user@gmail.com</div>
          </div>
        </div>

        <div className="profil-info">
          <div className="info-item">
            <div className="label">NIP / NIM</div>
            <div className="colon">:</div>
            <div className="value">22021106001</div>
          </div>
          <div className="info-item">
            <div className="label">Program Studi</div>
            <div className="colon">:</div>
            <div className="value">Teknik Informatika</div>
          </div>
          <div className="info-item">
            <div className="label">Fakultas</div>
            <div className="colon">:</div>
            <div className="value">Fakultas Teknik</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profil;
