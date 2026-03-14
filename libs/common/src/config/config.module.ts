import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { DatabaseValidation } from './validation/database.validation';
import databaseConfig from './database.config';
import appConfig from './app.config';

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, appConfig],
      validationSchema: DatabaseValidation,
    }),
  ],
})
export class ConfigModule {}
