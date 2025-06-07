import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { GedungModule } from './gedung/gedung.module';
import { PeminjamanModule } from './peminjaman/peminjaman.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static'; // 1. Impor modul baru
import { join } from 'path';

@Module({
  imports: [
    // --- PERUBAHAN DI SINI ---
    // Konfigurasi ini akan menyajikan file dari direktori root proyek Anda.
    ServeStaticModule.forRoot({
      // Mengubah rootPath agar menunjuk ke direktori utama proyek backend,
      // yaitu 'C:\framework2\RoomTech-Backend'.
      rootPath: join(__dirname, '..'), 
    }),

    GedungModule, 
    PeminjamanModule, 
    PrismaModule, 
    AuthModule, 
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}