import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Card, Button } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import './KonfirmasiPage-internal.css';

interface Fasilitas {
 fasilitas_id: number;
 nama_fasilitas: string;
 harga_fasilitas: number;
 satuan?: string;
}

interface LocationState {
 gedungId: number;
 ruanganId: number;
 namaRuangan: string;
 namaGedung: string;
 tanggal: string;
 jamMulai: string;
 jamSelesai: string;
 durasi: number;
 hargaRuangan: number;
 fasilitas: Fasilitas[]; 
 statusRuangan: string; 
}

const KonfirmasiPageInternal: React.FC = () => {
 const navigate = useNavigate();
 const location = useLocation();

 const state = location.state as LocationState;

 const [formData, setFormData] = useState({
  nomorTelepon: "",
  catatanTambahan: "",
  dokumen: null as File | null,
 });
 
 const [userInfo, setUserInfo] = useState({
  namaLengkap: "",
  email: "",
  user_type: "UMUM",
 });

 const [errorMessage, setErrorMessage] = useState<string | null>(null);

 const apiUrl = process.env.REACT_APP_API_URL;

 useEffect(() => {
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
   const userData = JSON.parse(storedUser);
   setUserInfo({
    namaLengkap: userData.nama || "",
    email: userData.email || "",
    user_type: userData.user_type || "UMUM",
   });
  }
 }, []);

 const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  if (errorMessage) {
   setErrorMessage(null);
  }
  const { name, value } = e.target;
  setFormData((prev) => ({ ...prev, [name]: value }));
 };

 const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (errorMessage) {
   setErrorMessage(null);
  }
  const file = e.target.files?.[0];
  if (file && file.type === "application/pdf") {
   setFormData((prev) => ({ ...prev, dokumen: file }));
  } else {
   setErrorMessage("Hanya file PDF yang diperbolehkan.");
   e.target.value = "";
   setFormData((prev) => ({ ...prev, dokumen: null }));
  }
 };

 const handleKonfirmasi = async () => {
  if (!state) return;

  setErrorMessage(null);
  
  if (!state.tanggal || !state.jamMulai || !state.jamSelesai) {
   setErrorMessage("Informasi tanggal atau waktu tidak lengkap.");
   return;
  }

  const token = localStorage.getItem('token');
  if (!token) {
    setErrorMessage("Sesi Anda telah berakhir. Silakan login kembali untuk melanjutkan.");
    return;
  }

  console.log("Mengirim permintaan dengan token:", token);

  const dataToSend = new FormData();
  dataToSend.append('ruanganId', String(state.ruanganId));
  dataToSend.append('gedungId', String(state.gedungId));
  dataToSend.append('tanggalPinjam', state.tanggal);
  dataToSend.append('jamMulai', state.jamMulai);
  dataToSend.append('jamSelesai', state.jamSelesai);
  if (formData.nomorTelepon) dataToSend.append('nomorTelepon', formData.nomorTelepon);
  if (formData.catatanTambahan) dataToSend.append('catatanTambahan', formData.catatanTambahan);
  dataToSend.append('fasilitasTambahanTerpilih', JSON.stringify(state.fasilitas));
  if (formData.dokumen) { dataToSend.append("suratIzin", formData.dokumen);}
  dataToSend.append('totalHarga', String(totalHargaFinal));

  try {
   const response = await fetch(`${apiUrl}/api/peminjaman`, {
    method: 'POST',
    headers: {
     'Authorization': `Bearer ${token}`,
    },
    body: dataToSend,
   });

   if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Otorisasi gagal. Sesi Anda mungkin sudah tidak valid.");
    }
    const errorData = await response.json();
    throw new Error(errorData.message || 'Gagal melakukan peminjaman');
   }

   navigate("/riwayat-internal");

  } catch (error) {
    console.error("Error konfirmasi peminjaman:", error);
    setErrorMessage(`Terjadi Kesalahan: ${(error as Error).message}`);
  }
 };

 if (!state) {
  return (
   <Container className="container-data-tidak-ditemukan">
    <h4>Data peminjaman tidak ditemukan.</h4>
    <p>Silakan kembali ke beranda dan coba lagi.</p>
    <Button variant="primary" onClick={() => navigate('/home-internal')} className="btn-kembali">
     Kembali ke Beranda
    </Button>
   </Container>
  );
 }

 let totalHargaRuangan = 0;
 let totalHargaFasilitas = 0;
 
 if (userInfo.user_type === 'UMUM') {
  totalHargaRuangan = state.hargaRuangan * state.durasi;
  totalHargaFasilitas = state.fasilitas.reduce((sum, f) => sum + f.harga_fasilitas, 0);
 }

 const totalHargaFinal = totalHargaRuangan + totalHargaFasilitas;

 return (
  <div className="bg-light d-flex align-items-center justify-content-center min-vh-100">
   <Container className="py-4">
    
    <h5 className="mb-3">Isi Identitas</h5>
    <Card className="p-4 mb-5">
     <Form>
      <Row className="mb-3">
       <Col md={6}><Form.Group><Form.Label>Nama Lengkap</Form.Label><Form.Control value={userInfo.namaLengkap} disabled /></Form.Group></Col>
       <Col md={6}><Form.Group><Form.Label>Alamat Email</Form.Label><Form.Control value={userInfo.email} disabled /></Form.Group></Col>
      </Row>
      <Row className="mb-3">
       <Col md={6}><Form.Group><Form.Label>Nomor Telepon</Form.Label><Form.Control type="tel" name="nomorTelepon" value={formData.nomorTelepon} onChange={handleChange} placeholder="Masukkan nomor telepon Anda" /></Form.Group></Col>
       <Col md={6}><Form.Group><Form.Label>Surat Izin Peminjaman (PDF)</Form.Label><Form.Control type="file" accept="application/pdf" onChange={handleFileChange} />
      <a
        href="/templates/template_surat_izin.docx"
        download
        className="form-text text-decoration-none d-block mt-2"
      >
        <small>
          <i className="bi bi-download me-1"></i>Unduh Template Surat (.docx)
        </small>
      </a>
       </Form.Group></Col>
      </Row>
      <Row><Col md={12}><Form.Group><Form.Label>Catatan Tambahan</Form.Label><Form.Control as="textarea" rows={3} name="catatanTambahan" value={formData.catatanTambahan} onChange={handleChange} placeholder="Contoh: butuh teknisi untuk pengaturan proyektor" /></Form.Group></Col></Row>
     </Form>
    </Card>

    <h5 className="mb-3">Konfirmasi Peminjaman</h5>
    <Card className="p-4 mb-4">
     <h6><strong>{state.namaRuangan} - {state.namaGedung}</strong></h6>
     <div className="mt-3 d-flex justify-content-between"><strong>Status</strong><span className="text-primary">{state.statusRuangan}</span></div>
     <div className="mt-3 d-flex justify-content-between"><strong>Hari, tanggal</strong><span className="text-muted">{new Date(state.tanggal).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span></div>
     <div className="mt-3 d-flex justify-content-between"><strong>Waktu</strong><span className="text-muted">{state.jamMulai} - {state.jamSelesai} ({state.durasi.toFixed(1)} jam)</span></div>
     
     <div className="mt-3"><strong>Fasilitas Tambahan</strong></div>
      {state.fasilitas.length > 0 ? state.fasilitas.map(f => (
       <div key={f.fasilitas_id} className="d-flex justify-content-between text-muted">
        <span>{f.nama_fasilitas}</span>
        <span>{userInfo.user_type === 'UMUM' ? `Rp${f.harga_fasilitas.toLocaleString('id-ID')}` : 'Rp0'}</span>
       </div>
      )) : <div className="text-muted"><span>Tidak ada fasilitas tambahan</span></div>}
     <hr />
     {userInfo.user_type === 'UMUM' && (
      <>
       <div className="d-flex justify-content-between text-muted">
        <small>Subtotal Harga Sewa Ruangan</small>
        <small>Rp{totalHargaRuangan.toLocaleString('id-ID')}</small>
       </div>
       <div className="d-flex justify-content-between text-muted">
        <small>Subtotal Harga Fasilitas</small>
        <small>Rp{totalHargaFasilitas.toLocaleString('id-ID')}</small>
       </div>
      </>
     )}
     <div className="d-flex justify-content-between mt-2"><strong>Total Pembayaran</strong><strong className="text-dark fs-5">Rp{totalHargaFinal.toLocaleString('id-ID')}</strong></div>
    </Card>

    <div className="text-center mt-4">
    <Button variant="primary" onClick={handleKonfirmasi} className="btn-ajukan-peminjaman">
      Ajukan Peminjaman
    </Button>
     {errorMessage && (
      <p className="text-danger mt-2">{errorMessage}</p>
     )}
    </div>
    
   </Container>
  </div>
 );
};

export default KonfirmasiPageInternal;