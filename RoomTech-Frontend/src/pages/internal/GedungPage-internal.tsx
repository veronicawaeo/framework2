// src/pages/GedungPage.tsx
import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import './GedungPage-internal.css';

const gedungData: { [key: string]: any } = {
  'teknik-sipil-internal': {
    name: 'Gedung Teknik Sipil',
    objectPosition: '50% 10%',
    jamOperasional: '07:00 - 18:00',
    fasilitas: ['WiFi', 'AC Central', 'Lift', 'Toilet', 'Stop Kontak', 'Tempat Parkir Luas'],
    ruangan: [
      {
        nama: 'Auditorium Sipil',
        lokasi: 'Lantai 6',
        kapasitas: 200,
        image: 'images/gedungsipil2.jpeg',
        fasilitasTambahan: [
          { nama: 'Mic Wireless'},
          { nama: 'Proyektor'},
          { nama: 'Whiteboard'},
          { nama: 'Speaker Besar'},
        ],
      },
    ],
    image: 'images/gedungsipil2.jpeg',
  },

  'jte-internal': {
    name: 'Gedung Teknik Elektro',
    objectPosition: '50% 90%',
    jamOperasional: '07:00 - 18:00',
    fasilitas: ['WiFi', 'AC Central', 'Toilet', 'Tempat Parkir Luas'],
    ruangan: [
      {
        nama: 'Creative Room',
        lokasi: 'Lantai 2',
        kapasitas: 120,
        image: 'images/gedungsipil2.jpeg',
        fasilitasTambahan: [
          { nama: 'Whiteboard'},
          { nama: 'Proyektor'},
          { nama: 'HDMI Kabel'},
          { nama: 'TV'},
        ],
      },
      {
        nama: 'Ruang Sidang',
        lokasi: 'Lantai 3 - JTE 11',
        kapasitas: 25,
        image: 'images/gedungsipil2.jpeg',
        fasilitasTambahan: [
          { nama: 'Whiteboard'},
          { nama: 'HDMI Kabel'},
          { nama: 'TV'},  
        ],
      },
    ],
    image: 'images/gedungjte2.jpeg',
  },

  'dekanat-internal': {
    name: 'Gedung Dekanat',
    objectPosition: '50% 10%',
    jamOperasional: '07:00 - 17:00',
    fasilitas: ['WiFi', 'AC Central', 'Toilet', 'Lift', 'Ruang Lobby', 'Stop Kontak', 'Tempat Parkir Luas'],
    ruangan: [
      {
        nama: 'Auditorium',
        lokasi: 'Lantai 5',
        kapasitas: 150,
        image: 'images/gedungsipil2.jpeg',
        fasilitasTambahan: [
          { nama: 'Mic Wireless'},
          { nama: 'Proyektor'},
          { nama: 'Whiteboard'},
          { nama: 'Speaker Besar'},
          { nama: 'Keyboard'},
        ],
      },
    ],
    image: 'images/gedungdekanat2.jpeg',
  },

  'gedung-lab-internal': {
    name: 'Gedung Laboratorium',
    objectPosition: '50% 100%',
    jamOperasional: '07:00 - 20:00',
    fasilitas: ['WiFi', 'AC Central', 'Toilet', 'Mini Pantry', 'Stop Kontak'],
    ruangan: [
      {
        nama: 'Lab Tik & Siber',
        lokasi: 'Lantai 3',
        kapasitas: 20,
        image: 'images/gedungsipil2.jpeg',
        fasilitasTambahan: [
          { nama: 'Monitor'},
          { nama: 'TV'},
          { nama: 'Switch LAN'},
          { nama: 'Meja Tambahan'},
          { nama: 'Headset'},
          { nama: 'Speaker Kecil'},
        ],
      },
      {
        nama: 'Lab Multimedia',
        lokasi: 'Lantai 3',
        kapasitas: 25,
        image: 'images/gedungsipil2.jpeg',
        fasilitasTambahan: [
          { nama: 'Monitor'},
          { nama: 'TV'},
          { nama: 'Kamera DSLR'},
          { nama: 'Tripod'},
          { nama: 'Meja Tambahan'},
        ],
      },
      {
        nama: 'Lab TBD',
        lokasi: 'Lantai 3',
        kapasitas: 30,
        image: 'images/gedungsipil2.jpeg',
        fasilitasTambahan: [
          { nama: 'Monitor'},
          { nama: 'TV'},
          { nama: 'Terminal'},
          { nama: 'Whiteboard'},
          { nama: 'Meja Tambahan'},
        ],
      },
      {
        nama: 'Lab RPL',
        lokasi: 'Lantai 3',
        kapasitas: 15,
        image: 'images/gedungsipil2.jpeg',
        fasilitasTambahan: [
          { nama: 'Monitor'},
          { nama: 'TV'},
          { nama: 'Whiteboard'},
          { nama: 'Switch LAN'},
          { nama: 'Meja Tambahan'},
        ],
      },
    ],
    image: 'images/labimg.jpeg',
  },

  'gedung-pti-internal': {
    name: 'Gedung PTI',
    jamOperasional: '07:00 - 18:00',
    fasilitas: ['PTI-1', 'PTI-2', 'PTI-3'],
    ruangan: [
      {
        nama: 'PTI-1',
        lokasi: 'Lantai 2',
        kapasitas: 40,
        image: 'images/gedungsipil2.jpeg',
        fasilitasTambahan: [
          { nama: 'Monitor'},
          { nama: 'Mic Wireless'},
          { nama: 'Proyektor'},
          { nama: 'Speaker'},
          { nama: 'Kursi Tambahan'},

        ],
      },
      {
        nama: 'PTI-2',
        lokasi: 'Lantai 2',
        kapasitas: 35,
        image: 'images/gedungsipil2.jpeg',
        fasilitasTambahan: [
          { nama: 'Monitor'},
          { nama: 'Mic Wireless'},
          { nama: 'Proyektor'},
          { nama: 'Laser Pointer'},
          { nama: 'Kursi Tambahan'},
        ],
      },
      {
        nama: 'PTI-3',
        lokasi: 'Lantai 2',
        kapasitas: 30,
        image: 'images/gedungsipil2.jpeg',
        fasilitasTambahan: [
          { nama: 'Monitor'},
          { nama: 'Mic Wireless'},
          { nama: 'Proyektor'},
          { nama: 'Terminal'},
          { nama: 'Kursi Tambahan'},
        ],
      },
    ],
    image: 'images/ptiimg.jpeg',
  },
};

