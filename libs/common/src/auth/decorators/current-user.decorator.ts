import { createParamDecorator, type ExecutionContext } from '@nestjs/common';

import { REQUEST_USER_KEY } from '../auth.constants';

import type { JwtPayload } from '../interfaces/jwt-payload.interface';
import type { Request } from 'express';

/**
 * Get the current user from the request. It extracts the user from the request and returns it.
 * @param field - The field to get from the user
 * @param ctx - The execution context
 * @returns
 */
export const CurrentUser = createParamDecorator(
  (field: keyof JwtPayload | undefined, ctx: ExecutionContext) => {
    const request: Request = ctx.switchToHttp().getRequest();
    const user = request[REQUEST_USER_KEY] as JwtPayload;

    return field ? user[field] : user;
  },
);
