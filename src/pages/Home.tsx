// src/pages/Home.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import CardGedung from '../components/CardGedung';
import './Home.css';
import { ruangDipakaiList } from '../data/dataRuanganDipakai';

interface GedungData {
  category: string;
  title: string;
  description: string;
  image: string;
  link: string;
}

const gedungList: GedungData[] = [
  {
    category: 'Design',
    title: 'Gedung Teknik Sipil',
    description: 'Auditorium Teknik Sipil',
    image: 'images/gedungsipil2.jpeg',
    link: '/teknik-sipil'
  },
  {
    category: 'Product',
    title: 'Gedung Teknik Elektro',
    description: 'Creative Room, Ruang Sidang',
    image: 'images/gedungjte2.jpeg',
    link: '/jte'
  },
  {
    category: 'Gedung',
    title: 'Gedung Dekanat',
    description: 'Auditorium Dekanat',
    image: 'images/gedungdekanat2.jpeg',
    link: '/dekanat'
  },
  {
    category: 'Software Engineering',
    title: 'Gedung Laboratorium',
    description: 'Lab Tik & Siber, Lab Multimedia, Lab TBD, dan Lab RPL',
    image: 'images/labimg.jpeg',
    link: '/gedung-lab'
  },
  {
    category: 'Information System',
    title: 'Gedung PTI',
    description: 'PTI-1, PTI-2, PTI-3',
    image: 'images/ptiimg.jpeg',
    link: '/gedung-pti'
  }
];

const Home: React.FC = () => {

  return (
    <div className="container mt-4">

      {/* Hero Section */}
      <div className="hero-section">
        <img src="images/unsratimg2.jpeg" alt="Unsrat" />
        <div className="hero-overlay"></div>
        <div className="hero-text">
          <h1><strong>Selamat Datang, User!</strong></h1>
          <p>Pinjam ruangan dengan mudah dan cepat</p>
          
          <button
            onClick={() => {
              const gedungSection = document.getElementById('gedung');
              gedungSection?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="btn-custom mt-3 px-4 py-2 rounded-pill shadow-sm"
          >
            Pilih Gedung Sekarang
          </button>

          {/* Kotak ruangan masuk ke dalam sini */}
          <div className="custom-container mt-4">
            <div className="blur-container">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 style={{ fontWeight: 600 }}>Ruangan Yang Sedang Dipakai</h3>
              </div>

              {ruangDipakaiList.length > 0 ? (
                <>
                  <div className="row fw-bold mb-2 sticky-header">
                    <div className="col-md-4 info-peminjaman">Nama Ruang</div>
                    <div className="col-md-4 info-peminjaman">Hari/Tanggal</div>
                    <div className="col-md-4 info-peminjaman">Jam Peminjaman</div>
                  </div>
                  <div className="scroll-container">
                    {ruangDipakaiList.map((ruang, index) => (
                      <div key={index} className="row mb-2 pb-2 align-items-center" style={{ borderBottom: '1px solid rgb(111, 111, 111)' }}>
                        <div className="col-md-4 text-muted">{ruang.nama}</div>
                        <div className="col-md-4 text-muted">{ruang.tanggal}</div>
                        <div className="col-md-4 text-muted">{ruang.jam}</div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p className="text-center text-muted">Tidak ada ruangan yang sedang dipakai saat ini.</p>
              )}

            </div>
          </div>

        </div>
      </div>


      {/* Gedung yang tersedia */}
      <h2
        id="gedung"
        className="text-center mb-4 fw-bold"
        style={{ marginTop: '170px' }} // atau coba 180px, 200px tergantung tinggi custom-container
      >
        Gedung yang Tersedia
      </h2>
      <div className="container px-4 mx-auto p-3" style={{ maxWidth: '1000px' }}>
        <div className="row text-start g-4">
          {gedungList.map((gedung, idx) => (
            <CardGedung
              key={idx}
              category={gedung.category}
              title={gedung.title}
              description={gedung.description}
              image={gedung.image}
              link={gedung.link}
            />
          ))}
        </div>
      </div>

      {/* Denah Lokasi */}
      <div className="custom-container mt-4 mb-4">
        <h2 className="text-center fw-bold mb-4">Denah Lokasi Gedung</h2>
        <div className="bg-white rounded-lg p-4 shadow-lg">
          <div className="bg-light rounded-lg p-4 shadow-sm">
          <img
            alt="Denah Lokasi Gedung Fakultas Teknik"
            className="img-fluid rounded-4"
            src="images/map_gedung_fatek.png"
          />
          </div>
        </div>
      </div>

    </div>
  );
};

export default Home;