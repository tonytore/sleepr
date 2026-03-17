/* eslint-disable @typescript-eslint/no-unsafe-call */
import { execSync } from 'node:child_process';

import {
  ConsoleLogger,
  Logger,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { PrismaClientExceptionFilter } from 'nestjs-prisma';

import type { NestExpressApplication } from '@nestjs/platform-express';
import { AuthModule } from './auth.module';

import { createDocument } from '@app/common/api-doc/swagger';
import { AppConfig, RootConfig } from './config/config.type';

/**
 * This function bootstraps the application. It is the entry point of the application. It is called in the main.ts file.
 * @returns void
 * @async
 */
async function bootstrap() {
  const logger = new Logger(bootstrap.name);

  const app = await NestFactory.create<NestExpressApplication>(AuthModule, {
    bufferLogs: true,
  });
  const configService: ConfigService<RootConfig> = app.get(ConfigService);
  const appConfig = configService.get<AppConfig>('app');
  const http_port = appConfig?.http_port || 3008;
  const tcp_port = appConfig?.tcp_port || 4001;
  app.connectMicroservice({
    transport: 'TCP',
    options: {
      host: '0.0.0.0',
      port: tcp_port, // 👈 IMPORTANT
    },
  });

  app.useLogger(
    new ConsoleLogger({
      prefix: appConfig?.name || 'PSCMS',
      context: 'User Service',
    }),
  );

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

  // This is global request bodies validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      disableErrorMessages: false,
    }),
  );
  // Prisma Client Exception Filter for unhandled exceptions
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));

  createDocument(
    app,
    appConfig?.swaggerUser || 'admin',
    appConfig?.swaggerPassword || 'admin',
  );

  app.set('trust proxy', true);
  app.enableShutdownHooks();

  await app.startAllMicroservices();

  // Custom listen with retry logic for development reliability
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
            `port ${http_port} is in use, retrying in ${delay}ms... (Attempt ${i + 1}/${retries})`,
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

void bootstrap(); // NOSONAR - Entry point for the NestJS application
