import React from 'react';
import './Profil.css';

const Profil: React.FC = () => {
  const fotoURL = 'https://i.pinimg.com/736x/b5/80/6e/b5806e111517f41b88f470a7a9db55db.jpg'; // Ganti dengan URL avatar pengguna

  return (
    <div className="profil-wrapper">
      <div className="profil-card">
        <div className="profil-header">
          <div className="profil-avatar-wrapper">
            <img src={fotoURL} alt="User" className="profil-avatar" />
          </div>
          <div className="profil-text">
            <div className="profil-nama">Frico Putung</div>
            <div className="profil-email">fricoputung@gmail.com</div>
          </div>
        </div>

        <div className="profil-info">
          <div className="info-item">
            <div className="label">NIP / NIM</div>
            <div className="colon">:</div>
            <div className="value">220211060359</div>
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