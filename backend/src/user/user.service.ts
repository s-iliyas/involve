import { Injectable } from '@nestjs/common';
import * as sgEmail from '@sendgrid/mail';
import { RegisterUserDto, UserResponseDto } from './dto/user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';

sgEmail.setApiKey(process.env.SENDGRID_API_KEY);

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}
  async sendOTP(email: string, otp: number) {
    const msg = {
      to: email,
      from: 'shaik.m.iliyas@gmail.com',
      subject: 'OTP Verification',
      html: `<div>
                <p>Welcome aboard!!</p>
                <br />
                <p>Your OTP is <strong>${otp}</strong></p>
              </div>`,
    };
    return new Promise((resolve, reject) => {
      sgEmail.send(msg).then(
        () => {
          resolve(true);
        },
        (error) => {
          if (error.response) {
            reject(error.response.body);
          }
        },
      );
    });
  }

  async registerUser(body: RegisterUserDto): Promise<UserResponseDto> {
    return await this.prisma.user.create({ data: body });
  }

  async verifiedUser(body: { id: string; isVerified: boolean }): Promise<User> {
    return await this.prisma.user.update({
      where: { id: body.id },
      data: { isVerified: body.isVerified },
    });
  }

  async getUserByEmail(email: string): Promise<User> {
    return await this.prisma.user.findUnique({ where: { email } });
  }

  async getUserByPhoneNumber(phoneNumber: string): Promise<User> {
    return await this.prisma.user.findUnique({ where: { phoneNumber } });
  }

  async getUserById(id: string): Promise<User> {
    return await this.prisma.user.findUnique({ where: { id } });
  }
}
