/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';

import { RootConfig } from 'apps/reservations/src/config/config.type';
import { AUTH_TYPE_KEY, REQUEST_USER_KEY } from '../auth.constants';
import { AuthType } from '../enums/auth-type.enum';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

// Helper type to make userContainer safer
type UserAttachable = { [REQUEST_USER_KEY]?: JwtPayload } & Record<string, any>;

@Injectable()
export class AccessTokenGuard implements CanActivate {
  private readonly secret: string;

  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
    configService: ConfigService<RootConfig>,
  ) {
    this.secret = configService.getOrThrow('jwt.accessTokenSecret', {
      infer: true,
    });
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const type = context.getType<'http' | 'rpc'>();

    let token: string | undefined;
    let attachTarget: UserAttachable | undefined;

    switch (type) {
      case 'http': {
        const req = context.switchToHttp().getRequest<Request>();
        token = this.extractHttpToken(req);
        attachTarget = req;
        break;
      }

      case 'rpc': {
        const data = context.switchToRpc().getData<UserAttachable>();
        token = data?.accessToken;
        attachTarget = data;
        break;
      }

      default:
        // ws, microservices without explicit data shape, etc.
        throw new ForbiddenException(
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          `Authentication not supported for ${type} context`,
        );
    }

    if (!token) {
      throw new UnauthorizedException(
        type === 'rpc'
          ? 'Missing accessToken in RPC payload'
          : 'Missing access token (expected in cookie "accessToken" or Authorization: Bearer)',
      );
    }

    const authTypes =
      this.reflector.getAllAndOverride<AuthType[]>(AUTH_TYPE_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) ?? [];

    const ignoreExpiration = authTypes.includes(AuthType.AllowExpiredToken);

    let payload: JwtPayload;

    try {
      payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: this.secret,
        ignoreExpiration,
      });
    } catch (err: any) {
      const isExpiredButAllowed =
        ignoreExpiration && err.name === 'TokenExpiredError';

      throw new UnauthorizedException(
        isExpiredButAllowed
          ? 'Expired token (allowed by route)'
          : 'Invalid token',
        { cause: err, description: err.message },
      );
    }

    if (!payload.sub) {
      throw new UnauthorizedException(
        'Token missing subject (user identifier)',
      );
    }

    attachTarget[REQUEST_USER_KEY] = payload;
    // attachTarget.user = payload;   ← many teams prefer this

    return true;
  }

  private extractHttpToken(req: Request): string | undefined {
    // Cookie first → common for browser + API apps
    const cookieToken = req.cookies?.accessToken;
    if (typeof cookieToken === 'string' && cookieToken) {
      return cookieToken;
    }

    // Bearer fallback
    const auth = req.headers.authorization;
    if (!auth) return undefined;

    const [, token] = auth.match(/^Bearer\s+(.+)$/i) ?? [];
    return token;
  }
}
