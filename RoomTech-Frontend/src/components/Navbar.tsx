import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

const Navbar: React.FC = () => {
  const location = useLocation();

  return (
    <nav className="navbar navbar-expand-lg shadow-sm sticky-top">
      <div className="container">
        {/* Brand Logo */}
        <Link className="navbar-brand fw-bold" to="/home-internal">
          <img
            src="/images/roomtech-fix.png"
            alt="RoomTech Logo"
            style={{ height: "40px", objectFit: "contain" }}
          />
        </Link>

        {/* Hamburger Button */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar Menu */}
        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav d-flex align-items-end gap-3">
            <li className="nav-item">
              <Link
                className={`nav-link ${location.pathname === "/home-internal" ? "active fw-bold" : ""}`}
                to="/home-internal">
                Beranda
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${location.pathname === "/riwayat-internal" ? "active fw-bold" : ""}`}
                to="/riwayat-internal">
                Riwayat Peminjaman
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${location.pathname === "/profil-internal" ? "active fw-bold" : ""}`}
                to="/profil-internal">
                Profil
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
