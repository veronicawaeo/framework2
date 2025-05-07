import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './LoginPage-internal.css';


const LoginPageIntern = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add('no-body-padding');
    return () => {
      document.body.classList.remove('no-body-padding');
    };
  }, []);

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    // Simulasi login berhasil
    const userType = email.endsWith('@unsrat.ac.id') ? 'civitas' : 'umum';
  
    localStorage.setItem('token', 'fake-token');
    localStorage.setItem('userType', userType);
    localStorage.setItem('userName', 'User Dummy');
    localStorage.setItem('userEmail', email);
  
    alert('Login berhasil!');
    navigate('/');
  };
  
  

  return (
    <div className="container min-vh-100 w-100 g-0 mx-0">
      <div className="row vw-100 vh-100 g-0">
        {/* Left Section */}
        <div className="col d-flex flex-column position-relative text-white bg-purple px-5 py-4">
          <Link to="/" className="position-absolute top-0 start-0 m-4">
            <img
              src="/images/roomtech-fix.png"
              alt="Logo RoomTech"
              style={{ width: '80px' }}
            />
          </Link>

          <div className="mt-auto mb-5">
            <h1 className="fw-bold">Selamat Datang<br /> di RoomTech</h1>
            <p className="mt-3">Login untuk mulai memesan ruangan dengan mudah dan cepat.</p>
          </div>
        </div>

        {/* Right Section */}
        <div className="col d-flex flex-column bg-light justify-content-center px-5 py-4">
          <h2 className="fw-bold mb-3">Login</h2>

          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label>Email</label>
              <input
                type="email"
                className="form-control"
                placeholder="Masukkan email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label>Kata Sandi</label>
              <input
                type="password"
                className="form-control"
                placeholder="Masukkan kata sandi"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-purple w-100">Masuk</button>

            <div className="mt-4 text-center">
              Belum punya akun? <Link to="/register" className="text-decoration-none text-primary">Daftar</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPageIntern;