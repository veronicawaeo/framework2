import React, { useState, useEffect } from 'react'; 
import './RiwayatPeminjaman-internal.css';

interface ProgressBarProps {
  status: string;
  userType: 'INTERNAL' | 'UMUM' | null;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ status, userType }) => {
  const isRejected = status === 'DITOLAK' || status === 'DIBATALKAN';
  const isFullyCompleted = status === 'DISETUJUI' || status === 'SELESAI';

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

  const stepsInternal = ['Pengajuan', 'Persetujuan', 'Disetujui'];
  const stepsUmum = ['Pengajuan', 'Pembayaran', 'Persetujuan', 'Disetujui'];
  const steps = userType === 'UMUM' ? stepsUmum : stepsInternal;

  let activeStep = -1;
  if (status === 'PENGAJUAN') activeStep = (userType === 'UMUM' ? 1 : 1); 
  if (status === 'MENUNGGU_PERSETUJUAN') activeStep = (userType === 'UMUM' ? 2 : 2);
  if (isFullyCompleted) activeStep = steps.length; 

  return (
    <div className="progress-container mb-4">
      {steps.map((stepName, index) => {
        let stepClass = 'progress-step';
        if (index < activeStep) {
          stepClass += ' completed';
        } else if (index === activeStep) {
          stepClass += ' active';
        }
        
        return (
          <div key={stepName} className={stepClass}>
            <div className="circle">{index < activeStep ? '✔' : ''}</div>
            <p>{stepName}</p>
          </div>
        );
      })}
    </div>
  );
};

const RiwayatInternal = () => {
 const [expandedRow, setExpandedRow] = useState<number | null>(null);
 const [dataRiwayat, setDataRiwayat] = useState<any[]>([]);
 const [currentUserName, setCurrentUserName] = useState<string>('Anda');
 const [userType, setUserType] = useState<'INTERNAL' | 'UMUM' | null>(null);

 useEffect(() => {
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    const userData = JSON.parse(storedUser);
    setCurrentUserName(userData.nama || 'Anda');
    setUserType(userData.user_type || 'UMUM');
  } else {
    setUserType('UMUM');
  }

  const fetchRiwayat = async () => {
    try {
      const response = await fetch('${process.env.REACT_APP_API_URL}/peminjaman/riwayat', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) throw new Error('Gagal mengambil riwayat peminjaman');
      const data = await response.json();

      console.log('Raw data from API:', data);

    const mappedData = data.map((item: any) => {
        const fasilitasTotal = item.fasilitas_tambahan_terpilih?.reduce((total: number, fasilitas: any) =>
          total + (fasilitas.harga_fasilitas || 0), 0) || 0;
        const ruanganHarga = item.ruangan?.harga_ruangan || 0;

        return {
        gedung: item.gedung.nama_gedung,
          ruangan: item.ruangan.nama_ruangan,
          tanggal: new Date(item.tanggal_pinjam).toLocaleDateString('id-ID', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          }),
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
          totalHarga: item.total_harga || 0, 
          kodeBilling: `88${item.peminjaman_id}${new Date(item.tanggal_pemesanan).getTime().toString().slice(-6)}`,
          };
        });

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
       <th>Tanggal Peminjaman</th>
       <th>Jam Peminjaman</th>
       <th>Dipinjam Oleh</th>
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
          <td colSpan={7}>
           <div className="billing-info p-3 rounded shadow-sm bg-light text-start">
            <ProgressBar status={item.originalStatus} userType={userType} />

            <hr/>

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

            {userType === 'UMUM' && (
              <>
                <p>
                  <strong>Total Harga:</strong>
                  <span style={{ color: 'red' }}>
                    {` Rp${item.totalHarga.toLocaleString('id-ID')}`}
                  </span>
                </p>
                <p className="mt-3">
                  <strong>Kode Billing:</strong>
                  <span className="badge bg-secondary ms-2 fs-6">{item.kodeBilling}</span>
                </p>
                <div className="alert alert-info mt-2" role="alert">
                  <small>
                    Silakan lakukan pembayaran ke ATM terdekat menggunakan Kode Billing di atas.
                  </small>
                </div>
              </>
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
