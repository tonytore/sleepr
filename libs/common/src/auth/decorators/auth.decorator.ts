import { SetMetadata } from '@nestjs/common';

import { AUTH_TYPE_KEY } from '../auth.constants';
import { AuthType } from '../enums/auth-type.enum';

/**
 * Auth Decorator to specify the authentication type for the route. Auth types are:
 * - Bearer
 * - None
 * @param authTypes
 * @returns
 */
export const Auth = (...authTypes: AuthType[]) =>
  SetMetadata(AUTH_TYPE_KEY, authTypes);

/**
 * Public Decorator to specify that the route is public (does not require authentication).
 * This is an alias for @Auth(AuthType.None)
 * @returns
 */
export const Public = () => Auth(AuthType.None);
