// libs/common/src/database/database.module.ts
import { Module, Global } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaModule } from 'nestjs-prisma';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { DatabaseConfig, RootConfig } from '../config/config.type';
import { ConfigModule } from '../config/config.module';

@Global()
@Module({
  imports: [
    ConfigModule,
    PrismaModule.forRootAsync({
      isGlobal: true,
      useFactory: (configService: ConfigService<RootConfig>) => ({
        prismaOptions: {
          adapter: new PrismaPg(
            new Pool({
              connectionString:
                configService.getOrThrow<DatabaseConfig>('database')?.url,
            }),
          ),
          // omit: {
          //   user: {
          //     password: true,
          //     rememberToken: true,
          //     lockOutUntil: true,
          //     twoFactorSecret: true,
          //     twoFactorRecoveryCodes: true,
          //     twoFactorConfirmedAt: true,
          //   },
          // },
        },
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
