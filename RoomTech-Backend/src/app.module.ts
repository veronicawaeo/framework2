import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { GedungModule } from './gedung/gedung.module';
import { PeminjamanModule } from './peminjaman/peminjaman.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    
    ServeStaticModule.forRoot({
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