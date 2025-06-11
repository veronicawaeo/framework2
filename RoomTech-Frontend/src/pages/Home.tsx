import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    const userType = localStorage.getItem('userType');

    if (userType === 'internal') {
      navigate('/register');
    } else if (userType === 'eksternal') {
      navigate('/register');
    } else {
      navigate('/login');
    } 
  };

  const handleRegister = () => {
    navigate('/register');
  };

  return (
    <div className="container-home">
      <img src="/images/logounsrat.png" alt="UNSRAT Logo" className="unsrat-logo" />

      <div className="left-content">
        <h1 className="heading-home">
          Solusi Cepat untuk<br />Pemesanan Ruangan!
        </h1>
        <p className="description-home">
          RoomTech solusi peminjaman ruangan di lingkungan kampus UNSRAT.
          Nikmati kemudahan, keterbukaan, dan efisiensi dalam satu platform terpadu.
        </p>
        <div className="buttons">
          <button className="btn btn-purple" onClick={handleLogin}>Log In</button>
          <button className="btn-signup btn-purple-outline" onClick={handleRegister}>Sign Up</button>
        </div>
      </div>

      <img src="/images/roomtech2.png" alt="RoomTech Logo" className="roomtech-logo" />
    </div>
  );
};

export default Home;