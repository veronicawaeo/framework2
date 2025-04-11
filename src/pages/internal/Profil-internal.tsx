import React from 'react';
import '../internal/Profil-internal.css'; // Perhatikan foldernya
import { useNavigate } from 'react-router-dom';

const ProfilInternal: React.FC = () => {
  const navigate = useNavigate();
  const fotoURL = 'https://i.pinimg.com/736x/b5/80/6e/b5806e111517f41b88f470a7a9db55db.jpg';

  const handleLogout = () => {
    localStorage.removeItem('userType'); // Hapus session login
    navigate('/'); // Arahkan ke halaman login
  };

  return (
    <div className="profil-wrapper">
      <div className="profil-card">
        <div className="profil-header">
          <div className="profil-avatar-wrapper">
            <img src={fotoURL} alt="User" className="profil-avatar" />
          </div>
          <div className="profil-text">
            <div className="profil-nama">Frico Putung</div>
            <div className="profil-email">fricoputung@student.unsrat.ac.id</div>
            
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

        {/* Tombol Logout */}
        <div className="profil-actions mt-4 text-center">
          <button className="btn btn-danger px-4" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilInternal;
