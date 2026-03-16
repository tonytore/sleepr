import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';

import { CreateUserDto } from '../dto';
import { ApiPaginatedResponse } from '@app/common/decorators/paginated-response.decorator';
import {
  ApiCrudErrors,
  ApiUnauthorizedErrorResponse,
  ApiValidationErrorResponse,
} from '@app/common/decorators/crud-swagger.decorator';

const userExample = {
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
};

/**
 * ApiFindAllUser decorator
 * @description Swagger documentation for the findAll method.
 */
export function ApiFindAllUser() {
  return applyDecorators(
    ApiOperation({
      summary: 'Fetches a list of registered users on the application',
    }),
    ApiPaginatedResponse(CreateUserDto, 'Users found successfully', {
      success: true,
      statusCode: 200,
      message: 'Users found successfully',
      data: [userExample],
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalItems: 1,
        limit: 10,
      },
    }),
    ApiUnauthorizedErrorResponse(),
  );
}

/**
 * ApiCreateUser decorator
 * @description Swagger documentation for the createUser method.
 */
export function ApiCreateUser() {
  return applyDecorators(
    ApiOperation({ summary: 'Creates a new user' }),
    ApiResponse({
      status: 201,
      description: 'User created successfully',
      example: {
        success: true,
        statusCode: 201,
        message: 'User created successfully',
        data: userExample,
      },
    }),
    ApiResponse({
      status: 409,
      description: 'User already exists',
      example: {
        success: false,
        statusCode: 409,
        path: '/api/v1/users',
        message: 'User already exist',
      },
    }),
    ApiValidationErrorResponse(),
    ApiCrudErrors('User', { notFound: false }),
  );
}

/**
 * ApiFindOneUser decorator
 * @description Swagger documentation for the findOne method.
 */
export function ApiFindOneUser() {
  return applyDecorators(
    ApiOperation({ summary: 'Fetches a single user by ID' }),
    ApiParam({
      name: 'id',
      type: 'string',
      required: true,
      description: 'The ID of the user to fetch',
      example: '01KHHVGYJ3W0WE8ENTAYDHCF66',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'User found successfully',
      example: userExample,
    }),
    ApiCrudErrors('User'),
  );
}

/**
 * ApiUpdateUser decorator
 * @description Swagger documentation for the update method.
 */
export function ApiUpdateUser() {
  return applyDecorators(
    ApiOperation({ summary: 'Updates an existing user' }),
    ApiResponse({
      status: 200,
      description: 'User updated successfully',
      example: {
        success: true,
        statusCode: 200,
        message: 'User updated successfully',
        data: userExample,
      },
    }),
    ApiValidationErrorResponse(),
    ApiCrudErrors('User'),
  );
}

/**
 * ApiUpdateUserStatus decorator
 * @description Swagger documentation for the updateStatus method.
 */
export function ApiUpdateUserStatus() {
  return applyDecorators(
    ApiOperation({
      summary: 'Locks or unlocks a user account',
      description: 'Updates the active status of a user account by its ID.',
    }),
    ApiResponse({
      status: 200,
      description: 'User status successfully updated.',
      example: {
        success: true,
        statusCode: 200,
        message: 'User status successfully updated.',
        data: {
          id: '01KHHVGYJ3W0WE8ENTAYDHCF66',
          isActive: false,
          updatedAt: '2026-02-15T23:52:40.259Z',
        },
      },
    }),
    ApiUnauthorizedErrorResponse(),
    ApiCrudErrors('User', {
      unauthorized: false,
      forbidden: false,
      internal: false,
    }),
  );
}

/**
 * ApiExportUsers decorator
 * @description Swagger documentation for the exportUsers method.
 */
export function ApiExportUsers() {
  return applyDecorators(
    ApiOperation({
      summary: 'Exports user list to CSV',
      description:
        'Generates a CSV file containing a list of all users or specifically selected users by their IDs.',
    }),
    ApiQuery({
      name: 'ids',
      required: false,
      type: String,
      description:
        'A comma-separated list of user IDs to export. If omitted, all users will be exported.',
      example: '01KHHVGYJ3W0WE8ENTAYDHCF66,01KHHVGYJ3W0WE8ENTAYDHCF67',
    }),
    ApiResponse({
      status: 200,
      description:
        'CSV file generated and returned as a downloadable attachment.',
    }),
    ApiUnauthorizedErrorResponse(),
  );
}

/**
 * ApiDeleteUser decorator
 * @description Swagger documentation for the remove method.
 */
export function ApiDeleteUser() {
  return applyDecorators(
    ApiOperation({ summary: 'Deletes an existing user' }),
    ApiResponse({
      status: 200,
      description: 'User deleted successfully',
      example: {
        success: true,
        statusCode: 200,
        message: 'User deleted successfully',
        data: userExample,
      },
    }),
    ApiCrudErrors('User'),
  );
}

/**
 * ApiDeletePermanentlyUser decorator
 * @description Swagger documentation for the removePermanently method.
 */
export function ApiDeletePermanentlyUser() {
  return applyDecorators(
    ApiOperation({
      summary: 'Permanently deletes a user',
      description:
        'Hard deletes a user from the database. This action cannot be undone.',
    }),
    ApiParam({
      name: 'id',
      type: 'string',
      required: true,
      description: 'The unique ID of the user to permanently delete',
      example: '01KHHVGYJ3W0WE8ENTAYDHCF66',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'The user has been permanently deleted.',
      example: {
        success: true,
        statusCode: 200,
        message: 'User permanently deleted successfully',
        data: {
          id: '01KHHVGYJ3W0WE8ENTAYDHCF66',
          email: 'someone@gmail.com',
          firstName: 'Some',
          lastName: 'Name',
        },
      },
    }),
    ApiCrudErrors('User'),
  );
}

/**
 * ApiDeleteManyUsers decorator
 * @description Swagger documentation for the removeMany method.
 */
export function ApiDeleteManyUsers() {
  return applyDecorators(
    ApiOperation({
      summary: 'Deletes multiple users',
      description: 'Soft deletes multiple users identified by an array of IDs.',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Users deleted successfully.',
      example: {
        success: true,
        statusCode: 200,
        message: 'Users deleted successfully',
        data: {
          count: 2,
        },
      },
    }),
    ApiCrudErrors('User'),
  );
}
