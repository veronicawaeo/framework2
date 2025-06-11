import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdmPage.css'; 

interface Peminjaman {
  peminjaman_id: number;
  gedung: { nama_gedung: string };
  ruangan: { nama_ruangan: string};
  user: { nama: string; email: string, nomor_telepon?: string, user_type: string };
  total_harga: number;
  tanggal_pinjam: string;
  jam_mulai: string;
  jam_selesai: string;
  tanggal_peminjaman: string;
  status_peminjaman: 'DISETUJUI' | 'DITOLAK' | 'PENGAJUAN' | 'MENUNGGU_PEMBAYARAN' | 'MENUNGGU_PERSETUJUAN' | 'SELESAI' | 'DIBATALKAN';
  catatan_tambahan?: string;
  surat_izin_path?: string;
}

const AdmPage: React.FC = () => {
  const navigate = useNavigate();
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [selectedPeminjaman, setSelectedPeminjaman] = useState<Peminjaman | null>(null);
  const [peminjamanList, setPeminjamanList] = useState<Peminjaman[]>([]);
  const [filteredList, setFilteredList] = useState<Peminjaman[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('All');

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  useEffect(() => {
    const fetchPeminjaman = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('http://127.0.0.1:3001/admin/peminjaman', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        });
        if (!response.ok) {
          throw new Error('Gagal mengambil data peminjaman. Pastikan Anda login sebagai admin.');
        }
        const data: Peminjaman[] = await response.json();
        setPeminjamanList(data);
        setFilteredList(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Terjadi kesalahan tidak dikenal');
      } finally {
        setLoading(false);
      }
    };
    fetchPeminjaman();
  }, []);
  
  // --- Fungsi untuk memfilter data berdasarkan tab ---
  const handleFilter = (status: string) => {
    setActiveTab(status);
    if (status === 'All') {
      setFilteredList(peminjamanList);
    } else {
      const filtered = peminjamanList.filter(p => p.status_peminjaman === status);
      setFilteredList(filtered);
    }
  };

  const openModal = (peminjaman: Peminjaman) => {
    setSelectedPeminjaman(peminjaman);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedPeminjaman(null);
  };

  // --- Fungsi untuk update status ke backend ---
  const updateStatus = async (newStatus: 'DISETUJUI' | 'DITOLAK') => {
    if (!selectedPeminjaman) return;

    try {
      const response = await fetch(`http://127.0.0.1:3001/admin/peminjaman/${selectedPeminjaman.peminjaman_id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Gagal memperbarui status.');
      }
      
      // Update status di state lokal agar UI langsung berubah
      const updatedList = peminjamanList.map(p =>
        p.peminjaman_id === selectedPeminjaman.peminjaman_id
          ? { ...p, status_peminjaman: newStatus }
          : p
      );
      setPeminjamanList(updatedList);
      // Terapkan filter lagi untuk memperbarui tampilan saat ini
      handleFilter(activeTab); 

      closeModal();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Gagal update.');
    }
  };
  
  // --- Kalkulasi untuk kartu ringkasan ---
  const totalCount = peminjamanList.length;
  const approvedCount = peminjamanList.filter(p => p.status_peminjaman === 'DISETUJUI').length;
  const pendingCount = peminjamanList.filter(p => p.status_peminjaman === 'PENGAJUAN').length;
  const rejectedCount = peminjamanList.filter(p => p.status_peminjaman === 'DITOLAK' || p.status_peminjaman === 'DIBATALKAN').length;

  if (loading) return <div className="admin-container text-center mt-5"><h3>Memuat data...</h3></div>;
  if (error) return <div className="admin-container text-center mt-5 alert alert-danger">{error}</div>;

  return (
    <>
      <header className="admin-header">
        <div className="admin-header-logo">
          <img src="/images/roomtech-fix.png" alt="RoomTech Logo" />
          <span>Admin Panel</span>
        </div>
        <div className="admin-header-user">
          <i className="bi bi-person-circle" onClick={() => setShowUserDropdown(!showUserDropdown)}></i>
          {showUserDropdown && (
            <div className="user-dropdown">
              <button onClick={handleLogout}>
                <i className="bi bi-box-arrow-right me-2"></i>Logout
              </button>
            </div>
          )}
        </div>
      </header>

      <div className="admin-container min-vh-100">
        <div className="summary-cards">
          <div className="card total">Total Booked <span>{totalCount}</span></div>
          <div className="card approved">Approved <span>{approvedCount}</span></div>
          <div className="card pending">Pending <span>{pendingCount}</span></div>
          <div className="card waiting">Waiting Payment <span>{peminjamanList.filter(p => p.status_peminjaman === 'MENUNGGU_PEMBAYARAN').length}</span></div>
          <div className="card rejected">Rejected <span>{rejectedCount}</span></div>
        </div>

        <div className="d-flex justify-content-between align-items-center mt-5 mb-2">
          <div className="title">Daftar Peminjaman Ruangan</div>
          <div className="tabs">
            <button onClick={() => handleFilter('All')} className={`tab ${activeTab === 'All' ? 'active' : ''}`}>All</button>
            <button onClick={() => handleFilter('DISETUJUI')} className={`tab ${activeTab === 'DISETUJUI' ? 'active' : ''}`}>Approved</button>
            <button onClick={() => handleFilter('PENGAJUAN')} className={`tab ${activeTab === 'PENGAJUAN' ? 'active' : ''}`}>Pending</button>
            <button onClick={() => handleFilter('MENUNGGU_PEMBAYARAN')} className={`tab ${activeTab === 'MENUNGGU_PEMBAYARAN' ? 'active' : ''}`}>Waiting Payment</button>
            <button onClick={() => handleFilter('DITOLAK')} className={`tab ${activeTab === 'DITOLAK' ? 'active' : ''}`}>Rejected</button>
          </div>
          {/* <input type="text" className="form-control search" placeholder="Search..." /> */}
        </div>

        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Gedung</th>
                <th>Ruangan</th>
                <th>Nama Peminjam</th>
                <th>Alamat Email</th>
                <th>Tanggal Peminjaman</th>
                <th>Jam Peminjaman</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredList.map((p) => (
                <tr key={p.peminjaman_id}>
                  <td>{p.gedung.nama_gedung}</td>
                  <td>{p.ruangan.nama_ruangan}</td>
                  <td>{p.user.nama}</td>
                  <td>{p.user.email}</td>
                  <td>{new Date(p.tanggal_pinjam).toLocaleDateString('id-ID')}</td>
                  <td>{p.jam_mulai} - {p.jam_selesai}</td>
                  <td>
                    <span className={`badge ${p.status_peminjaman.toLowerCase()}`}>
                      {p.status_peminjaman.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td>
                    <i className="bi bi-pencil-square me-2" onClick={() => openModal(p)}></i>
                    {/* <i className="bi bi-eye-fill" onClick={() => openModal(p)}></i> */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showModal && selectedPeminjaman && (
          <div className="modal-overlay">
            <div className="modal-box">
              <div className="modal-header">Verifikasi Peminjaman</div>
              <p><strong>Nama Peminjam:</strong> {selectedPeminjaman.user.nama}</p>
              <p><strong>Kontak:</strong> {selectedPeminjaman.user.nomor_telepon || '-'}</p>
              <p><strong>Catatan:</strong> {selectedPeminjaman.catatan_tambahan || 'Tidak ada catatan.'}</p>
              <p>
                <strong>Total Harga:</strong> 
                <span className='ms-2'>
                  {selectedPeminjaman.user.user_type === 'UMUM'
                    ? `Rp${selectedPeminjaman.total_harga.toLocaleString('id-ID')}`
                    : 'Rp0 (Gratis)'
                  }
                </span>
              </p>
              {selectedPeminjaman.surat_izin_path && (
                <p>
                  <strong>Surat Izin:</strong>{' '}
                  <a href={`http://127.0.0.1:3001/${selectedPeminjaman.surat_izin_path}`} target="_blank" rel="noopener noreferrer">
                    Lihat Dokumen
                  </a>
                </p>
              )}
              <div className="d-flex justify-content-around mt-4">
                <button className="btn btn-success" onClick={() => updateStatus('DISETUJUI')}>✅ Approve</button>
                <button className="btn btn-danger" onClick={() => updateStatus('DITOLAK')}>❌ Reject</button>
              </div>
              <button className="btn btn-secondary mt-3 w-100" onClick={closeModal}>Batal</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AdmPage;