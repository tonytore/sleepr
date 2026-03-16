import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { createDocument } from '@app/common/api-doc/swagger';
import { ConfigService } from '@nestjs/config';
import {
  AppConfig,
  RootConfig,
} from 'apps/reservations/src/config/config.type';
import { Logger as PinoLogger } from 'nestjs-pino';
import { execSync } from 'child_process';
import { ReservationsModule } from './reservations.module';
// import * as dotenv from 'dotenv';
// import { join } from 'path';

async function bootstrap() {
  // dotenv.config({
  //   path: join(process.cwd(), 'apps/reservations/.env'),
  //   override: true,
  // });
  const app = await NestFactory.create(ReservationsModule, {
    bufferLogs: true,
  });

  // Use Pino logger adapter from nestjs-pino
  const logger = app.get(PinoLogger);
  app.useLogger(app.get(PinoLogger));

  logger.log('🟢 Using Pino logger');

  // Get config
  const configService: ConfigService<RootConfig> = app.get(ConfigService);
  const appConfig = configService.get<AppConfig>('app');
  const port = appConfig?.port || 4001;

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

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
        await app.listen(port, '0.0.0.0');
        logger.log(`🚀 Application is running on http://localhost:${port}`);
        return;
      } catch (err: any) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (err.code === 'EADDRINUSE' && i < retries - 1) {
          logger.warn(
            `Port ${port} is in use, retrying in ${delay}ms... (Attempt ${i + 1}/${retries})`,
          );
          try {
            execSync(`lsof -t -i:${port} | xargs kill -9 || true`);
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
