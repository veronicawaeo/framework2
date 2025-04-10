import React, { useState } from 'react';
import './AdmPage.css';

const AdmPage: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<any>(null);

  const data = [
    {
      idRoom: "Viator",
      name: "Viator Inc.",
      email: "ahli@gmail.com",
      contact: "+932354144444",
      bookingDate: "March 07, 2024",
      status: "Approved",
    },
    {
      idRoom: "Airbnb",
      name: "Airbnb LLC",
      email: "chris@airbnb.com",
      contact: "+932354144444",
      bookingDate: "March 07, 2024",
      status: "Rejected",
    }
  ];

  const handleEditClick = (partner: any) => {
    setSelectedPartner(partner);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedPartner(null);
  };

  return (
    <div className="admin-container min-vh-100">
      {/* Ringkasan */}
      <div className="summary-cards">
        <div className="card total">Total Booked <span>300</span></div>
        <div className="card approved">Approved <span>260</span></div>
        <div className="card pending">Pending <span>29</span></div>
        <div className="card rejected">Rejected <span>11</span></div>
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
              <th>ID Room</th>
              <th>Name</th>
              <th>Email</th>
              <th>Contact Number</th>
              <th>Booking Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((partner, idx) => (
              <tr key={idx}>
                <td>{partner.idRoom}</td>
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
                    onClick={() => handleEditClick(partner)}
                  ></i>
                  <i className="bi bi-trash3" style={{ cursor: 'pointer' }}></i>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Edit */}
      {showModal && selectedPartner && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h5>Edit Booking</h5>
            <p><strong>Name:</strong> {selectedPartner.name}</p>
            <p><strong>Email:</strong> {selectedPartner.email}</p>
            <p><strong>Contact:</strong> {selectedPartner.contact}</p>
            <p><strong>Status:</strong> {selectedPartner.status}</p>
            <button className="btn btn-secondary mt-3" onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdmPage;