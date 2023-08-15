import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsStrongPassword,
} from 'class-validator';

export class RegisterUserDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsNumber()
  @IsOptional()
  phoneNumber: number;

  @IsNotEmpty()
  @IsStrongPassword()
  password1: string;

  @IsNotEmpty()
  @IsStrongPassword()
  password2: string;
}

export class RegisterUserResponseDto {
  @IsNumber()
  otp: number;

  constructor(partial: Partial<RegisterUserResponseDto>) {
    Object.assign(this, partial);
  }
}
