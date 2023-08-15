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
import { RegisterUserDto } from './user.dto';
import { Response } from 'express';
import { generateOTP } from 'actions/generateOTP';

@Controller()
export class UserController {
  @Get()
  api(@Res() res: Response) {
    return res.status(200).json({ message: 'User API Working...' });
  }

  @Post('register')
  register(@Body() body: RegisterUserDto) {
    try {
      const otp = generateOTP({ otpLength: 1, email: body.email });
      return { otp: `Your otp is ${otp}` };
    } catch (error) {
      throw new HttpException(
        { status: HttpStatus.BAD_REQUEST, error: error.message },
        HttpStatus.BAD_REQUEST,
        { cause: error },
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
