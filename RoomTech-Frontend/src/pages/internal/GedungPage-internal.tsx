import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import './GedungPage-internal.css';

interface Fasilitas {
  fasilitas_id: number;
  nama_fasilitas: string;
  harga_fasilitas: number;
  satuan?: string;
}

interface Ruangan {
  ruang_id: number;
  nama_ruangan: string;
  lokasi_ruangan: string;
  kapasitas_ruangan: number;
  harga_ruangan: number;
  gambar_ruangan?: string;
  fasilitasTambahan: Fasilitas[];
}

interface Gedung {
  gedung_id: number;
  nama_gedung: string;
  gambar_gedung?: string;
  fasilitas_gedung: string;
  jam_buka?: string;
  jam_tutup?: string;
  ruangan: Ruangan[];
}

const GedungPageInternal: React.FC = () => {
  const { gedungId } = useParams<{ gedungId: string }>();
  const navigate = useNavigate();

  const [gedung, setGedung] = useState<Gedung | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [userType, setUserType] = useState<'INTERNAL' | 'UMUM' | null>(null);

  const [tanggal, setTanggal] = useState<string>('');
  const [jamMulai, setJamMulai] = useState<string>('09:00');
  const [jamSelesai, setJamSelesai] = useState<string>('17:00');
  const [ruanganDipilih, setRuanganDipilih] = useState<Ruangan | null>(null);
  const [fasilitasDipilih, setFasilitasDipilih] = useState<Set<number>>(new Set());
  const [validationError, setValidationError] = useState<string | null>(null);

  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const userData = localStorage.getItem('user');
    setUserType(userData ? JSON.parse(userData).user_type || 'UMUM' : 'UMUM');

    const fetchGedungDetail = async () => {
      if (!gedungId) {
        setError('ID Gedung tidak valid.');
        setLoading(false);
        return;
      }
      
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${apiUrl}/gedung/${gedungId}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Gedung tidak dapat ditemukan.');
        }

        const data = await response.json();
        
        const mappedGedung: Gedung = {
          ...data,
          ruangan: data.ruangan.map((room: any) => ({
            ...room,
            fasilitasTambahan: room.fasilitas.map((fas: any) => fas.fasilitas),
          })),
        };
        
        setGedung(mappedGedung);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Terjadi kesalahan tidak dikenal');
      } finally {
        setLoading(false);
      }
    };

    fetchGedungDetail();
  }, [gedungId, apiUrl]);

  const handlePilihRuangan = (room: Ruangan) => {
    setRuanganDipilih(room);
    setFasilitasDipilih(new Set());
    setValidationError(null);
  };

  const handleToggleFasilitas = (fasilitasId: number) => {
    setFasilitasDipilih(prev => {
      const newSet = new Set(prev);
      if (newSet.has(fasilitasId)) {
        newSet.delete(fasilitasId);
      } else {
        newSet.add(fasilitasId);
      }
      return newSet;
    });
  };

  const handleKonfirmasi = () => {
    if (!ruanganDipilih || !tanggal) {
      setValidationError("Harap pilih ruangan dan tanggal terlebih dahulu.");
      return;
    }
    
    setValidationError(null);
    if (!gedung) return;

    const durasi = (new Date(`1970-01-01T${jamSelesai}:00`).getTime() - new Date(`1970-01-01T${jamMulai}:00`).getTime()) / (3600 * 1000);
    if (durasi <= 0) {
        setValidationError("Jam selesai harus setelah jam mulai.");
        return;
    }

    let fasilitasFinal: Fasilitas[] = [];
    if (userType === 'UMUM') {
      fasilitasFinal = ruanganDipilih.fasilitasTambahan.filter(f => fasilitasDipilih.has(f.fasilitas_id));
    } else {
      fasilitasFinal = ruanganDipilih.fasilitasTambahan; 
    }

    navigate('/konfirmasi-internal', {
      state: {
        namaGedung: gedung.nama_gedung,
        gedungId: gedung.gedung_id,
        ruanganId: ruanganDipilih.ruang_id,
        hargaRuangan: ruanganDipilih.harga_ruangan,
        namaRuangan: ruanganDipilih.nama_ruangan,
        tanggal, jamMulai, jamSelesai, durasi,
        fasilitas: fasilitasFinal,
        statusRuangan: 'Tersedia',
      },
    });
  };

  if (loading || !userType) {
    return <div className="text-center mt-5"><h3>Memuat data gedung...</h3></div>;
  }

  if (error) {
    return (
      <div className="container text-center mt-5">
        <h4>Oops! Terjadi Kesalahan</h4>
        <p>{error}</p>
        <Button onClick={() => navigate(-1)} variant="primary">Kembali</Button>
      </div>
    );
  }
  
  if (!gedung) {
    return (
      <div className="container text-center mt-5">
        <h4>Gedung Tidak Ditemukan</h4>
        <p>Gedung yang Anda cari tidak tersedia.</p>
        <Button onClick={() => navigate('/')} variant="primary">Kembali ke Beranda</Button>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <Link to="/home-internal" className="btn btn-outline-dark mb-4">← Kembali</Link>
    
      <div className="position-relative mb-4 rounded overflow-hidden" style={{ maxHeight: '400px' }}>
        <img src={gedung.gambar_gedung ? `/${gedung.gambar_gedung}` : '/images/default-gedung.png'} alt={gedung.nama_gedung} className="img-fluid w-100" style={{ height: '400px', objectFit: 'cover', filter: 'brightness(0.5)' }} />
        <div className="position-absolute top-50 start-50 translate-middle text-white text-center px-3">
          <h2 className="fw-bold">{gedung.nama_gedung}</h2>
          {gedung.jam_buka && gedung.jam_tutup && (
            <p>
              Jam Operasional: {new Date(gedung.jam_buka).toLocaleTimeString('id-ID', {hour:'2-digit', minute:'2-digit', timeZone: 'UTC'})} - {new Date(gedung.jam_tutup).toLocaleTimeString('id-ID', {hour:'2-digit', minute:'2-digit', timeZone: 'UTC'})}
            </p>
          )}
        </div>
      </div>

      <h4 className="mt-5 mb-3 fw-semibold">Pilih Tanggal dan Waktu</h4>
      <div className="rounded-4 bg-white shadow-sm p-3 my-4">
        <div className="d-flex flex-column flex-md-row border rounded-4 overflow-hidden">
          <div className="col-12 col-md-6 border-end-md p-3">
            <strong>Hari/Tanggal</strong>
            <div className="text-muted mt-1">{tanggal ? new Date(tanggal).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : 'Pilih tanggal'}</div>
            <input type="date" className="form-control mt-2" value={tanggal} onChange={(e) => setTanggal(e.target.value)} />
          </div>
          <div className="col-12 col-md-6 p-3">
            <strong>Waktu</strong>
            <div className="text-muted mt-1">{jamMulai} - {jamSelesai}</div>
            <div className="d-flex gap-2 mt-2">
              <input type="time" className="form-control" value={jamMulai} onChange={(e) => setJamMulai(e.target.value)} />
              <span className="align-self-center">s/d</span>
              <input type="time" className="form-control" value={jamSelesai} onChange={(e) => setJamSelesai(e.target.value)} />
            </div>
          </div>
        </div>
      </div>

      <h4 className="mt-5 mb-3 fw-semibold">Fasilitas Gedung</h4>
      <div className="row">
        {gedung.fasilitas_gedung.split(',').map((f, i) => (
          <div key={i} className="col-md-4 col-sm-6 mb-3">
            <div className="border p-3 rounded text-center bg-light h-100">{f.trim()}</div>
          </div>
        ))}
      </div>

      <h4 className="mt-5 mb-3 fw-semibold">Pilih Ruangan</h4>
      <div className="row">
        {gedung.ruangan.map((room) => (
          <div key={room.ruang_id} className="col-md-6 mb-4">
            <div className="card shadow-sm h-100">
              <img src={room.gambar_ruangan ? `/${room.gambar_ruangan}` : '/images/default-room.png'} alt={room.nama_ruangan} className="card-img-top" style={{ height: '200px', objectFit: 'cover' }} />
              <div className="card-body d-flex flex-column">
                <div className="form-check mb-2">
                  <input className="form-check-input" type="radio" name="pilihRuangan" id={`ruangan-${room.ruang_id}`} checked={ruanganDipilih?.ruang_id === room.ruang_id} onChange={() => handlePilihRuangan(room)} />
                  <label className="form-check-label fw-bold" htmlFor={`ruangan-${room.ruang_id}`}>Pilih Ruangan Ini</label>
                </div>
                <h5 className="card-title">{room.nama_ruangan}</h5>
                <p className="card-text text-muted small mb-1">Lokasi: {room.lokasi_ruangan ?? '-'}</p>
                <p className="card-text text-muted small">Kapasitas: {room.kapasitas_ruangan} orang</p>

                {userType === 'UMUM' && (
                  <p className="card-text fw-bold text-primary mt-2">
                    Harga Sewa: Rp{room.harga_ruangan.toLocaleString('id-ID')} / jam
                  </p>
                )}
                
                {room.fasilitasTambahan?.length > 0 && (
                  <div className="mt-3 pt-3 border-top">
                    <p className="fw-semibold mb-2">Fasilitas Tambahan:</p>
                    {userType === 'UMUM' ? (
                      <ul className="list-unstyled mb-0">
                        {room.fasilitasTambahan.map((item) => (
                          <li key={item.fasilitas_id} className="form-check">
                            <input className="form-check-input" type="checkbox" id={`${room.ruang_id}-${item.fasilitas_id}`} checked={fasilitasDipilih.has(item.fasilitas_id)} onChange={() => handleToggleFasilitas(item.fasilitas_id)} disabled={ruanganDipilih?.ruang_id !== room.ruang_id}/>
                            <label className="form-check-label ms-2" htmlFor={`${room.ruang_id}-${item.fasilitas_id}`}>
                              {item.nama_fasilitas} - Rp{item.harga_fasilitas.toLocaleString('id-ID')}
                            </label>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <ul className="list-unstyled mb-0 text-muted small">
                        {room.fasilitasTambahan.map((item) => (
                          <li key={item.fasilitas_id}>
                            <i className="bi bi-check-circle-fill text-success me-2"></i>{item.nama_fasilitas} (Termasuk)
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="text-center my-4">
        <Button onClick={handleKonfirmasi} className="btn-konfirmasi px-5 py-2">
          Konfirmasi Ruangan
        </Button>
        {validationError && <p className="text-danger mt-2 small">{validationError}</p>}
      </div>
    </div>
  );
};

export default GedungPageInternal;