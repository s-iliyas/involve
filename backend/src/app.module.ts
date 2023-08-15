import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { ApiController } from './api/api.controller';
import { ApiModule } from './api/api.module';
import { APP_INTERCEPTOR, RouterModule } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';

@Module({
  providers: [
    { provide: APP_INTERCEPTOR, useClass: ClassSerializerInterceptor },
  ],
  imports: [
    ConfigModule.forRoot(),
    PrismaModule,
    UserModule,
    ApiModule,
    RouterModule.register([
      {
        path: 'api',
        module: ApiModule,
        children: [{ path: 'user', module: UserModule }],
      },
    ]),
  ],
  controllers: [ApiController],
})
export class AppModule {}
