import React, { useState, useEffect } from 'react'; 
// import './RiwayatPeminjaman-internal.css'; // Baris ini dihapus untuk memperbaiki error kompilasi

// --- KOMPONEN BARU UNTUK PROGRESS BAR DINAMIS ---
interface ProgressBarProps {
  status: string;
}

const ProgressBar = ({ status }: ProgressBarProps) => {
  const steps = [
    { name: 'Pengajuan', status: 'PENGAJUAN' },
    { name: 'Persetujuan', status: 'MENUNGGU_PERSETUJUAN' },
    { name: 'Disetujui', status: 'DISETUJUI' },
  ];

  // Menentukan langkah aktif berdasarkan status dari API
  const currentStatusIndex = steps.findIndex(step => step.status === status);

  const isFullyCompleted = status === 'DISETUJUI' || status === 'SELESAI';
  const isRejected = status === 'DITOLAK' || status === 'DIBATALKAN';

  // Tampilan khusus jika peminjaman ditolak atau dibatalkan
  if (isRejected) {
    return (
      <div className="progress-container mb-4">
        <div className="progress-step rejected">
          <div className="circle">✖</div>
          <p>Dibatalkan / Ditolak</p>
        </div>
      </div>
    );
  }

  // Tampilan untuk status normal
  return (
    <div className="progress-container mb-4">
      {steps.map((step, index) => {
        let stepClass = 'progress-step';
        
        if (isFullyCompleted) {
          // Jika sudah disetujui, semua langkah selesai
          stepClass += ' completed';
        } else if (index <= currentStatusIndex) {
          // Jika indeks langkah sama atau sebelum status saat ini, tandai selesai
          stepClass += ' completed';
        } else if (index === currentStatusIndex + 1) {
          // Jika ini adalah langkah berikutnya, tandai aktif
          stepClass += ' active';
        }

        const showCheckmark = isFullyCompleted || index <= currentStatusIndex;

        return (
          <div key={step.name} className={stepClass}>
            <div className="circle">{showCheckmark ? '✔' : ''}</div>
            <p>{step.name}</p>
          </div>
        );
      })}
    </div>
  );
};


// --- KOMPONEN UTAMA ---
const RiwayatInternal = () => {
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [dataRiwayat, setDataRiwayat] = useState<any[]>([]);
  const [currentUserName, setCurrentUserName] = useState<string>('Anda');

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setCurrentUserName(userData.nama || 'Anda'); 
    }

    const fetchRiwayat = async () => {
      try {
        const response = await fetch('http://127.0.0.1:3001/peminjaman/riwayat', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (!response.ok) throw new Error('Gagal mengambil riwayat peminjaman');
        const data = await response.json();

        const mappedData = data.map((item: any) => ({
          gedung: item.gedung.nama_gedung,
          ruangan: item.ruangan.nama_ruangan,
          tanggal: new Date(item.tanggal_pinjam).toLocaleDateString('id-ID', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          }),
          // --- PERUBAHAN 1: Menambahkan data tanggal pengajuan ---
          diajukanTanggal: new Date(item.tanggal_pemesanan).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          }),
          jam: `${item.jam_mulai} - ${item.jam_selesai}`,
          peminjam: item.user?.nama ?? currentUserName,
          status: item.status_peminjaman.replace(/_/g, ' '),
          originalStatus: item.status_peminjaman,
          catatanTambahan: item.catatan_tambahan, 
          suratIzinPath: item.surat_izin_path,
        }));

        setDataRiwayat(mappedData);
      } catch (error) {
        console.error("Error fetching riwayat peminjaman:", error);
      }
    };

    fetchRiwayat();
  }, [currentUserName]);

  const handleStatusClick = (index: number) => {
    setExpandedRow(expandedRow === index ? null : index);
  };

  return (
    <div className="container mt-5">
      <h2>Riwayat Peminjaman</h2>

      <div className="table-responsive mt-5 min-vh-100">
        <table className="table table-bordered table-hover bg-light text-center">
          <thead className="table-light">
            <tr>
              <th>Gedung</th>
              <th>Ruangan</th>
              <th>Hari/Tanggal</th>
              <th>Jam Peminjaman</th>
              <th>Dipinjam Oleh</th>
              {/* --- PERUBAHAN 2: Menambahkan header kolom baru --- */}
              <th>Diajukan Tanggal</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {dataRiwayat.map((item, index) => (
              <React.Fragment key={index}>
                <tr className={expandedRow === index ? 'table-active' : ''}>
                  <td>{item.gedung}</td>
                  <td>{item.ruangan}</td>
                  <td>{item.tanggal}</td>
                  <td>{item.jam}</td>
                  <td>{item.peminjam}</td>
                  {/* --- PERUBAHAN 3: Menambahkan data sel baru --- */}
                  <td>{item.diajukanTanggal}</td>
                  <td>
                    <span
                      className="text-primary fw-bold text-decoration-underline"
                      style={{ cursor: "pointer" }}
                      onClick={() => handleStatusClick(index)}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
                {expandedRow === index && (
                  <tr>
                    {/* --- PERUBAHAN 4: Menyesuaikan colSpan --- */}
                    <td colSpan={7}>
                      <div className="billing-info p-3 rounded shadow-sm bg-light text-start">
                        <ProgressBar status={item.originalStatus} />
                        
                        <hr/>

                        <p><strong>Tanggal Peminjaman:</strong> {item.tanggal}</p>
                        <p><strong>Jam Peminjaman:</strong> {item.jam}</p>
                        {item.catatanTambahan && (
                          <p><strong>Catatan Tambahan:</strong> {item.catatanTambahan}</p>
                        )}
                        {item.suratIzinPath && (
                          <p>
                            <strong>Surat Izin:</strong>{' '}
                            <a 
                              href={`http://127.0.0.1:3001/${item.suratIzinPath}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-decoration-underline"
                            >
                              Lihat Dokumen
                            </a>
                          </p>
                        )}
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

export default RiwayatInternal;