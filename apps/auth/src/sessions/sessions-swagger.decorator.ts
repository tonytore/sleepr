import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiForbiddenResponse,
  ApiOperation,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

/**
 * Swagger decorator for listing all active sessions.
 */
export function ApiGetSessions() {
  return applyDecorators(
    ApiOperation({ summary: 'List all active sessions for the current user' }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'The active sessions have been successfully retrieved.',
      example: [
        {
          id: '01KJBATTD...',
          agent: 'Mozilla/5.0...',
          browser: 'Chrome',
          os: 'macOS',
          device: 'MacBook',
          ipAddress: '127.0.0.1',
          createdAt: '2026-02-26T10:00:00.000Z',
        },
      ],
    }),
    ApiUnauthorizedResponse({
      description: 'Unauthorized',
    }),
    ApiForbiddenResponse({
      description: 'Forbidden',
    }),
  );
}

/**
 * Swagger decorator for revoking other sessions.
 */
export function ApiRevokeOtherSessions() {
  return applyDecorators(
    ApiOperation({ summary: 'Revoke all sessions except the current one' }),
    ApiResponse({
      status: HttpStatus.NO_CONTENT,
      description: 'All other sessions have been successfully revoked.',
    }),
    ApiUnauthorizedResponse({
      description: 'Unauthorized',
    }),
    ApiForbiddenResponse({
      description: 'Forbidden',
    }),
  );
}

/**
 * Swagger decorator for revoking a specific session.
 */
export function ApiRevokeSession() {
  return applyDecorators(
    ApiOperation({ summary: 'Revoke a specific session by ID' }),
    ApiResponse({
      status: HttpStatus.NO_CONTENT,
      description: 'The session has been successfully revoked.',
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Session not found',
    }),
    ApiUnauthorizedResponse({
      description: 'Unauthorized',
    }),
    ApiForbiddenResponse({
      description: 'Forbidden',
    }),
  );
}
