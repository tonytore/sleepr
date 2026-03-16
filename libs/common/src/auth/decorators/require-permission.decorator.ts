import { SetMetadata } from '@nestjs/common';

import { PERMISSION_KEY } from '../auth.constants';
import { type ResourceActionMap } from '../interfaces/permission.types';
import { Resource } from '../enums/resource.enum';

/**
 * Require permission decorator. It sets the permission metadata for the route. The permission is checked by the access control guard. You must use this decorator on the route handler after the Auth decorator. And you have to provide the permission metadata in the format of { resource: Resource, action: Action }.
 * @param permission - The permission to require
 * @returns
 */
export const RequirePermission = <T extends Resource>(
  resource: T,
  action: ResourceActionMap[T],
) => SetMetadata(PERMISSION_KEY, { resource, action });
