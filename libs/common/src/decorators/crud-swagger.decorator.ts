import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiForbiddenResponse,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

/**
 * Adds a standard 401 Unauthorized response to Swagger documentation.
 */
export function ApiUnauthorizedErrorResponse() {
  return applyDecorators(
    ApiUnauthorizedResponse({
      description: 'Unauthorized',
      example: {
        success: false,
        statusCode: HttpStatus.UNAUTHORIZED,
        timestamp: '2026-02-26T22:03:08.256Z',
        path: '/api/v1/path',
        message: 'Unauthorized',
      },
    }),
  );
}

/**
 * Adds a standard 403 Forbidden response to Swagger documentation.
 */
export function ApiForbiddenErrorResponse() {
  return applyDecorators(
    ApiForbiddenResponse({
      description: 'Forbidden',
      example: {
        success: false,
        statusCode: HttpStatus.FORBIDDEN,
        timestamp: '2026-02-26T22:03:08.256Z',
        path: '/api/v1/path',
        message: 'Forbidden',
      },
    }),
  );
}

/**
 * Adds a 404 Not Found response for a named resource to Swagger documentation.
 * @param resource The display name of the resource (e.g., 'User', 'Role').
 */
export function ApiNotFoundErrorResponse(resource: string) {
  return applyDecorators(
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: `${resource} not found`,
      example: {
        success: false,
        statusCode: HttpStatus.NOT_FOUND,
        timestamp: '2026-02-26T22:03:08.256Z',
        path: '/api/v1/path',
        message: `${resource} not found`,
      },
    }),
  );
}

/**
 * Adds a standard 400 Bad Request / validation error response to Swagger documentation.
 */
export function ApiValidationErrorResponse() {
  return applyDecorators(
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Validation error',
      example: {
        success: false,
        statusCode: HttpStatus.BAD_REQUEST,
        timestamp: '2026-02-26T22:03:08.256Z',
        path: '/api/v1/path',
        message: 'field must not be empty',
      },
    }),
  );
}

/**
 * Adds a standard 500 Internal Server Error response to Swagger documentation.
 */
export function ApiInternalServerErrorResponse() {
  return applyDecorators(
    ApiResponse({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description: 'Internal server error',
      example: {
        success: false,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        timestamp: '2026-02-26T22:03:08.256Z',
        path: '/api/v1/path',
        message: 'Internal server error',
      },
    }),
  );
}

/**
 * Bundles the most common set of CRUD error responses in a single decorator:
 * 401 Unauthorized, 403 Forbidden, 404 Not Found, and 500 Internal Server Error.
 *
 * @param resource The display name of the resource (e.g., 'User', 'Role').
 * @param options Fine-grained control over which errors to include. All default to `true`.
 *
 * @example
 * \@ApiCrudErrors('User')                          // all 4 errors
 * \@ApiCrudErrors('Role', { notFound: false })     // skip 404
 * \@ApiCrudErrors('User', { forbidden: false })    // skip 403 (public endpoints)
 */
export function ApiCrudErrors(
  resource: string,
  options: {
    unauthorized?: boolean;
    forbidden?: boolean;
    notFound?: boolean;
    internal?: boolean;
  } = {},
) {
  const {
    unauthorized = true,
    forbidden = true,
    notFound = true,
    internal = true,
  } = options;

  const decorators: MethodDecorator[] = [];

  if (unauthorized) decorators.push(ApiUnauthorizedErrorResponse());
  if (forbidden) decorators.push(ApiForbiddenErrorResponse());
  if (notFound) decorators.push(ApiNotFoundErrorResponse(resource));
  if (internal) decorators.push(ApiInternalServerErrorResponse());

  return applyDecorators(...decorators);
}
