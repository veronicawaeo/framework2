//  Mengatur logika otentikasi

import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserdto } from './dto/create.user.dto';
import * as bcyrpt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
    ) { }

    async register(createUserDto: CreateUserdto) {
        const { nama, email, nim, nip, password } = createUserDto;

        // Check if user already exist 
        const existingUser = await this.prisma.user.findUnique({
            where: { email },
        });

        if (existingUser){
            throw new ConflictException('Email sudah terdaftar')
        }

        const hashedPassword = await bcyrpt.hash(password, 10);

        const user = await this.prisma.user.create({
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
        
        return{
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

    async login(email: string, password: string) {
        const user = await this.prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            throw new ConflictException('Email tidak terdaftar')
        }

        const isPasswordValid = await bcyrpt.compare(password, user.password);

        if (!isPasswordValid) {
            throw new ConflictException('Password salah')
        }

        return {
            status: 200,
            message: "Berhasil Masuk",
            data: {
                user_id: user.user_id,
                email: user.email,
                nama: user.nama,
                nim: user.nim,
                nip: user.nip
            }
        }
    }
}