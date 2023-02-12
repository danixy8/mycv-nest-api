import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import * as session from 'express-session';
import { setupApp } from './setup-app';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  setupApp(app);
  //crear una configuracion externa para este middleware como "setupApp"
  // app.use(
  //   session({
  //     secret: 'lalalalau',
  //     resave: false,
  //     saveUninitialized: false,
  //   }),
  // );
  //pasar globalPipes a un nivel mas abajo, moverlo a app.module
  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     whitelist: true,
  //   }),
  // );
  await app.listen(3000);
}
bootstrap();
