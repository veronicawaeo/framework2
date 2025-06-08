import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private prisma: PrismaService) {
    const secret = process.env.JWT_SECRET;
    // LOG 1: Memeriksa apakah kunci rahasia berhasil dimuat saat kelas dibuat.
    console.log(`[JwtStrategy] Constructor: JWT_SECRET ${secret ? 'berhasil dimuat.' : 'TIDAK DITEMUKAN!'}`);
    
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret, // Menggunakan variabel 'secret'
    });
  }

  // Fungsi ini berjalan secara otomatis jika tanda tangan token valid.
  async validate(payload: any) {
    // LOG 2: Menampilkan isi dari token yang berhasil diverifikasi.
    console.log('[JwtStrategy] Validate function triggered. Payload:', payload);

    if (!payload || !payload.sub) {
      console.error('[JwtStrategy] Gagal: Payload tidak valid atau tidak memiliki properti "sub".');
      throw new UnauthorizedException('Token tidak valid.');
    }

    const user = await this.prisma.user.findUnique({
      where: {
        user_id: payload.sub,
      },
    });

    // LOG 3: Memeriksa apakah pengguna ditemukan di database.
    if (!user) {
      console.error(`[JwtStrategy] Gagal: Pengguna dengan ID ${payload.sub} tidak ditemukan di database.`);
      throw new UnauthorizedException('Pengguna tidak ditemukan atau sesi tidak valid.');
    }
    
    console.log(`[JwtStrategy] Sukses: Pengguna ${user.email} (ID: ${user.user_id}) ditemukan.`);

    const { password, ...result } = user;
    return result;
  }
}