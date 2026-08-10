import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';
import { join } from 'path';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: false,
    bodyParser: true,
  });

  const config = app.get(ConfigService);

  // Increase body size limit for file uploads
  app.use((req, res, next) => {
    if (req.path === '/api/media/upload') {
      // Skip body parser for file uploads - multer handles it
      return next();
    }
    next();
  });

  // Set JSON body limit
  const express = require('express');
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // Global Filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // Cookies (for JWT stored in weconnect_token cookie)
  app.use(cookieParser());

  // CORS
  app.enableCors({
    origin: config.get<string>('CORS_ORIGIN', 'http://localhost:3000').split(','),
    credentials: true,
  });

  // Global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
    }),
  );

  // API prefix
  app.setGlobalPrefix('api');

  // Static uploads
  const uploadDir = config.get<string>('UPLOAD_DIR', 'uploads');
  app.useStaticAssets(join(process.cwd(), uploadDir), { prefix: '/uploads/' });

  const port = config.get<number>('PORT', 4000);
  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`🚀  WeConnect backend listening on http://localhost:${port}`);
}

bootstrap();