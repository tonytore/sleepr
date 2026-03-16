/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { RootConfig } from 'apps/reservations/src/config/config.type';

import { AUTH_TYPE_KEY, REQUEST_USER_KEY } from '../auth.constants';
import { AuthType } from '../enums/auth-type.enum';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

import type { Request } from 'express';

/**
 * Access token guard - Guard for access token. It validates the access token and extracts the user from the token.
 */
@Injectable()
export class AccessTokenGuard implements CanActivate {
  /**
   * Constructor for AccessTokenGuard. It injects the JWT service and Reflector.
   */
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
    private readonly configService: ConfigService<RootConfig>,
  ) {}

  /**
   * Can activate - Check if access token is valid
   * @param context - Execution context
   * @returns True if access token is valid, false otherwise
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const token = this.extractRequestFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('No token provided', {
        description: 'No token provided',
        cause: new Error('No token provided'),
      });
    }

    const authTypes = this.reflector.getAllAndOverride<AuthType[]>(
      AUTH_TYPE_KEY,
      [context.getHandler(), context.getClass()],
    );
    const allowExpired =
      authTypes?.includes(AuthType.AllowExpiredToken) ?? false;

    try {
      const payload: JwtPayload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get('jwt', { infer: true })!
          .accessTokenSecret,
        ignoreExpiration: allowExpired,
      });

      if (!payload) {
        throw new UnauthorizedException('Token is invalid', {
          description: 'Token is invalid',
          cause: new Error('Token is invalid'),
        });
      }
      request[REQUEST_USER_KEY] = payload;
    } catch (error) {
      throw new UnauthorizedException('Error while verifying token', {
        description: 'Error while verifying token',
        cause: error,
      });
    }

    return true;
  }

  /**
   * Extract token from header or cookies. It falls back to authorization header if the token is not found in cookies.
   * @param request - Request
   * @returns Token
   */
  private extractRequestFromHeader(request: Request): string | undefined {
    // Attempt to extract token from cookies first
    const cookieToken = request.cookies?.['accessToken'] as string | undefined;
    if (cookieToken) {
      return cookieToken;
    }

    // Fallback to Bearer token in headers
    const [type, token] = request.headers.authorization?.split(' ') || [];
    return type === 'Bearer' ? token : undefined;
  }
}
