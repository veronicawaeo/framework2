import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import './GedungPage-internal.css';

const GedungPageInternal: React.FC = () => {
  const { gedungId } = useParams<{ gedungId: string }>();
  const navigate = useNavigate();

  const [gedung, setGedung] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [tanggal, setTanggal] = useState<string>('');
  const [jamMulai, setJamMulai] = useState<string>('09:00');
  const [jamSelesai, setJamSelesai] = useState<string>('17:00');
  const [fasilitasDipilih, setFasilitasDipilih] = useState<{ [key: string]: string[] }>({});
  const [ruanganDipilih, setRuanganDipilih] = useState<string>('');
  
  // State baru untuk pesan kesalahan validasi
  const [validationError, setValidationError] = useState<string | null>(null);

  const userType = localStorage.getItem('userType') || 'umum';

  useEffect(() => {
    const fetchGedungDetail = async () => {
      if (!gedungId) {
        setError('ID Gedung tidak valid.');
        setLoading(false);
        return;
      }
      
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`http://127.0.0.1:3001/gedung/${gedungId}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Gedung tidak dapat ditemukan.');
        }

        const data = await response.json();
        
        const mappedRuangan = data.ruangan.map((room: any) => {
          const fasilitasTambahan = room.fasilitas.map((ruanganFasilitas: any) => {
            return {
              id: ruanganFasilitas.fasilitas.fasilitas_id,
              nama: ruanganFasilitas.fasilitas.nama_fasilitas,
              harga: ruanganFasilitas.fasilitas.harga_fasilitas,
              satuan: ruanganFasilitas.fasilitas.satuan,
            };
          });
          return { ...room, fasilitasTambahan };
        });
        
        setGedung({ ...data, ruangan: mappedRuangan });

      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchGedungDetail();
  }, [gedungId]);

  const handleKonfirmasi = () => {
    // Validasi input. Jika gagal, tampilkan pesan error, bukan alert.
    if (!ruanganDipilih || !tanggal) {
        setValidationError("Harap pilih ruangan dan tanggal terlebih dahulu.");
        return;
    }
    
    // Jika berhasil, hapus pesan error dan lanjutkan proses.
    setValidationError(null);
    
    const ruanganData = gedung.ruangan.find((r: any) => r.nama_ruangan === ruanganDipilih);
    if (!ruanganData) return;

    const fasilitasTerpilihUser = fasilitasDipilih[ruanganDipilih] || [];
    const durasi = (new Date(`1970-01-01T${jamSelesai}`).getTime() - new Date(`1970-01-01T${jamMulai}`).getTime()) / (3600 * 1000);

    const fasilitasFinal = ruanganData.fasilitasTambahan
      .filter((f: any) => fasilitasTerpilihUser.includes(f.nama));

    navigate('/konfirmasi-internal', {
      state: {
        namaGedung: gedung.nama_gedung,
        gedungId: gedung.gedung_id,
        ruanganId: ruanganData.ruang_id,
        namaRuangan: ruanganDipilih,
        tanggal, jamMulai, jamSelesai, durasi,
        fasilitas: fasilitasFinal,
        statusRuangan: 'Tersedia',
        userType,
      },
    });
  };
  
  const handleToggleFasilitas = (namaRuangan: string, namaFasilitas: string) => {
    setFasilitasDipilih(prev => {
        const fasilitasSaatIni = prev[namaRuangan] || [];
        const newFasilitas = fasilitasSaatIni.includes(namaFasilitas)
            ? fasilitasSaatIni.filter(f => f !== namaFasilitas)
            : [...fasilitasSaatIni, namaFasilitas];
        return { ...prev, [namaRuangan]: newFasilitas };
    });
  };

  const handlePilihRuangan = (namaRuangan: string) => {
      setRuanganDipilih(namaRuangan);
      setValidationError(null); // Hapus pesan error saat ruangan dipilih
  };

  const handleTanggalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setTanggal(e.target.value);
      setValidationError(null); // Hapus pesan error saat tanggal diubah
  };

  if (loading) {
    return <div className="text-center mt-5"><h3>Memuat data gedung...</h3></div>;
  }

  if (error) {
    return (
      <div className="container text-center mt-5">
        <h4>Oops! Terjadi Kesalahan</h4>
        <p>{error}</p>
        <Button onClick={() => navigate('/')} variant="primary">Kembali ke Beranda</Button>
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
      <Link to="/" className="btn btn-outline-dark mb-4">← Kembali</Link>
      
      <div className="position-relative mb-4 rounded overflow-hidden" style={{ maxHeight: '400px' }}>
        <img src={gedung.gambar_gedung ? `/${gedung.gambar_gedung}` : '/images/default-gedung.png'} alt={gedung.nama_gedung} className="img-fluid w-100" style={{ height: '400px', objectFit: 'cover', filter: 'brightness(0.5)' }} />
        <div className="position-absolute top-50 start-50 translate-middle text-white text-center">
            <h2 className="fw-bold">{gedung.nama_gedung}</h2>
            {gedung.jam_buka && <p>Jam Operasional: {new Date(gedung.jam_buka).toLocaleTimeString('id-ID', {hour:'2-digit', minute:'2-digit', timeZone: 'UTC'})} - {new Date(gedung.jam_tutup).toLocaleTimeString('id-ID', {hour:'2-digit', minute:'2-digit', timeZone: 'UTC'})}</p>}
        </div>
      </div>
      
      <h4 className="mt-5 mb-3 fw-semibold">Pilih Tanggal dan Waktu Peminjaman</h4>
      <div className="rounded-4 bg-white shadow-sm p-3 my-4">
        <div className="d-flex flex-wrap border rounded-4 overflow-hidden">
          <div className="col-md-6 border-end p-3">
            <strong>Hari/Tanggal</strong>
            <div className="text-muted mt-1">{tanggal ? new Date(tanggal).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : 'Pilih tanggal'}</div>
            <input type="date" className="form-control mt-2" value={tanggal} onChange={handleTanggalChange} />
          </div>
          <div className="col-md-6 p-3">
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
        {gedung.fasilitas_gedung.split(',').map((f: string, i: number) => (
          <div key={i} className="col-md-3 mb-3">
            <div className="border p-3 rounded text-center bg-light">{f.trim()}</div>
          </div>
        ))}
      </div>

      <h4 className="mt-5 mb-3 fw-semibold">Pilih Ruangan</h4>
      <div className="row">
        {gedung.ruangan.map((room: any) => (
          <div key={room.ruang_id} className="col-md-6 mb-4">
            <div className="card shadow-sm">
              <img src={room.gambar_ruangan ? `/${room.gambar_ruangan}` : '/images/default-room.png'} alt={room.nama_ruangan} className="card-img-top" style={{ height: '200px', objectFit: 'cover' }} />
              <div className="card-body">
                <div className="form-check mb-2">
                  <input className="form-check-input" type="radio" name="pilihRuangan" id={`ruangan-${room.ruang_id}`} checked={ruanganDipilih === room.nama_ruangan} onChange={() => handlePilihRuangan(room.nama_ruangan)} />
                  <label className="form-check-label" htmlFor={`ruangan-${room.ruang_id}`}>Pilih Ruangan Ini</label>
                </div>
                <h5 className="card-title fw-bold">{room.nama_ruangan}</h5>
                <p className="card-text mb-1">Lokasi: {room.lokasi_ruangan ?? '-'}</p>
                <p className="card-text">Kapasitas: {room.kapasitas_ruangan} orang</p>
                
                {userType === 'umum' && room.fasilitasTambahan?.length > 0 && (
                  <div className="mt-3">
                    <p className="fw-semibold mb-1">Fasilitas Tambahan:</p>
                    <ul className="list-unstyled mb-0">
                      {room.fasilitasTambahan.map((item: any) => (
                        <li key={item.id} className="form-check">
                          <input className="form-check-input" type="checkbox" id={`${room.nama_ruangan}-${item.nama}`} checked={fasilitasDipilih[room.nama_ruangan]?.includes(item.nama) || false} onChange={() => handleToggleFasilitas(room.nama_ruangan, item.nama)} disabled={ruanganDipilih !== room.nama_ruangan}/>
                          <label className="form-check-label ms-2" htmlFor={`${room.nama_ruangan}-${item.nama}`}>{item.nama}</label>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="text-center mt-auto pt-4 pb-4">
        {/* Tombol tidak lagi disabled, validasi ditangani di onClick */}
        <Button onClick={handleKonfirmasi} className="btn-konfirmasi">
          Konfirmasi Ruangan
        </Button>
        {/* Menampilkan pesan error validasi jika ada */}
        {validationError && <p className="text-danger mt-2 small">{validationError}</p>}
      </div>
    </div>
  );
};

export default GedungPageInternal;