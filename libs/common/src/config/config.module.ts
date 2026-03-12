import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import * as joi from 'joi';

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      validationSchema: joi.object({
        DATABASE_URL: joi.string().required(),
      }),
    }),
  ],
})
export class ConfigModule {}