const GedungPageInternal: React.FC = () => {
  const { gedungId } = useParams();
  const gedung = gedungData[gedungId ?? ''];

  const [tanggal, setTanggal] = useState<string>('');
  const [jamMulai, setJamMulai] = useState<string>('09:00');
  const [jamSelesai, setJamSelesai] = useState<string>('17:00');
  const [fasilitasDipilih, setFasilitasDipilih] = useState<{ [key: string]: string[] }>({});
  const [ruanganDipilih, setRuanganDipilih] = useState<string>('');

  const userType = localStorage.getItem('userType') || 'umum';

  const navigate = useNavigate();

  const handleKonfirmasi = () => {
    const ruanganData = gedung.ruangan.find((r: any) => r.nama === ruanganDipilih);
    const fasilitasTerpilih = fasilitasDipilih[ruanganDipilih] || [];

    const durasi =
      (new Date(`1970-01-01T${jamSelesai}`).getTime() -
      new Date(`1970-01-01T${jamMulai}`).getTime()) /
      (1000 * 60 * 60);

    const fasilitasFinal = ruanganData.fasilitasTambahan.filter((f: any) =>
      fasilitasTerpilih.includes(f.nama)
    );

    navigate('/konfirmasi-internal', {
      state: {
        namaGedung: gedung.name,
        namaRuangan: ruanganDipilih,
        tanggal,
        durasi,
        fasilitas: fasilitasFinal,
        statusRuangan: 'Tersedia', 
        userType,
      },
    });
  };


  const handleToggleFasilitas = (namaRuangan: string, namaFasilitas: string) => {
    setFasilitasDipilih((prev) => {
      const fasilitasSaatIni = prev[namaRuangan] || [];
      const sudahDipilih = fasilitasSaatIni.includes(namaFasilitas);

      return {
        ...prev,
        [namaRuangan]: sudahDipilih
          ? fasilitasSaatIni.filter((f) => f !== namaFasilitas)
          : [...fasilitasSaatIni, namaFasilitas],
      };
    });
  };

  const handlePilihRuangan = (namaRuangan: string) => {
    setRuanganDipilih(namaRuangan);
  };  

  if (!gedung) {
    return <div className="text-center mt-5">Gedung tidak ditemukan.</div>;
  }

  return (
    <div className="container mt-5">
      <Link to="/" className="btn btn-outline-ungu mb-4">← Kembali</Link>
      
      <div className="position-relative mb-4 rounded overflow-hidden" style={{ maxHeight: '400px' }}>
      <img
        src={`/${gedung.image}`}
        alt={gedung.name}
        className="img-fluid w-100"
        style={{
          height: '400px',
          objectFit: 'cover',
          filter: 'brightness(0.4)',
          objectPosition: gedung.objectPosition || 'center',
        }}
      />

      <div
        className="position-absolute top-50 start-50 translate-middle text-white text-center"
        style={{ textShadow: '0 2px 4px rgba(0,0,0,0.6)' }}
      >
        <h2 className="fw-bold">{gedung.name}</h2>
        {gedung.jamOperasional && (
          <p className="mt-1 mb-0">Jam Operasional: {gedung.jamOperasional}</p>
        )}
      </div>
    </div>


      {/* Pilihan Tanggal & Jam */}
      <div className="rounded-4 bg-white shadow-sm p-3 my-4">
        <div className="d-flex flex-wrap border rounded-4 overflow-hidden">
          <div className="col-md-6 border-end p-3">
            <strong>Hari/Tanggal</strong>
            <div className="text-muted mt-1">
              {tanggal
                ? new Date(tanggal).toLocaleDateString('id-ID', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })
                : 'Pilih tanggal'}
            </div>
            <input
              type="date"
              className="form-control mt-2"
              value={tanggal}
              onChange={(e) => setTanggal(e.target.value)}
            />
          </div>
          <div className="col-md-6 p-3">
            <strong>Waktu</strong>
            <div className="text-muted mt-1">{jamMulai} - {jamSelesai}</div>
            <div className="d-flex gap-2 mt-2">
              <input
                type="time"
                className="form-control"
                value={jamMulai}
                onChange={(e) => setJamMulai(e.target.value)}
              />
              <span className="align-self-center">s/d</span>
              <input
                type="time"
                className="form-control"
                value={jamSelesai}
                onChange={(e) => setJamSelesai(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <h4 className="mt-5 mb-3 fw-semibold">Fasilitas Gedung</h4>
      <div className="row">
        {gedung.fasilitas.map((fasilitas: string, index: number) => (
          <div key={index} className="col-md-3 mb-3">
            <div className="border p-3 rounded text-center bg-light">
              <i className="bi bi-building me-2"></i> {fasilitas}
            </div>
          </div>
        ))}
      </div>

      <h4 className="mt-5 mb-3 fw-semibold">Pilih Ruangan</h4>
      <div className="row">
        {gedung.ruangan.map((room: any, idx: number) => (
          <div key={idx} className="col-md-6 mb-4">
            <div className="card shadow-sm">
              {room.image && (
                <img
                src={`/${room.image}`}
                alt={room.nama}
                className="card-img-top"
                style={{ maxHeight: '200px', objectFit: 'cover' }}
                />
              )}

              <div className="card-body">
                <div className="form-check mb-2">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="pilihRuangan"
                    id={`ruangan-${room.nama}`}
                    checked={ruanganDipilih === room.nama}
                    onChange={() => handlePilihRuangan(room.nama)}
                  />
                  <label className="form-check-label" htmlFor={`ruangan-${room.nama}`}>
                    Pilih Ruangan Ini
                  </label>
                </div>

                <h5 className="card-title fw-bold">{room.nama}</h5>
                <p className="card-text mb-1">Lokasi: {room.lokasi ?? '-'}</p>
                <p className="card-text">Kapasitas: {room.kapasitas} orang</p>

           

                {userType === 'umum' && (
                  <>
                    {room.fasilitasTambahan?.length > 0 && (
                      <div className="mt-3">
                        <p className="fw-semibold mb-1">Fasilitas Tambahan:</p>
                        <ul className="list-unstyled mb-0">
                          {room.fasilitasTambahan.map((item: any, i: number) => (
                            <li key={i} className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                id={`${room.nama}-${item.nama}`}
                                checked={
                                  fasilitasDipilih[room.nama]?.includes(item.nama) || false
                                }
                                onChange={() =>
                                  handleToggleFasilitas(room.nama, item.nama)
                                }
                              />
                              <label
                                className="form-check-label ms-2"
                                htmlFor={`${room.nama}-${item.nama}`}
                              >
                                {item.nama}
                              </label>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="text-center mt-4">
        <button
          className="btn btn-ungu px-4 py-2"
          disabled={!ruanganDipilih}
          onClick={handleKonfirmasi}
        >
          Konfirmasi Ruangan
        </button>
      </div>
    </div>
  );
};

export default GedungPageInternal;