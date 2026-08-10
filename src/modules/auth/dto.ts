import { IsEmail, IsIn, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsString() @IsNotEmpty()
  phone: string;

  @IsEmail()
  email: string;

  @IsString() @MinLength(6)
  password: string;

  @IsOptional() @IsString()
  display_name?: string;
}

export class LoginDto {
  @IsString() @IsNotEmpty()
  phone: string;

  @IsString() @IsNotEmpty()
  password: string;
}

export class PhoneCheckDto {
  @IsString() @IsNotEmpty()
  phone: string;
}