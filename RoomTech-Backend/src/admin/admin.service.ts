import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StatusPeminjaman, Prisma, user, StatusRuangan } from '@prisma/client';
// import { RoomDto } from './dto/room.dto';
// import * as fs from 'fs';
// import * as path from 'path';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async findAllPeminjaman() {
    return this.prisma.peminjaman.findMany({
      orderBy: {
        tanggal_pemesanan: 'desc', 
      },
      include: {
        user: true,
        gedung: true,
        ruangan: true,
      },
    });
  }

  async updatePeminjamanStatus(peminjamanId: number, status: StatusPeminjaman) {
    const peminjaman = await this.prisma.peminjaman.findUnique({
      where: { peminjaman_id: peminjamanId },
    });

    if (!peminjaman) {
      throw new NotFoundException(`Peminjaman dengan ID ${peminjamanId} tidak ditemukan.`);
    }
    return this.prisma.peminjaman.update({
      where: { peminjaman_id: peminjamanId },
      data: { status_peminjaman: status },
    });
  }

  // async findAllRooms() {
  //   return this.prisma.ruangan.findMany({
  //     include: { gedung: { select: { nama_gedung: true } } },
  //     orderBy: { gedungId: 'asc' },
  //   });
  // }

  // async createRoom(dto: RoomDto, gambarFile?: Express.Multer.File) {
  //   let gambarDbPath: string | undefined = undefined;
  //   if (gambarFile) {
  //     const relativeUploadDir = path.join('uploads', 'ruangan');
  //     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
  //     const extension = path.extname(gambarFile.originalname);
  //     const filename = `${uniqueSuffix}${extension}`;
  //     const absoluteUploadDir = path.resolve(process.cwd(), relativeUploadDir);
  //     const destinationPath = path.join(absoluteUploadDir, filename);

  //     if (!fs.existsSync(absoluteUploadDir)) {
  //       fs.mkdirSync(absoluteUploadDir, { recursive: true });
  //     }
  //     fs.renameSync(gambarFile.path, destinationPath);
  //     gambarDbPath = path.join(relativeUploadDir, filename).replace(/\\/g, "/");
  //   }

  //   return this.prisma.ruangan.create({
  //     data: {
  //       ...dto,
  //       gambar_ruangan: gambarDbPath,
  //       harga_ruangan: dto.harga_ruangan || 0,
  //     },
  //   });
  // }

  // async updateRoom(roomId: number, dto: RoomDto, gambarFile?: Express.Multer.File) {
  //   const dataToUpdate: Prisma.ruanganUpdateInput = { ...dto };

  //   if (gambarFile) {
  //     const relativeUploadDir = path.join('uploads', 'ruangan');
  //     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
  //     const extension = path.extname(gambarFile.originalname);
  //     const filename = `${uniqueSuffix}${extension}`;
  //     const absoluteUploadDir = path.resolve(process.cwd(), relativeUploadDir);
  //     const destinationPath = path.join(absoluteUploadDir, filename);

  //     if (!fs.existsSync(absoluteUploadDir)) {
  //       fs.mkdirSync(absoluteUploadDir, { recursive: true });
  //     }
  //     fs.renameSync(gambarFile.path, destinationPath);
  //     dataToUpdate.gambar_ruangan = path.join(relativeUploadDir, filename).replace(/\\/g, "/");
  //   }
    
  //   return this.prisma.ruangan.update({
  //     where: { ruang_id: roomId },
  //     data: dataToUpdate,
  //   });
  // }

  // async deleteRoom(roomId: number) {
  //   const room = await this.prisma.ruangan.findUnique({ where: { ruang_id: roomId } });
  //   if (!room) {
  //     throw new NotFoundException(`Ruangan dengan ID ${roomId} tidak ditemukan.`);
  //   }
  //   return this.prisma.ruangan.delete({ where: { ruang_id: roomId } });
  // }
}