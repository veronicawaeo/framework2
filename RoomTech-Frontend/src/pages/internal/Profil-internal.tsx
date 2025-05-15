import React, { useEffect, useState } from 'react';
import './Profil-internal.css';
import { useNavigate } from 'react-router-dom';

const ProfilInternal: React.FC = () => {
  const navigate = useNavigate();
  const fotoURL = 'https://i.pinimg.com/736x/26/c2/87/26c287b2e86e0ee6c30e348516480c8c.jpg';

  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Ambil data pengguna dari localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData)); // Set data pengguna
    } else {
      navigate('/login'); // Redirect ke login jika tidak ada data pengguna
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user'); // Hapus session login
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
            <div className="profil-nama">{user ? user.nama : 'Loading...'}</div>
            <div className="profil-email">{user ? user.email : 'Loading...'}</div>
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

export default ProfilInternal;