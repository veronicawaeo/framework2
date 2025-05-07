import React, { useState } from 'react';
import './AdmPage.css';

interface Partner {
  gedung: string;
  name: string;
  email: string;
  contact: string;
  bookingDate: string;
  status: 'Approved' | 'Rejected' | 'Pending';
}

const AdmPage: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedPartnerIndex, setSelectedPartnerIndex] = useState<number | null>(null);
  const [partners, setPartners] = useState<Partner[]>([
    {
      gedung: "JTE",
      name: "Viator Inc.",
      email: "ahli@gmail.com",
      contact: "+932354144444",
      bookingDate: "March 07, 2025",
      status: "Approved",
    },
    {
      gedung: "Sipil",
      name: "Airbnb LLC",
      email: "chris@airbnb.com",
      contact: "+932354144444",
      bookingDate: "March 07, 2025",
      status: "Rejected",
    }
  ]);

  const handleEditClick = (index: number) => {
    setSelectedPartnerIndex(index);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedPartnerIndex(null);
  };

  const updateStatus = (newStatus: 'Approved' | 'Rejected') => {
    if (selectedPartnerIndex !== null) {
      const updated = [...partners];
      updated[selectedPartnerIndex].status = newStatus;
      setPartners(updated);
      closeModal();
    }
  };

  return (
    <div className="admin-container min-vh-100">
      {/* Ringkasan */}
      <div className="summary-cards">
        <div className="card total">Total Booked <span>2</span></div>
        <div className="card approved">Approved <span>1</span></div>
        <div className="card pending">Pending <span>0</span></div>
        <div className="card rejected">Rejected <span>1</span></div>
      </div>

      {/* Tab Filter & Search */}
      <div className="d-flex justify-content-between align-items-center mt-4 mb-2">
        <div className="tabs">
          <button className="tab">All</button>
          <button className="tab">Approved</button>
          <button className="tab">Pending</button>
          <button className="tab">Rejected</button>
        </div>
        <input type="text" className="form-control search" placeholder="Search..." />
      </div>

      {/* Tabel */}
      <div className="table-responsive">
        <table className="table table-hover">
          <thead>
            <tr>
              <th>Gedung</th>
              <th>Peminjam</th>
              <th>Alamat Email</th>
              <th>Nomor Telepon</th>
              <th>Hari/Tanggal</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {partners.map((partner, idx) => (
              <tr key={idx}>
                <td>{partner.gedung}</td>
                <td>{partner.name}</td>
                <td>{partner.email}</td>
                <td>{partner.contact}</td>
                <td>{partner.bookingDate}</td>
                <td>
                  <span className={`badge ${partner.status.toLowerCase()}`}>
                    {partner.status}
                  </span>
                </td>
                <td>
                  <i
                    className="bi bi-pencil-square me-2"
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleEditClick(idx)}
                  ></i>
                  <i className="bi bi-trash3" style={{ cursor: 'pointer' }}></i>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && selectedPartnerIndex !== null && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h5>Ubah Status Booking</h5>
            <p><strong>Nama:</strong> {partners[selectedPartnerIndex].name}</p>
            <p><strong>Email:</strong> {partners[selectedPartnerIndex].email}</p>
            <p><strong>Kontak:</strong> {partners[selectedPartnerIndex].contact}</p>

            <div className="d-flex justify-content-around mt-4">
              <button
                className="btn btn-success"
                onClick={() => updateStatus('Approved')}
              >
                ✅ Approve
              </button>
              <button
                className="btn btn-danger"
                onClick={() => updateStatus('Rejected')}
              >
                ❌ Reject
              </button>
            </div>

            <button className="btn btn-secondary mt-3 w-100" onClick={closeModal}>
              Batal
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdmPage;
