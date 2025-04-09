// src/pages/LoginPage.jsx

import React, { useState } from "react";
import "./LoginPage.css";
import { Link, useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    const isCivitas = email.endsWith('@unsrat.ac.id');
    const userType = isCivitas ? 'civitas' : 'umum';
  
    localStorage.setItem('userType', userType);
  
    console.log('Login sebagai:', userType);
  
    navigate('/');
  };
  

  return (
    <div className="container min-vh-100 w-100 g-0 mx-0">
      <div className="row vw-100 vh-100 g-0">
      {/* Left side */}
      <div className="col d-flex flex-column justify-content-center align-items-start p-5 bg-purple text-white position-relative">
        <Link to="/" className="position-absolute top-0 start-0 m-4">
          <img
            src="/images/roomtech-fix.png"
            alt="RoomTech Logo"
            style={{ width: '80px' }}
          />
        </Link>

        <div className="mt-auto mb-5">
          <h1 className="fw-bold">Welcome to <br /> RoomTech</h1>
          <p className="mt-3" style={{ maxWidth: '400px' }}>
            RoomTech memudahkan semua orang untuk memesan ruangan secara praktis, cepat, dan transparan.
          </p>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="col d-flex align-items-center justify-content-center">
        <div className="w-75">
          <h2 className="mb-4 fw-bold">Welcome back!</h2>
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label className="form-label">Alamat Email</label>
              <input
                type="email"
                className="form-control"
                placeholder="Masukkan alamat email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Kata Sandi</label>
              <input
                type="password"
                className="form-control"
                placeholder="Masukkan kata sandi"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div className="form-check">
                <input type="checkbox" className="form-check-input" id="rememberMe" />
                <label className="form-check-label" htmlFor="rememberMe">Ingat saya</label>
              </div>
              <a href="#" className="text-decoration-none text-primary">Lupa kata sandi?</a>
            </div>
            <button type="submit" className="btn btn-purple w-100">Log in</button>
          </form>
          <p className="mt-4 text-center">
            Tidak punya akun? <a href="/register" className="text-decoration-none text-primary">Buat Akun</a>
          </p>
        </div>
      </div>
      </div>
    </div>
  );
};

export default LoginPage;
