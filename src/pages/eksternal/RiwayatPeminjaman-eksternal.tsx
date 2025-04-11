import React, { useState, useEffect } from 'react';
import '../eksternal/RiwayatPeminjaman-eksternal.css';

const RiwayatEksternal = () => {
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [kodeBilling, setKodeBilling] = useState('');

  const dataRiwayat = [
    {
      gedung: "Gedung Teknik Sipil",
      ruangan: "Auditorium Sipil",
      tanggal: "Jumat, 11 April 2025",
      jam: "09:00 - 17:00",
      peminjam: "Frico Putung",
      status: "Menunggu Pembayaran",
      harga: "4,200,000"
    },
  ];

  const handleStatusClick = (index: number) => {
    if (expandedRow === index) {
      setExpandedRow(null);
    } else {
      // Ekstrak tanggal dan ubah ke format angka: ddmmyyyy
      const originalDate = dataRiwayat[index].tanggal;
      const match = originalDate.match(/(\d{1,2}) (\w+) (\d{4})/); // Tangkap "11 April 2025"
  
      let tanggalAngka = "00000000"; // Default fallback
      if (match) {
        const day = match[1].padStart(2, '0');
        const monthString = match[2].toLowerCase();
        const year = match[3];
  
        const bulanMap: Record<string, string> = {
          januari: '01',
          februari: '02',
          maret: '03',
          april: '04',
          mei: '05',
          juni: '06',
          juli: '07',
          agustus: '08',
          september: '09',
          oktober: '10',
          november: '11',
          desember: '12',
        };
  
        const month = bulanMap[monthString] || '00';
        tanggalAngka = `${day}${month}${year}`;
      }
  
      const randomSixDigit = Math.floor(100000 + Math.random() * 900000);
      const kode = `${tanggalAngka}${randomSixDigit}`;
      setKodeBilling(kode);
      setExpandedRow(index);
    }
  };  

  return (
    <div className="container mt-5">
      <h2>Riwayat Peminjaman</h2>

      {/* PROGRESS BAR */}
      <div className="progress-container mt-5 mb-5">
        <div className="progress-step completed">
          <div className="circle">✔</div>
          <p>Pengajuan Ruangan</p>
        </div>
        <div className="progress-step active">
          <div className="circle"></div>
          <p>Menunggu Pembayaran</p>
        </div>
        <div className="progress-step">
          <div className="circle"></div>
          <p>Menunggu Persetujuan</p>
        </div>
        <div className="progress-step">
          <div className="circle"></div>
          <p>Telah Disetujui</p>
        </div>
      </div>

      {/* TABEL */}
      <div className="table-responsive mt-5 min-vh-100">
        <table className="table table-bordered table-hover bg-light text-center">
          <thead className="table-light">
            <tr>
              <th>Gedung</th>
              <th>Ruangan</th>
              <th>Hari/Tanggal</th>
              <th>Jam Peminjaman</th>
              <th>Dipinjam Oleh</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {dataRiwayat.map((item, index) => (
              <React.Fragment key={index}>
                <tr>
                  <td>Gedung Laboratorium</td>
                  <td>Lab Tik & Siber</td>
                  <td>Sabtu, 12 April 2025</td>
                  <td>08.00 - 17.00</td>
                  <td>Satria Amu</td>
                  <td>
                    {item.status === "Menunggu Pembayaran" ? (
                      <span
                        className="text-primary fw-bold"
                        style={{ cursor: "pointer" }}
                        onClick={() => handleStatusClick(index)}
                      >
                        {item.status}
                      </span>
                    ) : (
                      item.status
                    )}
                  </td>
                </tr>
                {expandedRow === index && (
                  <tr>
                    <td colSpan={6}>
                      <div className="billing-info p-3 rounded shadow-sm bg-light text-start">
                        <p><strong>Tanggal Peminjaman:</strong> {item.tanggal}</p>
                        <p><strong>Jam Peminjaman:</strong> {item.jam}</p>
                        <p><strong>Kode Billing:</strong> <span className="text-primary fw-bold">{kodeBilling}</span></p>
                        <p><strong>Total Harga:</strong> <span className="text-danger fw-bold">Rp4,560,000</span></p>
                        <div className="alert alert-warning mt-3" role="alert">
                          Lakukan pembayaran ke rekening resmi universitas sebelum batas waktu yang ditentukan.
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RiwayatEksternal;