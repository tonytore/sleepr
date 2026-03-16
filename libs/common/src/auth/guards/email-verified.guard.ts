import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { type Request } from 'express';

import { REQUEST_USER_KEY } from '../auth.constants';

import type { JwtPayload } from '../interfaces/jwt-payload.interface';

/**
 * Email verified guard. It checks if the user's email is verified. If not, it throws a ForbiddenException. To use this guard, the user must be authenticated. We can use this guard for routes that require the user's email to be verified. For example, the user can't change their password if their email is not verified. So we need to use this guard before the password change route like this: @UseGuards(EmailVerifiedGuard)
 */
@Injectable()
export class EmailVerifiedGuard implements CanActivate {
  /**
   * Constructor for EmailVerifiedGuard.
   */
  constructor() {}

  /**
   * Can activate - Check if the user's email is verified
   * @param context - Execution context
   * @returns True if the user's email is verified, false otherwise
   */
  canActivate(context: ExecutionContext): boolean {
    const request: Request = context.switchToHttp().getRequest();
    const user = request[REQUEST_USER_KEY] as JwtPayload | undefined;

    if (!user?.sub) {
      return false;
    }

    if (user.emailVerified) {
      return true;
    } else {
      throw new ForbiddenException(
        'Email verification required to access this resource',
      );
    }
  }
}
