import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [process.env.FRONTEND_URL_1],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  await app.listen(8000);
}
bootstrap();
