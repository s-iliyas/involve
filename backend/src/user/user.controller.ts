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
    const old = await this.userService.getUserByEmail(body.email);
    if (old) {
      console.log('[CREATE_USER]', 'User already exists with this email.');
      throw new HttpException(
        { status: HttpStatus.BAD_REQUEST, error: 'User already exists' },
        HttpStatus.BAD_REQUEST,
      );
    } else {
      const oldUser = await this.userService.getUserByPhoneNumber(
        body.phoneNumber,
      );
      if (oldUser) {
        console.log(
          '[CREATE_USER]',
          'User already exists with this phone number.',
        );
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: 'User already exists with this phone number.',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
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
            const { otp, hashTimestamp } = generateOTP(user.id);
            const userResponseData = new UserResponseDto(user);
            return sendOTP(email, otp)
              .then(() => {
                console.log('[SEND_OTP_CALL]', 'OTP sent to your email');
                return {
                  message: 'OTP sent to your email',
                  hash: hashTimestamp,
                  user: userResponseData,
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
  async verifyOTP(@Body() body: VerifyOTPDto, @Res() response: Response) {
    const isVerified = verify(body);
    if (isVerified) {
      return this.userService
        .verifiedUser({ id: body.userId, isVerified })
        .then((user) => {
          if (user.isVerified) {
            const data = new UserResponseDto(user);
            response.cookie(
              'involve',
              JSON.stringify({
                user: data,
                token: jwt.sign({ userId: user.id }, process.env.SECRET_KEY, {
                  expiresIn: '1h',
                }),
                refreshToken: jwt.sign(
                  { userId: user.id },
                  process.env.SECRET_KEY,
                  {
                    expiresIn: '1d',
                  },
                ),
              }),
              {
                expires: new Date(Date.now() + 86400000),
                httpOnly: true,
              },
            );
            return {
              message: 'OTP Verified, Please Login again.',
              user: data,
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
          error: 'Invalid OTP or OTP expired.',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('send/otp')
  async sendUserOTP(@Body() body: SendOTPDto) {
    const { id } = body;
    const { otp, hashTimestamp } = generateOTP(id);
    const user = await this.userService.getUserById(body.id);
    if (user) {
      if (!user.isVerified) {
        return sendOTP(user.email, otp)
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
        const userResponseData = new UserResponseDto(user);
        return userResponseData;
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
  async login(@Res() res: Response, @Body() body: LoginDto) {
    const { email, password } = body;
    let user: User;
    try {
      user = await this.userService.getUserByEmail(email);
    } catch (error) {
      console.log('[USER_LOGIN]', error);
      throw new HttpException(
        { status: HttpStatus.BAD_REQUEST, error: error.message },
        HttpStatus.BAD_REQUEST,
        { cause: error },
      );
    }
    if (user) {
      if (user.isVerified) {
        const compare = crypt.compareSync(password, user.password);
        if (compare) {
          const token = jwt.sign({ userId: user.id }, process.env.SECRET_KEY, {
            expiresIn: '1d',
          });
          const userResponseData = new UserResponseDto(user);
          console.log(userResponseData);

          res.cookie(
            'involve',
            JSON.stringify({
              user: userResponseData,
              token: jwt.sign({ userId: user.id }, process.env.SECRET_KEY, {
                expiresIn: '1h',
              }),
              refreshToken: jwt.sign(
                { userId: user.id },
                process.env.SECRET_KEY,
                {
                  expiresIn: '1d',
                },
              ),
            }),
            {
              expires: new Date(Date.now() + 86400000),
              httpOnly: true,
            },
          );
          res.status(HttpStatus.OK).json(token);
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
        const { otp, hashTimestamp } = generateOTP(user.id);
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
