import {
  ApiUnauthorizedErrorResponse,
  ApiValidationErrorResponse,
} from '@app/common/decorators/crud-swagger.decorator';
import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

/**
 * ApiGetProfile decorator
 * @description Swagger documentation for the getProfile method.
 */
export function ApiGetProfile() {
  return applyDecorators(
    ApiOperation({ summary: "Get current user's profile" }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Returns current user details',
      example: {
        success: true,
        statusCode: 200,
        message: 'Operation successful',
        data: {
          id: '01KJBATW6KMSW8C82XRZ8X7YE8',
          firstName: 'Some',
          middleName: 'One',
          lastName: 'Name',
          email: 'someone@gmail.com',
          phoneNumber: '0911111111',
          dob: '1990-01-01T00:00:00.000Z',
          gender: 'male',
          isOnline: false,
          emailVerifiedAt: null,
          lockOutUntil: null,
          failedLoginAttempts: 0,
          isActive: true,
          twoFactorConfirmedAt: null,
          createdAt: '2026-02-25T21:21:14.963Z',
          updatedAt: '2026-02-25T23:03:49.610Z',
          deletedAt: null,
          roles: ['super_admin'],
          permissions: [
            'user:read',
            'user:create',
            'user:update',
            'user:delete',
          ],
        },
      },
    }),
    ApiUnauthorizedErrorResponse(),
  );
}

/**
 * ApiUpdateProfile decorator
 * @description Swagger documentation for the updateProfile method.
 */
export function ApiUpdateProfile() {
  return applyDecorators(
    ApiOperation({ summary: 'Update current user info' }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Profile updated successfully',
      example: {
        success: true,
        statusCode: 200,
        message: 'Operation successful',
        data: {
          id: '01KJBATW6KMSW8C82XRZ8X7YE8',
          firstName: 'Some',
          middleName: 'One',
          lastName: 'Name',
          email: 'someone@gmail.com',
          phoneNumber: '0911111111',
          dob: '1990-01-01T00:00:00.000Z',
          gender: 'male',
          isOnline: false,
          emailVerifiedAt: null,
          lockOutUntil: null,
          failedLoginAttempts: 0,
          isActive: true,
          twoFactorConfirmedAt: null,
          createdAt: '2026-02-25T21:21:14.963Z',
          updatedAt: '2026-02-25T23:03:49.610Z',
          deletedAt: null,
          roles: ['super_admin'],
          permissions: [
            'user:read',
            'user:create',
            'user:update',
            'user:delete',
          ],
        },
      },
    }),
    ApiValidationErrorResponse(),
    ApiUnauthorizedErrorResponse(),
  );
}

/**
 * ApiChangePassword decorator
 * @description Swagger documentation for the changePassword method.
 */
export function ApiChangePassword() {
  return applyDecorators(
    ApiOperation({ summary: 'Change password' }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Password changed successfully',
      example: {
        success: false,
        statusCode: 400,
        timestamp: '2026-02-26T22:03:08.256Z',
        path: '/api/v1/job-grades',
      },
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'Invalid current password',
      example: {
        success: false,
        statusCode: 400,
        timestamp: '2026-02-26T22:03:08.256Z',
        path: '/api/v1/job-grades',
      },
    }),
    ApiValidationErrorResponse(),
    ApiUnauthorizedErrorResponse(),
  );
}
