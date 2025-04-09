import React from 'react';
import './RiwayatPeminjaman.css';

const Riwayat = () => {
  return (
    <div>
      <div className="container mt-5">
        <h2>Riwayat Peminjaman</h2>

        {/* PROGRESS BAR */}
        <div className="progress-container mt-5 mb-5">
          <div className="progress-step completed">
            <div className="circle">✔</div>
            <p>Pengajuan Ruangan</p>
          </div>
          <div className="progress-step active">
            <div className="circle"></div>
            <p>Pengajuan Surat</p>
          </div>
          <div className="progress-step">
            <div className="circle"></div>
            <p>Menunggu Persetujuan</p>
          </div>
          <div className="progress-step">
            <div className="circle"></div>
            <p>Telah Disetujui</p>
          </div>
        </div>

        {/* TABEL */}
        <div className="table-responsive mt-5 min-vh-100">
          <table className="table table-bordered table-hover bg-light text-center">
            <thead className="table-light">
              <tr>
                <th>Gedung</th>
                <th>Ruangan</th>
                <th>Hari/Tanggal</th>
                <th>Jam Peminjaman</th>
                <th>Dipinjam Oleh</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {/* isi data peminjaman */}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Riwayat;