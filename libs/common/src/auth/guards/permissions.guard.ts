import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { PERMISSION_KEY, REQUEST_USER_KEY } from '../auth.constants';
import { type JwtPayload } from '../interfaces/jwt-payload.interface';
import { type RequiredPermission } from '../interfaces/permission.types';

import type { Request } from 'express';

/**
 * Permissions guard. It checks if the user has the required permissions to access the resource. To use this guard, the user must be authenticated. We can use this guard for routes that require the user to have specific permissions. For example, If we want to restrict a route to only users with the permission "user:create", we can use this guard like this: @UseGuards(PermissionsGuard) @Permissions({ resource: 'user', action: 'create' })
 */
@Injectable()
export class PermissionsGuard implements CanActivate {
  /**
   * Constructor for PermissionsGuard. It injects the Reflector.
   */
  constructor(private readonly reflector: Reflector) {}

  /**
   * Can activate - Check if the user has the required permissions. If not, it throws a ForbiddenException.
   * @param context - Execution context
   * @returns True if the user has the required permissions, false otherwise
   */
  canActivate(context: ExecutionContext): boolean {
    const requiredPermission = this.reflector.getAllAndOverride<
      RequiredPermission | undefined
    >(PERMISSION_KEY, [context.getHandler(), context.getClass()]);

    if (!requiredPermission) {
      return true;
    }

    const request: Request = context.switchToHttp().getRequest();
    const user = request[REQUEST_USER_KEY] as JwtPayload | undefined;

    if (!user?.perms) {
      throw new ForbiddenException('User permissions not found');
    }

    const resourcePerms = user.perms[requiredPermission.resource];
    const hasPermission = resourcePerms?.includes(requiredPermission.action);

    if (!hasPermission) {
      throw new ForbiddenException('You do not have the required permission');
    }

    return true;
  }
}
