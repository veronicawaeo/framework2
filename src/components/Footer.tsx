import React from 'react';
import './Footer.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFacebook,
  faInstagram,
  faTwitter,
  faYoutube,
} from '@fortawesome/free-brands-svg-icons';
import { faUsers } from '@fortawesome/free-solid-svg-icons';

const Footer: React.FC = () => {
  return (
    <footer className="custom-footer text-center py-4">
      <div className="footer-icons mb-3">
        <FontAwesomeIcon icon={faFacebook} className="footer-icon" />
        <FontAwesomeIcon icon={faInstagram} className="footer-icon" />
        <FontAwesomeIcon icon={faTwitter} className="footer-icon" />
        <FontAwesomeIcon icon={faUsers} className="footer-icon" />
        <FontAwesomeIcon icon={faYoutube} className="footer-icon" />
      </div>
      <p className="footer-text">Copyright ©2025 by RoomTech</p>
    </footer>
  );
};

export default Footer;
