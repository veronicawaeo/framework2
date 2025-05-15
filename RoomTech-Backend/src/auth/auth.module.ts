// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: 'your-secret-key', // Ganti dengan secret key yang aman
      signOptions: { expiresIn: '1d' }, // Token berlaku selama 1 hari
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, PrismaService],
  exports: [AuthService],
})
export class AuthModule {}