import { Module } from '@nestjs/common';
import { ApiController } from './api.controller';

@Module({
  exports: [ApiModule],
  controllers: [ApiController],
})
export class ApiModule {}
