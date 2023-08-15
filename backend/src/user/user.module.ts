import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserController } from './user.controller';

@Module({
  providers: [UserService],
  imports: [PrismaModule],
  controllers: [UserController],
  exports: [UserModule],
})
export class UserModule {}
