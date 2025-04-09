import React, { useState } from "react";
import { Container, Row, Col, Form, Card, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

interface Fasilitas {
  nama: string;
  harga: number;
  satuan: string;
}

interface KonfirmasiPageProps {
  userType: "civitas" | "umum";
  namaRuangan: string;
  namaGedung: string;
  tanggal: string;
  durasi: number;
  harga: number;
  fasilitas: Fasilitas[];
  statusRuangan: string;
}

const KonfirmasiPage: React.FC<KonfirmasiPageProps> = ({
  userType,
  namaRuangan,
  namaGedung,
  tanggal,
  durasi,
  harga,
  fasilitas,
  statusRuangan,
}) => {
  // State untuk form input
  const [formData, setFormData] = useState({
    namaDepan: "",
    namaBelakang: "",
    email: "",
    nomorTelepon: "",
    catatanTambahan: "",
    dokumen: null as File | null,
  });

  // Handle perubahan input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle upload dokumen
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setFormData(prev => ({ ...prev, dokumen: file }));
    } else {
      alert("Hanya file PDF yang diperbolehkan.");
      e.target.value = ""; // reset input
    }
  };

  const totalFasilitas = fasilitas.reduce((acc, f) => acc + f.harga, 0);
  const totalHarga = harga + totalFasilitas;

  return (
    <div className="bg-light py-4">
      <Container>
        {/* --- Form Identitas --- */}
        <h5 className="mb-3">Isi Identitas</h5>
        <Card
            className="p-4 mb-5"
            style={{
                backgroundColor: "#fff",
                boxShadow: "none",
                border: "1px solid #e0e0e0",
                transition: "none",
                transform: "none" 
            }}
        >

          <Form>
            <Row className="mb-3">
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Nama Depan</Form.Label>
                  <Form.Control name="namaDepan" placeholder="Masukkan nama depan Anda" value={formData.namaDepan} onChange={handleChange} />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Nama Belakang</Form.Label>
                  <Form.Control name="namaBelakang" placeholder="Masukkan nama belakang Anda" value={formData.namaBelakang} onChange={handleChange} />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Alamat Email</Form.Label>
                  <Form.Control type="email" name="email" placeholder="Masukkan alamat email Anda" value={formData.email} onChange={handleChange} />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Nomor Telepon</Form.Label>
                  <Form.Control
                    type="tel"
                    name="nomorTelepon"
                    value={formData.nomorTelepon}
                    onChange={(e) => {
                        const onlyNums = e.target.value.replace(/[^0-9]/g, "");
                        setFormData(prev => ({ ...prev, nomorTelepon: onlyNums }));
                    }}
                    maxLength={15}
                    placeholder="Contoh: 081234567890"
                />

                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Surat izin peminjaman (PDF)</Form.Label>
                  <Form.Control type="file" accept="application/pdf" onChange={handleFileChange} />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Catatan Tambahan</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="catatanTambahan (jika ada)"
                    placeholder="Contoh: Butuh teknisi untuk pengaturan ruangan"
                    value={formData.catatanTambahan}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Card>

        {/* --- Ringkasan Konfirmasi --- */}
        <h5 className="mb-3">Konfirmasi Peminjaman</h5>
        <Card
        className="p-4 mb-4"
        style={{
            backgroundColor: "#fff",
            boxShadow: "none",
            border: "1px solid #e0e0e0",
            transition: "none",
            transform: "none"
        }}
        >
        <h6><strong>{namaRuangan} - {namaGedung}</strong></h6>

        <div className="mt-3 d-flex justify-content-between">
            <strong>Status</strong>
            <span className="text-primary">{statusRuangan}</span>
        </div>

        <div className="mt-3 d-flex justify-content-between">
            <strong>Hari, tanggal</strong>
            <span className="text-muted">{tanggal}</span>
        </div>

        <div className="mt-3 d-flex justify-content-between">
            <strong>Durasi</strong>
            <span className="text-muted">{durasi} jam</span>
        </div>

        <div className="mt-1 d-flex justify-content-between">
            <span>Total Harga Durasi</span>
            <span className="text-muted">Rp{harga.toLocaleString()}</span>
        </div>


        <div className="mt-3"><strong>Fasilitas Tambahan</strong></div>
        {fasilitas.map((item, idx) => (
            <div className="d-flex justify-content-between text-muted" key={idx}>
            <span>{item.nama}</span>
            <span>Rp{item.harga.toLocaleString()} /{item.satuan}</span>
        </div>
        ))}

        <hr />
        <div className="d-flex justify-content-between">
            <strong>Total harga</strong>
            <strong className="text-dark">Rp{totalHarga.toLocaleString()}</strong>
        </div>
        </Card>

        <div className="text-center">
          <Button
            variant="primary"
            style={{ background: '#A084DC', border: 'none', width: '250px' }}
            onClick={() => alert("Peminjaman dikonfirmasi!")}
          >
            Konfirmasi Peminjaman
          </Button>
        </div>
      </Container>
    </div>
  );
};

export default KonfirmasiPage;