import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { AUTH_TYPE_KEY } from '../auth.constants';
import { AuthType } from '../enums/auth-type.enum';

import { AccessTokenGuard } from './access-token.guard';

/**
 * Authentication guard. It checks if the user is authenticated. It uses the AuthType enum to determine the type of authentication to use. It uses the Reflector to get the auth type from the route handler or class. In the future, we can add more auth types to the map. So it makes the guard flexible and scalable.
 */
@Injectable()
export class AuthenticationGuard implements CanActivate {
  /**
   * Default authentication type
   */
  private static readonly defaultAuthType = AuthType.Bearer;

  /**
   * Map of auth types to guards
   */
  private readonly authTypeGuardMap: Record<
    AuthType,
    CanActivate | CanActivate[]
  >;

  /**
   * Constructor for AuthenticationGuard. It injects the Reflector and AccessTokenGuard. It initializes the authTypeGuardMap with the default auth type and the access token guard. In the future, we can add more auth types to the map.
   */
  constructor(
    private readonly reflector: Reflector,
    private readonly accessTokenGuard: AccessTokenGuard,
  ) {
    this.authTypeGuardMap = {
      [AuthType.Bearer]: this.accessTokenGuard,
      [AuthType.AllowExpiredToken]: this.accessTokenGuard,
      [AuthType.None]: { canActivate: () => true },
    };
  }

  /**
   * Can activate - Check if the user is authenticated
   * @param context - Execution context
   * @returns True if the user is authenticated, false otherwise
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const authTypes = this.reflector.getAllAndOverride<AuthType[]>(
      AUTH_TYPE_KEY,
      [context.getHandler(), context.getClass()],
    ) ?? [AuthenticationGuard.defaultAuthType];

    const guards = authTypes.flatMap((type) => {
      return this.authTypeGuardMap[type];
    });

    let error: unknown = new UnauthorizedException();

    for (const instance of guards) {
      const canActivate = await Promise.resolve(
        instance.canActivate(context),
      ).catch((err: unknown) => {
        error = err;
      });

      if (canActivate) {
        return true;
      }
    }

    throw error;
  }
}
