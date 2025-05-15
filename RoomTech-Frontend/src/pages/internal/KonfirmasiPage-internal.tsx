import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
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

const KonfirmasiPageInternal: React.FC<KonfirmasiPageProps> = ({
  userType,
  namaRuangan,
  namaGedung,
  tanggal,
  durasi,
  harga,
  fasilitas,
  statusRuangan,
}) => {
  const navigate = useNavigate();

  // State untuk menyimpan data form
  const [formData, setFormData] = useState({
    namaLengkap: "",
    email: "",
    nomorTelepon: "",
    catatanTambahan: "",
    dokumen: null as File | null,
  });

  // Load user data (misalnya, dari localStorage atau context)
  useEffect(() => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        setFormData(prev => ({
          ...prev,
          namaLengkap: userData.nama || "",
          email: userData.email || "",
        }));
      }
    }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setFormData((prev) => ({ ...prev, dokumen: file }));
    } else {
      alert("Hanya file PDF yang diperbolehkan.");
      e.target.value = "";
    }
  };

  const totalFasilitas = fasilitas.reduce((acc, f) => acc + f.harga, 0);
  const totalHarga = harga + totalFasilitas;

  const handleKonfirmasi = () => {
    const dataToSave = {
      identitas: formData,
      ringkasan: {
        userType,
        namaRuangan,
        namaGedung,
        tanggal,
        durasi,
        harga,
        fasilitas,
        statusRuangan,
        totalFasilitas,
        totalHarga,
      },
    };
    localStorage.setItem("riwayatPeminjaman", JSON.stringify(dataToSave));
    navigate("/riwayat-internal");
  };

  return (
    <div className="bg-light py-4">
      <Container>
        <h5 className="mb-3">Isi Identitas</h5>
        <Card className="p-4 mb-5" style={{ backgroundColor: "#fff", border: "1px solid #e0e0e0" }}>
          <Form>
            <Row className="mb-3">
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Nama Lengkap</Form.Label>
                  <Form.Control
                    name="namaLengkap"
                    value={formData.namaLengkap}
                    onChange={handleChange}
                    disabled
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Alamat Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled
                  />
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
                      setFormData((prev) => ({ ...prev, nomorTelepon: onlyNums }));
                    }}
                    maxLength={15}
                    placeholder="Masukkan nomor telepon Anda"
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
                    name="catatanTambahan"
                    placeholder="Contoh: Butuh teknisi untuk pengaturan ruangan"
                    value={formData.catatanTambahan}
                    onChange={handleChange}
                    style={{ fontWeight: 300, color: "#333" }}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Card>

        <h5 className="mb-3">Konfirmasi Peminjaman</h5>
        <Card className="p-4 mb-4" style={{ backgroundColor: "#fff", border: "1px solid #e0e0e0" }}>
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
            <span className="text-muted">Rp0</span>
          </div>

          <div className="mt-3"><strong>Fasilitas Tambahan</strong></div>

          <div className="d-flex justify-content-between text-muted">
            <span>Mic Wireless</span>
            <span>Rp0</span>
          </div>

          <hr />
          <div className="d-flex justify-content-between">
            <strong>Total harga</strong>
            <strong className="text-dark">Rp0</strong>
          </div>
        </Card>

        <div className="text-center">
          <Button
            variant="primary"
            style={{
              backgroundColor: '#A084DC',
              border: 'none',
              width: '250px',
              color: 'white',
              transition: 'background-color 0.3s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#866bc5')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#A084DC')}
            onClick={handleKonfirmasi}
          >
            Konfirmasi Peminjaman
          </Button>
        </div>
      </Container>
    </div>
  );
};

export default KonfirmasiPageInternal;