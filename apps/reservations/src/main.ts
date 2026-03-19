/* eslint-disable @typescript-eslint/no-unsafe-call */
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { createDocument } from '@app/common/api-doc/swagger';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { PrismaClientExceptionFilter } from 'nestjs-prisma';
import { ConfigService } from '@nestjs/config';
import {
  AppConfig,
  RootConfig,
} from 'apps/reservations/src/config/config.type';
import { Logger as PinoLogger } from 'nestjs-pino';
import { execSync } from 'child_process';
import { ReservationsModule } from './core/reservations.module';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    ReservationsModule,
    {
      bufferLogs: true,
    },
  );

  // Use Pino logger adapter from nestjs-pino
  const logger = app.get(PinoLogger);
  app.useLogger(app.get(PinoLogger));

  logger.log('🟢 Using Pino logger');

  // Get config
  const configService: ConfigService<RootConfig> = app.get(ConfigService);
  const appConfig = configService.get<AppConfig>('reservations_app');
  const http_port = appConfig?.http_port || 4001;

  // app.useLogger(
  //   new ConsoleLogger({
  //     prefix: appConfig?.name || 'PSCMS',
  //     context: 'User Service',
  //   }),
  // );

  app.useBodyParser('json', { limit: '10mb' });
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: [
            "'self'",
            "'unsafe-inline'",
            "'unsafe-eval'",
            'https://cdn.jsdelivr.net',
          ],
          styleSrc: [
            "'self'",
            "'unsafe-inline'",
            'https://fonts.googleapis.com',
            'https://cdn.jsdelivr.net',
          ],
          fontSrc: [
            "'self'",
            'https://fonts.gstatic.com',
            'https://fonts.googleapis.com',
            'https://cdn.jsdelivr.net',
            'https://fonts.scalar.com',
          ],
          imgSrc: [
            "'self'",
            'data:',
            'https://cdn.jsdelivr.net',
            'https://validator.swagger.io',
            'https://res.cloudinary.com',
          ],
          connectSrc: [
            "'self'",
            'https://proxy.scalar.com',
            'https://api.scalar.com',
            'https://cdn.jsdelivr.net',
          ],
        },
      },
    }),
  );
  app.use(cookieParser());
  app.enableCors({
    origin: [appConfig?.frontendUrl || 'http://localhost:3000'],
    credentials: true,
  });
  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.setGlobalPrefix('api/v1');
  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  // Prisma Client Exception Filter for unhandled exceptions
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));

  // Swagger
  createDocument(
    app,
    appConfig?.swaggerUser || 'admin',
    appConfig?.swaggerPassword || 'admin',
  );

  // Retry logic
  const startApp = async (retries = 5, delay = 1000) => {
    for (let i = 0; i < retries; i++) {
      try {
        await app.listen(http_port, '0.0.0.0');
        logger.log(
          `🚀 Application is running on http://localhost:${http_port}`,
        );
        return;
      } catch (err: any) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (err.code === 'EADDRINUSE' && i < retries - 1) {
          logger.warn(
            `Port ${http_port} is in use, retrying in ${delay}ms... (Attempt ${i + 1}/${retries})`,
          );
          try {
            execSync(`lsof -t -i:${http_port} | xargs kill -9 || true`);
          } catch {
            /* empty */
          }
          await new Promise((resolve) => setTimeout(resolve, delay));
        } else {
          throw err;
        }
      }
    }
  };

  await startApp();
}

void bootstrap();
