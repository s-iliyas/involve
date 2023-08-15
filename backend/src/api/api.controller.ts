import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller()
export class ApiController {
  @Get()
  api(@Res() res: Response) {
    return res.status(200).json({ message: 'API Working....' });
  }
}
