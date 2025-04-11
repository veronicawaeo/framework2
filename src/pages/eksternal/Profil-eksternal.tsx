import React from 'react';
import '../eksternal/Profil-eksternal.css';
import { useNavigate } from 'react-router-dom';

const ProfilEksternal: React.FC = () => {
  const navigate = useNavigate();
  const fotoURL = 'https://i.pinimg.com/736x/26/c2/87/26c287b2e86e0ee6c30e348516480c8c.jpg';

  const handleLogout = () => {
    localStorage.removeItem('userType'); // Hapus session login
    navigate('/'); // Redirect ke halaman login
  };

  return (
    <div className="profil-wrapper">
      <div className="profil-card">
        <div className="profil-header">
          <div className="profil-avatar-wrapper">
            <img src={fotoURL} alt="User" className="profil-avatar" />
          </div>
          <div className="profil-text">
            <div className="profil-nama">Satria Amu</div>
            <div className="profil-email">satriaamu@gmail.com</div>
          </div>
        </div>

        {/* Tombol Logout */}
        <div className="profil-actions mt-4 text-center">
          <button className="custom-logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilEksternal;
