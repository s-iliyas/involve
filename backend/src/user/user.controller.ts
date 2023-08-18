import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import * as crypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import {
  LoginDto,
  RegisterUserDto,
  SendOTPDto,
  UserResponseDto,
  VerifyOTPDto,
} from './user.dto';
import { Response } from 'express';
import { UserService } from './user.service';
import { generateOTP, sendOTP, verify } from 'src/actions/otp';
import { User } from '@prisma/client';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  api(@Res() res: Response) {
    return res.status(200).json({ message: 'User API Working...' });
  }

  @Post('register')
  async register(@Body() body: RegisterUserDto) {
    const old = await this.userService.getUser(body.email);
    if (old) {
      console.log('[CREATE_USER]', 'User already exists with this email.');
      throw new HttpException(
        { status: HttpStatus.BAD_REQUEST, error: 'User already exists' },
        HttpStatus.BAD_REQUEST,
      );
    } else {
      const salt = crypt.genSaltSync(10);
      body.password = crypt.hashSync(body.password, salt);
      return this.userService
        .registerUser(body)
        .then(async (user: UserResponseDto) => {
          const { email } = user;
          if (!email) {
            console.log('[CREATE_USER]', 'No email');
            throw new HttpException(
              { status: HttpStatus.BAD_REQUEST, error: 'Invalid request' },
              HttpStatus.BAD_REQUEST,
            );
          } else {
            const { otp, hashTimestamp } = generateOTP(email);
            return sendOTP(email, otp)
              .then(() => {
                console.log('[SEND_OTP_CALL]', 'OTP sent to your email');
                return {
                  message: 'OTP sent to your email',
                  hash: hashTimestamp,
                  user: new UserResponseDto(user),
                };
              })
              .catch((error) => {
                console.log('[SEND_OTP_CALL]', error);
                throw new HttpException(
                  { status: HttpStatus.BAD_REQUEST, error: error.message },
                  HttpStatus.BAD_REQUEST,
                  { cause: error },
                );
              });
          }
        })
        .catch((error) => {
          console.log('[CREATE_USER]', error.message);
          throw new HttpException(
            { status: HttpStatus.BAD_REQUEST, error: error.message },
            HttpStatus.BAD_REQUEST,
            { cause: error },
          );
        });
    }
  }

  @Post('verify/otp')
  async verifyOTP(@Body() body: VerifyOTPDto) {
    const isVerified = verify(body);
    if (isVerified) {
      return this.userService
        .verifiedUser({ email: body.email, isVerified })
        .then((user) => {
          if (user.isVerfied) {
            return {
              message: 'OTP Verified, Please Login again.',
            };
          } else {
            console.log('[VERIFY_OTP]', 'USER NOT VERFIED IN DB');
            throw new HttpException(
              { status: HttpStatus.BAD_REQUEST, error: 'NOT VERFIED INTO DB' },
              HttpStatus.BAD_REQUEST,
            );
          }
        })
        .catch((error) => {
          console.log('[VERIFY_OTP]', error.message);
          throw new HttpException(
            { status: HttpStatus.BAD_REQUEST, error: error.message },
            HttpStatus.BAD_REQUEST,
            { cause: error },
          );
        });
    } else {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: 'Invalid OTP or OTP expired.',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('send/otp')
  async sendUserOTP(@Body() body: SendOTPDto) {
    const { email } = body;
    const { otp, hashTimestamp } = generateOTP(email);
    const user = await this.userService.getUser(body.email);
    if (user) {
      if (!user.isVerfied) {
        return sendOTP(email, otp)
          .then(() => {
            console.log('[SEND_USER_OTP_CALL]', 'OTP sent to your email');
            const data: UserResponseDto = user;
            return {
              message: 'OTP sent to your email',
              hash: hashTimestamp,
              user: data,
            };
          })
          .catch((error) => {
            console.log('[SEND_USER_OTP_CALL]', error);
            throw new HttpException(
              { status: HttpStatus.BAD_REQUEST, error: error.message },
              HttpStatus.BAD_REQUEST,
              { cause: error },
            );
          });
      } else {
        console.log('[SEND_USER_OTP_CALL]', 'User verified, please login.');
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: 'User verified, please login again.',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    } else {
      console.log(
        '[SEND_USER_OTP_CALL]',
        'User does not exist, please register.',
      );
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'User does not exist, please register.',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('get/:id')
  async getUser(@Param() param: { id: string }): Promise<UserResponseDto> {
    if (param.id) {
      let user: User;
      try {
        user = await this.userService.getUserById(param.id);
      } catch (error) {
        console.log('[GET_USER_BY_ID]', error);
        throw new HttpException(
          { status: HttpStatus.BAD_REQUEST, error: error.message },
          HttpStatus.BAD_REQUEST,
          { cause: error },
        );
      }
      if (user) {
        return new UserResponseDto(user);
      } else {
        console.log('[GET_USER_BY_ID]', 'INVALID USER ID');
        throw new HttpException(
          { status: HttpStatus.BAD_REQUEST, error: 'INVALID USER ID' },
          HttpStatus.BAD_REQUEST,
        );
      }
    } else {
      console.log('[GET_USER_BY_ID]', 'NO USER ID');
      throw new HttpException(
        { status: HttpStatus.BAD_REQUEST, error: 'NO USER ID' },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('login')
  async login(@Body() body: LoginDto) {
    const { email, password } = body;
    let user: User;
    try {
      user = await this.userService.getUser(email);
    } catch (error) {
      console.log('[USER_LOGIN]', error);
      throw new HttpException(
        { status: HttpStatus.BAD_REQUEST, error: error.message },
        HttpStatus.BAD_REQUEST,
        { cause: error },
      );
    }
    if (user) {
      const compare = crypt.compareSync(password, user.password);
      if (compare) {
        const token = jwt.sign({ userId: user.id }, process.env.SECRET_KEY, {
          expiresIn: '1d',
        });
        return { user: new UserResponseDto(user), token };
      } else {
        console.log('[USER_LOGIN]', 'Incorrect password');
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: 'Incorrect password',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    } else {
      console.log('[USER_LOGIN]', 'User does not exist, please register.');
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'User does not exist, please register.',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete(':id')
  delete(@Param() param: { id: string }): { message: string } {
    console.log(param);
    if (param.id === 'register') {
      throw new HttpException(
        { status: HttpStatus.BAD_REQUEST, error: 'NOt register' },
        HttpStatus.BAD_REQUEST,
      );
    }
    return { message: 'ok' };
  }
}
