import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePeminjamanDto } from './dto/create-peminjaman.dto';
import { user } from '@prisma/client';
import { Prisma } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class PeminjamanService {
  constructor(private prisma: PrismaService) {}

  private calculateDuration(jamMulai: string, jamSelesai: string): number {
    const [startHour, startMinute] = jamMulai.split(':').map(Number);
    const [endHour, endMinute] = jamSelesai.split(':').map(Number);
    
    const startDate = new Date(0, 0, 0, startHour, startMinute);
    const endDate = new Date(0, 0, 0, endHour, endMinute);

    if (endDate <= startDate) {
      throw new BadRequestException('Jam selesai harus setelah jam mulai.');
    }
    let diff = endDate.getTime() - startDate.getTime();
    return diff / (1000 * 60 * 60); // durasi dalam jam
  }

  async createPeminjaman(
    dto: CreatePeminjamanDto,
    currentUser: user,
    suratIzinFile?: Express.Multer.File,
  ) {
    const ruangan = await this.prisma.ruangan.findUnique({ where: { ruang_id: dto.ruanganId } });
    if (!ruangan) {
      throw new NotFoundException(`Ruangan dengan ID ${dto.ruanganId} tidak ditemukan.`);
    }
    if (ruangan.gedungId !== dto.gedungId) {
      throw new BadRequestException('ID Gedung tidak sesuai dengan ruangan yang dipilih.');
    }

    const targetTanggal = new Date(dto.tanggalPinjam);
    const overlappingPeminjaman = await this.prisma.peminjaman.findFirst({
      where: {
        ruangan_id: dto.ruanganId,
        tanggal_pinjam: targetTanggal,
        status_peminjaman: { in: ['DISETUJUI', 'PENGAJUAN', 'MENUNGGU_PERSETUJUAN'] },
        AND: [
          { jam_mulai: { lt: dto.jamSelesai } },
          { jam_selesai: { gt: dto.jamMulai } },
        ],
      },
    });

    if (overlappingPeminjaman) {
      throw new BadRequestException(`Ruangan sudah dibooking pada tanggal dan waktu tersebut.`);
    }

    let suratIzinDbPath: string | undefined = undefined;

    if (suratIzinFile) {
      try {
        // --- PERUBAHAN LOGIKA PENYIMPANAN FILE ---
        // Karena Multer dikonfigurasi dengan 'dest', file disimpan sementara.
        // Kita perlu memindahkannya ke lokasi permanen, bukan menulis dari buffer.

        // 1. Tentukan path tujuan akhir
        const relativeUploadDir = path.join('uploads', 'surat_izin');
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = path.extname(suratIzinFile.originalname);
        const filename = `${currentUser.user_id}-${uniqueSuffix}${extension}`;
        
        const absoluteUploadDir = path.resolve(process.cwd(), relativeUploadDir);
        const destinationPath = path.join(absoluteUploadDir, filename);

        // 2. Buat direktori tujuan jika belum ada
        if (!fs.existsSync(absoluteUploadDir)) {
          fs.mkdirSync(absoluteUploadDir, { recursive: true });
        }
        
        // 3. Pindahkan file dari path sementara (suratIzinFile.path) ke path tujuan
        fs.renameSync(suratIzinFile.path, destinationPath);

        // 4. Siapkan path relatif untuk disimpan ke database
        suratIzinDbPath = path.join(relativeUploadDir, filename).replace(/\\/g, "/");
        
      } catch (error) {
        console.error("Detail Kegagalan Pemindahan File:", error); 
        throw new InternalServerErrorException(`Gagal memproses file di server. Pesan Internal: ${error.code || error.message}`);
      }
    }

    const durasi = this.calculateDuration(dto.jamMulai, dto.jamSelesai);
    if (durasi <= 0) {
      throw new BadRequestException('Durasi peminjaman tidak valid.');
    }
    
    let totalHarga = 0;
    if (dto.fasilitasTambahanTerpilih && dto.fasilitasTambahanTerpilih.length > 0) {
      totalHarga = dto.fasilitasTambahanTerpilih.reduce((sum, item) => sum + item.harga, 0);
    }

    const peminjaman = await this.prisma.peminjaman.create({
      data: {
        user_id: currentUser.user_id,
        ruangan_id: dto.ruanganId,
        gedung_id: dto.gedungId,
        tanggal_pinjam: targetTanggal,
        jam_mulai: dto.jamMulai,
        jam_selesai: dto.jamSelesai,
        durasi: durasi,
        catatan_tambahan: dto.catatanTambahan,
        surat_izin_path: suratIzinDbPath,
        fasilitas_tambahan_terpilih: dto.fasilitasTambahanTerpilih
          ? (dto.fasilitasTambahanTerpilih as unknown as Prisma.InputJsonValue)
          : Prisma.JsonNull,
        total_harga: totalHarga,
        status_peminjaman: 'PENGAJUAN',
      },
      include: {
        ruangan: { select: { nama_ruangan: true } },
        gedung: { select: { nama_gedung: true } },
        user: { select: { nama: true, email: true } }
      }
    });
    return peminjaman;
  }

  async findPeminjamanByUserId(userId: number) {
    return this.prisma.peminjaman.findMany({
      where: { user_id: userId },
      orderBy: { tanggal_pemesanan: 'desc' },
      include: {
        ruangan: { select: { nama_ruangan: true } },
        gedung: { select: { nama_gedung: true } },
      },
    });
  }
}