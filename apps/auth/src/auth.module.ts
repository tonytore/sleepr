import { forwardRef, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';

import { AuthController } from './core/auth.controller';
import { AuthService } from './core/auth.service';
import { MfaService } from './mfa/mfa.service';
import { ArgonProvider } from './providers/argon.provider/argon.provider';
import { FailedLoginProvider } from './providers/failed.login.provider/failed.login.provider';
import { GenerateTokensProvider } from './providers/generate-tokens.provider';
import { HashProvider } from './providers/hash.provider/hash.provider';
import { RefreshTokensProvider } from './providers/refresh-tokens.provider';
import { SessionService } from './sessions/session.service';
import { SessionsController } from './sessions/sessions.controller';
import { VerificationController } from './verification/verification.controller';
import { VerificationService } from './verification/verification.service';
import { EmailVerifiedGuard } from '@app/common/auth/guards/email-verified.guard';
import { PermissionsGuard } from '@app/common/auth/guards/permissions.guard';
import { SharedAuthModule } from '@app/common/auth/shared-auth.module';
import { UsersModule } from './users/users.module';
import { MailModule } from '@app/common/mail/mail.module';
import { DatabaseModule } from '@app/common/database/database.module';
import { ConfigModule } from '@nestjs/config';
import databaseConfig from 'apps/reservations/src/config/database.config';
import appConfig from 'apps/reservations/src/config/app.config';
import { AuthDatabaseValidation } from './schema/database.validation';
import { AuthMicroserviceController } from './core/auth.microservice.controller';

/**
 * Auth module - Authentication, session management, email verification, and MFA.
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'apps/auth/.env',
      load: [databaseConfig, appConfig],
      validationSchema: AuthDatabaseValidation,
    }),
    forwardRef(() => UsersModule),
    SharedAuthModule,
    MailModule,
    DatabaseModule,
  ],
  providers: [
    { provide: HashProvider, useClass: ArgonProvider },
    AuthService,
    FailedLoginProvider,
    GenerateTokensProvider,
    RefreshTokensProvider,
    SessionService,
    VerificationService,
    MfaService,
    EmailVerifiedGuard,
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
  ],
  controllers: [
    AuthController,
    VerificationController,
    SessionsController,
    AuthMicroserviceController,
  ],
  exports: [
    AuthService,
    HashProvider,
    EmailVerifiedGuard,
    SessionService,
    VerificationService,
    MfaService,
    SharedAuthModule,
  ],
})
export class AuthModule {}
