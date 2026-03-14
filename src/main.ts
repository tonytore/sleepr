import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { createDocument } from '@app/common/api-doc/swagger';
import { ConfigService } from '@nestjs/config';
import { AppConfig, type RootConfig } from '@app/common/config/config.type';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService: ConfigService<RootConfig> = app.get(ConfigService);
  const appConfig = configService.get<AppConfig>('app');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.useLogger(app.get(Logger));
  createDocument(
    app,
    appConfig?.swaggerUser || 'admin',
    appConfig?.swaggerPassword || 'admin',
  );
  await app.listen(process.env.PORT ?? 3000);
}
// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
