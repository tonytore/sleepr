import { Module } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { ReservationRepository } from './repository/reservation.repository';
import { DatabaseModule } from '@app/common/database/database.module';
import { LoggerModule } from '@app/common/logger/logger.module';
import { ConfigModule } from '@nestjs/config';
import databaseConfig from 'apps/reservations/src/config/database.config';
import appConfig from 'apps/reservations/src/config/app.config';
import { DatabaseValidation } from './config/validation/database.validation';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthClientService } from './authClientService/auth-client-service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'apps/reservations/.env',
      load: [databaseConfig, appConfig],
      validationSchema: DatabaseValidation,
    }),
    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: 4002,
        },
      },
    ]),
    DatabaseModule,
    LoggerModule,
  ],
  controllers: [ReservationsController],
  providers: [ReservationsService, ReservationRepository, AuthClientService],
})
export class ReservationsModule {}
