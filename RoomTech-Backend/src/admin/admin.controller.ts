import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards, ParseIntPipe, BadRequestException, UseInterceptors, UploadedFile } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AuthGuard } from '@nestjs/passport';
import { StatusPeminjaman } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('admin')
@UseGuards(AuthGuard('jwt')) 
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('peminjaman')
  async getAllPeminjaman() {
    return this.adminService.findAllPeminjaman();
  }

  @Patch('peminjaman/:id/status')
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status') status: StatusPeminjaman,
  ) {
    if (!['DISETUJUI', 'DITOLAK', 'DIBATALKAN', 'MENUNGGU_PERSETUJUAN'].includes(status)) {
        throw new BadRequestException('Status tidak valid.');
    }
    return this.adminService.updatePeminjamanStatus(id, status);
  }

  // @Get('ruangan')
  // async getAllRooms() {
  //   return this.adminService.findAllRooms();
  // }

  // @Post('ruangan')
  // @UseInterceptors(FileInterceptor('gambar_ruangan'))
  // async createRoom(
  //   @Body() dto: RoomDto,
  //   @UploadedFile() file?: Express.Multer.File,
  // ) {
  //   return this.adminService.createRoom(dto, file);
  // }

  // @Patch('ruangan/:id')
  // @UseInterceptors(FileInterceptor('gambar_ruangan'))
  // async updateRoom(
  //   @Param('id', ParseIntPipe) id: number,
  //   @Body() dto: RoomDto,
  //   @UploadedFile() file?: Express.Multer.File,
  // ) {
  //   return this.adminService.updateRoom(id, dto, file);
  // }
  
  // @Delete('ruangan/:id')
  // async deleteRoom(@Param('id', ParseIntPipe) id: number) {
  //   return this.adminService.deleteRoom(id);
  // }
}
