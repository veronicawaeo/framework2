import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Card, Button } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";

interface LocationState {
  gedungId: number;
  ruanganId: number;
  namaRuangan: string;
  namaGedung: string;
  tanggal: string;
  jamMulai: string;
  jamSelesai: string;
  durasi: number;
  fasilitas: {
    nama: string;
    harga: number;
    satuan?: string;
  }[];
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
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUserInfo({
        namaLengkap: userData.nama || "",
        email: userData.email || "",
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

    const dataToSend = new FormData();
    dataToSend.append('ruanganId', String(state.ruanganId));
    dataToSend.append('gedungId', String(state.gedungId));
    dataToSend.append('tanggalPinjam', state.tanggal);
    dataToSend.append('jamMulai', state.jamMulai);
    dataToSend.append('jamSelesai', state.jamSelesai);
    if (formData.nomorTelepon) dataToSend.append('nomorTelepon', formData.nomorTelepon);
    if (formData.catatanTambahan) dataToSend.append('catatanTambahan', formData.catatanTambahan);

    // --- PERUBAHAN 1: Mengubah harga semua fasilitas menjadi 0 sebelum mengirim ---
    const fasilitasDenganHargaNol = state.fasilitas.map(f => ({ ...f, harga: 0 }));
    dataToSend.append('fasilitasTambahanTerpilih', JSON.stringify(fasilitasDenganHargaNol));

    if (formData.dokumen) {
      dataToSend.append("suratIzin", formData.dokumen);
    }

    try {
      const response = await fetch('http://127.0.0.1:3001/peminjaman', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: dataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gagal melakukan peminjaman');
      }

      alert('Pengajuan peminjaman berhasil! Anda akan diarahkan ke halaman riwayat.');
      navigate("/riwayat-internal");

    } catch (error) {
      console.error("Error konfirmasi peminjaman:", error);
      setErrorMessage(`Terjadi Kesalahan: ${(error as Error).message}`);
    }
  };

  if (!state) {
    return (
      <Container className="text-center mt-5">
        <h4>Data peminjaman tidak ditemukan.</h4>
        <p>Silakan kembali ke halaman beranda dan pilih ruangan terlebih dahulu.</p>
        <Button variant="primary" onClick={() => navigate('/')}>
          Kembali ke Beranda
        </Button>
      </Container>
    );
  }

  // --- PERUBAHAN 2: Menetapkan total harga menjadi 0 ---
  const totalHargaFasilitas = 0;

  return (
    <div className="bg-light d-flex align-items-center justify-content-center min-vh-100">
      <Container className="py-4">
        
        <h5 className="mb-3">Isi Identitas</h5>
        <Card className="p-4 mb-5">
          <Form>
            <Row className="mb-3">
              <Col md={4}><Form.Group><Form.Label>Nama Lengkap</Form.Label><Form.Control value={userInfo.namaLengkap} disabled /></Form.Group></Col>
              <Col md={4}><Form.Group><Form.Label>Alamat Email</Form.Label><Form.Control value={userInfo.email} disabled /></Form.Group></Col>
            </Row>
            <Row className="mb-3">
              <Col md={6}><Form.Group><Form.Label>Nomor Telepon</Form.Label><Form.Control type="tel" name="nomorTelepon" value={formData.nomorTelepon} onChange={handleChange} placeholder="Masukkan nomor telepon Anda" /></Form.Group></Col>
              <Col md={6}><Form.Group><Form.Label>Surat izin peminjaman (PDF, Opsional)</Form.Label><Form.Control type="file" accept="application/pdf" onChange={handleFileChange} /></Form.Group></Col>
            </Row>
            <Row><Col md={12}><Form.Group><Form.Label>Catatan Tambahan</Form.Label><Form.Control as="textarea" rows={3} name="catatanTambahan" value={formData.catatanTambahan} onChange={handleChange} placeholder="Contoh: Butuh teknisi untuk pengaturan proyektor" /></Form.Group></Col></Row>
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
              <div key={f.nama} className="d-flex justify-content-between text-muted">
                <span>{f.nama}</span>
                {/* --- PERUBAHAN 3: Menampilkan harga Rp0 untuk setiap fasilitas --- */}
                <span>Rp0</span>
              </div>
            )) : <div className="text-muted"><span>Tidak ada fasilitas tambahan</span></div>}
          <hr />
          <div className="d-flex justify-content-between"><strong>Total harga</strong><strong className="text-dark">Rp{totalHargaFasilitas.toLocaleString('id-ID')}</strong></div>
        </Card>

        <div className="text-center mt-4">
          <Button variant="primary" onClick={handleKonfirmasi} style={{ backgroundColor: '#A084DC', border: 'none', width: '250px' }}>
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