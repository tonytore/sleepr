import { Module } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { ReservationRepository } from './repository/reservation.repository';
import { DatabaseModule } from '@app/common/database/database.module';
import { LoggerModule } from '@app/common/logger/logger.module';
import { ConfigModule } from '@nestjs/config';
import databaseConfig from 'apps/reservations/src/config/database.config';
import appConfig from 'apps/reservations/src/config/app.config';
// import { DatabaseValidation } from './config/validation/database.validation';
import { APP_GUARD } from '@nestjs/core';
import { AuthenticationGuard } from '@app/common/auth/guards/authentication.guard';
import { AccessTokenGuard } from '@app/common/auth/guards/access-token.guard';
import { SharedAuthModule } from '@app/common/auth/shared-auth.module';
import jwtConfig from './config/jwt.config';
import mailConfig from './config/mail.config';
import storageConfig from './config/storage.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'apps/reservations/.env',
      load: [databaseConfig, appConfig, jwtConfig, mailConfig, storageConfig],
      // validationSchema: DatabaseValidation,
    }),

    DatabaseModule,
    LoggerModule,
    SharedAuthModule,
  ],
  controllers: [ReservationsController],
  providers: [
    ReservationsService,
    ReservationRepository,

    AccessTokenGuard,
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
  ],
})
export class ReservationsModule {}
