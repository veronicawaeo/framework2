import { Controller, Post, Body, Req, Get, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { PeminjamanService } from './peminjaman.service';
import { CreatePeminjamanDto } from './dto/create-peminjaman.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('peminjaman')
export class PeminjamanController {
  constructor(private readonly peminjamanService: PeminjamanService) {}

  @Post()
  @UseInterceptors(FileInterceptor('suratIzin'))
  async createPeminjaman(
    @Body() dto: CreatePeminjamanDto,
    @Req() req: any,
    @UploadedFile()
    suratIzinFile?: Express.Multer.File,
  ) {
    if (suratIzinFile && suratIzinFile.mimetype !== 'application/pdf') {
      throw new BadRequestException('Validation failed: Hanya file PDF yang diizinkan.');
    }

    const currentUser = req.user || { userId: 1, user_id: 1 }; 
    return this.peminjamanService.createPeminjaman(dto, currentUser, suratIzinFile);
  }

  @Get('riwayat')
  async getRiwayatPeminjaman(@Req() req: any) {
    const userId = req.user?.userId || 1;
    return this.peminjamanService.findPeminjamanByUserId(userId);
  }
}
