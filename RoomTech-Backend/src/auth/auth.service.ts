//  Mengatur logika otentikasi

import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserdto } from './dto/create.user.dto';
import * as bcyrpt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) { }

    // fungsi register
    async register(createUserDto: CreateUserdto) {
        const { nama, email, nim, nip, password } = createUserDto; // ambil data pengguna

        // Check if user already exist 
        const existingUser = await this.prisma.user.findUnique({
            where: { email },
        });

        if (existingUser){
            throw new ConflictException('Email sudah terdaftar')
        }

        const hashedPassword = await bcyrpt.hash(password, 10);

        const user = await this.prisma.user.create({ // simpan data ke database via prisma
            data: {
                nama,
                email,
                password: hashedPassword,
            },
            select: {
                user_id: true,
                email: true,
                password: true,
            },
        });
        
        return{ // respon ke user
            status: 201,
            message: "Berhasil Membuat Akun",
            data:{
                user_id: user.user_id,
                email: user.email,
                nama,
                nim,
                nip
            }
        }
    }

    // fungsi login
    async login(email: string, password: string) {
        const user = await this.prisma.user.findUnique({
            where: { email }, // cari user bdsr email
        });

        if (!user) {
            throw new ConflictException('Email tidak terdaftar')
        }

        const isPasswordValid = await bcyrpt.compare(password, user.password); // cek password benar/salah

        if (!isPasswordValid) {
            throw new ConflictException('Password salah')
        }

        // Generate JWT token
        const payload = { sub: user.user_id, email: user.email };
        const token = this.jwtService.sign(payload);

        return {
            status: 200,
            message: "Berhasil Masuk",
            data: {
                user_id: user.user_id,
                email: user.email,
                nama: user.nama,
                nim: user.nim,
                nip: user.nip,
                token
            }
        }
    }
}