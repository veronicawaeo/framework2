//  Mengatur apa saja yg harus diisi saat login

import { IsEmail, IsString } from "class-validator";

export class LoginUserDto {
    @IsEmail()
    email: string;

    @IsString()
    password: string;
}