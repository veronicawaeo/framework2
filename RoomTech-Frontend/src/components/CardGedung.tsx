import React from 'react';
import { Link } from 'react-router-dom';
import './CardGedung.css';

interface CardGedungProps {
  category: string;
  title: string;
  description: string;
  image: string;
  link: string;
}

const CardGedung: React.FC<CardGedungProps> = ({ category, title, description, image, link }) => {
  return (
    <div className="col-lg-4 col-md-6 col-sm-12 mb-4">
      <div className="card shadow-sm h-100 d-flex flex-column">
        <img src={image} className="card-img-top rounded-top-4" alt={title} />
        <div className="card-body d-flex flex-column position-relative text-start">
        <small className="card-category fw-semibold mb-1">{category}</small>
          <h5 className="card-title fw-bold mb-2">{title}</h5>
          <p className="card-text text-muted small flex-grow-1">{description}</p>

          <div className="d-flex justify-content-end">
            <Link to={link} className="card-link text-decoration-none small d-flex align-items-center gap-2">
                <span className="fw-medium">Pilih Ruangan</span>
                <span className="arrow-circle d-flex justify-content-center align-items-center">
                    ↗
                </span>
            </Link>


          </div>
        </div>
      </div>
    </div>
  );
};

export default CardGedung;
