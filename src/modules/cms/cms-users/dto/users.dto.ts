import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class RegisterSchoolDto {
  @IsString()
  @IsNotEmpty()
  org_name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  school_password: string;

  @IsString()
  @IsOptional()
  personal_code?: string;
}

export class LoginDto {
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsString()
  @IsOptional()
  school_password?: string;
}

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  display_name: string;

  @IsString()
  @IsOptional()
  school_role?: string;

  @IsString()
  @IsNotEmpty()
  school_id: string;

  @IsString()
  @IsOptional()
  @MinLength(6)
  password?: string;
}
