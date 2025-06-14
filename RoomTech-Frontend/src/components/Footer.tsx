import React from 'react';
import './Footer.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faInstagram,
  faYoutube,
  faTwitter
} from '@fortawesome/free-brands-svg-icons';
// import { faUsers } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="custom-footer py-3 mt-auto">
      <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center">
        {/* Left - Copyright */}
        <p className="footer-text mb-2 mb-md-0 text-md-start text-center">
          Copyright ©2025
        </p>

        {/* Center - Icons */}
        <div className="footer-icons mb-2 mb-md-0">
        <a href="https://www.instagram.com/unsrat1961"
        target="_blank"
        rel="noopener noreferrer">
         <FontAwesomeIcon icon={faInstagram} className="footer-icon" />
        </a>
        <a href="www.youtube.com/@UNSRAT1961"
        target="_blank"
        rel="noopener noreferrer">
          <FontAwesomeIcon icon={faYoutube} className="footer-icon" />
          </a>
          <a href="https://twitter.com/unsratmdo"
        target="_blank"
        rel="noopener noreferrer">
         <FontAwesomeIcon icon={faTwitter} className="footer-icon" />
          </a>
        </div>

        {/* Right - About Us Link */}
        <div>
          <Link to="/about" className="footer-link">
            About Us
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
