//  Mengatur apa saja yg harus diisi saat regis

import { IsArray, IsBoolean, IsEmail, IsString } from "class-validator";

export class CreateUserdto{
    @IsString() 
    nama: string

    @IsEmail()
    email: string

    @IsString()
    nim?: string

    @IsString()
    nip?: string

    @IsString()
    password: string
}
