import { Exclude } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsStrongPassword,
} from 'class-validator';

export class RegisterUserDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsOptional()
  @IsPhoneNumber()
  phoneNumber: string;

  @IsNotEmpty()
  @IsStrongPassword()
  password: string;
}

export class VerifyOTPDto {
  @IsNumber()
  otp: number;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  hashTimestamp: string;
}

export class SendOTPDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class UserResponseDto {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;

  @Exclude()
  password: string;

  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial);
  }
}

export class LoginDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsStrongPassword()
  password: string;
}
