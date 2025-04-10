import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import './RiwayatPeminjaman.css';

const Riwayat = () => {
  const [showModal, setShowModal] = useState(false);
  const [kodeBilling, setKodeBilling] = useState('');
  const [selectedTanggal, setSelectedTanggal] = useState('');
  const [selectedJam, setSelectedJam] = useState('');
  const [totalHarga, setTotalHarga] = useState(0);

  const dataRiwayat = [
    {
      gedung: "Gedung Teknik Sipil",
      ruangan: "Auditorium",
      tanggal: "Senin, 8 April 2025",
      jam: "09:00 - 12:00",
      peminjam: "Cecyl Damo",
      status: "Menunggu Pembayaran",
      harga: 300000, // total harga dummy
    },
    {
      gedung: "Gedung B",
      ruangan: "Ruang 202",
      tanggal: "Selasa, 9 April 2025",
      jam: "13:00 - 15:00",
      peminjam: "Cecyl Damo",
      status: "Menunggu Persetujuan",
      harga: 200000,
    },
    {
      gedung: "Gedung C",
      ruangan: "Ruang 303",
      tanggal: "Rabu, 10 April 2025",
      jam: "10:00 - 11:00",
      peminjam: "Cecyl Damo",
      status: "Telah Disetujui",
      harga: 150000,
    },
  ];

  const handleStatusClick = (status: string, tanggal: string) => {
    if (status === "Menunggu Pembayaran") {
      const item = dataRiwayat.find((x) => x.tanggal === tanggal);
      const kode = `${tanggal}-${Math.floor(100000 + Math.random() * 900000)}`;
      setKodeBilling(kode);
      setSelectedTanggal(tanggal);
      setSelectedJam(item?.jam || '');
      setTotalHarga(item?.harga || 0);
      setShowModal(true);
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
            {dataRiwayat.map((item, index) => (
              <tr key={index}>
                <td>{item.gedung}</td>
                <td>{item.ruangan}</td>
                <td>{item.tanggal}</td>
                <td>{item.jam}</td>
                <td>{item.peminjam}</td>
                <td>
                  {item.status === "Menunggu Pembayaran" ? (
                    <span
                      className="text-primary fw-bold"
                      style={{ cursor: "pointer" }}
                      onClick={() => handleStatusClick(item.status, item.tanggal)}
                    >
                      {item.status}
                    </span>
                  ) : (
                    item.status
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL BILLING */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
        backdrop="static"
        keyboard={false}
      >
        <div
          className="modal-content"
          style={{
            backgroundColor: '#ffffff',
            opacity: 1,
            borderRadius: '12px',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)',
            zIndex: 1055,
          }}
        >
          <Modal.Header closeButton style={{ backgroundColor: '#f8f9fa' }}>
            <Modal.Title><strong>Kode Billing</strong></Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ backgroundColor: 'white', padding: '2rem' }}>
            <div className="text-center">
              <h5 className="mb-4 text-success fw-bold">Silakan Lakukan Pembayaran</h5>
              <div className="billing-info mb-3 p-3 rounded shadow-sm bg-light">
                <p><strong>Tanggal Peminjaman:</strong> <span className="text-muted">{selectedTanggal}</span></p>
                <p><strong>Jam Peminjaman:</strong> <span className="text-muted">{selectedJam}</span></p>
                <p><strong>Kode Billing:</strong> <span className="text-primary fw-bold">{kodeBilling}</span></p>
                <p><strong>Total Harga:</strong> <span className="text-danger fw-bold">Rp {totalHarga.toLocaleString('id-ID')}</span></p>
              </div>
              <div className="alert alert-warning mt-4" role="alert">
                Lakukan pembayaran ke rekening resmi universitas sebelum batas waktu yang ditentukan.
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer style={{ backgroundColor: '#ffffff', justifyContent: 'center' }}>
            <Button variant="primary" onClick={() => setShowModal(false)}>
              Saya Mengerti
            </Button>
          </Modal.Footer>
        </div>
      </Modal>
          </div>
  );
};

export default Riwayat;