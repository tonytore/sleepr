import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { type Resource } from '../enums/resource.enum';
import { PERMISSION_KEY } from '../auth.constants';
import { PermissionsGuard } from '../guards/permissions.guard';
import { type ResourceActionMap } from '../interfaces/permission.types';

/**
 * Permissions decorator. It combines setting the permission metadata and applying the PermissionsGuard.
 * You have to provide the permission metadata in the format of resource and action.
 * @param resource - The resource to check
 * @param action - The action to check
 * @returns Decorator function
 */
export const Permissions = <T extends Resource>(
  resource: T,
  action: ResourceActionMap[T],
) => {
  return applyDecorators(
    SetMetadata(PERMISSION_KEY, { resource, action }),
    UseGuards(PermissionsGuard),
  );
};
