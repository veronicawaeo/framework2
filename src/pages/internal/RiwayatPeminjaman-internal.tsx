import React, { useState } from 'react'; 
import '../internal/RiwayatPeminjaman-internal.css';

const RiwayatInternal = () => {
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  const dataRiwayat = [
    {
      gedung: "Gedung Teknik Sipil",
      ruangan: "Auditorium Sipil",
      tanggal: "Jumat, 11 April 2025",
      jam: "09:00 - 17:00",
      peminjam: "Frico Putung",
      status: "Menunggu Persetujuan"
    },
  ];

  const handleStatusClick = (index: number) => {
    if (expandedRow === index) {
      setExpandedRow(null);
    } else {
      setExpandedRow(index);
    }
  };

  return (
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
            {dataRiwayat.map((item, index) => (
              <React.Fragment key={index}>
                <tr>
                  <td>{item.gedung}</td>
                  <td>{item.ruangan}</td>
                  <td>{item.tanggal}</td>
                  <td>{item.jam}</td>
                  <td>{item.peminjam}</td>
                  <td>
                    <span
                      className="text-primary fw-bold"
                      style={{ cursor: "pointer" }}
                      onClick={() => handleStatusClick(index)}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
                {expandedRow === index && (
                  <tr>
                    <td colSpan={6}>
                      <div className="billing-info p-3 rounded shadow-sm bg-light text-start">
                        <p><strong>Tanggal Peminjaman:</strong> {item.tanggal}</p>
                        <p><strong>Jam Peminjaman:</strong> {item.jam}</p>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RiwayatInternal;