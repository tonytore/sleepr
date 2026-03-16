import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { AccessTokenGuard } from './guards/access-token.guard';
import { AuthenticationGuard } from './guards/authentication.guard';
import { PermissionsGuard } from './guards/permissions.guard';

@Module({
  imports: [JwtModule.register({}), ConfigModule],
  providers: [AccessTokenGuard, AuthenticationGuard, PermissionsGuard],
  exports: [AccessTokenGuard, AuthenticationGuard, PermissionsGuard, JwtModule],
})
export class SharedAuthModule {}
