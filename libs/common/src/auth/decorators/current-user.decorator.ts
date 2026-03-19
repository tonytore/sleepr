import { createParamDecorator, type ExecutionContext } from '@nestjs/common';

import type { JwtPayload } from '../interfaces/jwt-payload.interface';
import type { Request } from 'express';
import { getUserFromContext } from '../guards/utils/auth-util';

/**
 * Get the current user from the request. It extracts the user from the request and returns it.
 * @param field - The field to get from the user
 * @param ctx - The execution context
 * @returns
 */
export const CurrentUser = createParamDecorator(
  (field: keyof JwtPayload | undefined, ctx: ExecutionContext) => {
    const user = getUserFromContext(ctx);
    if (!user) {
      return undefined;
    }

    return field ? user[field] : user;
  },
);
