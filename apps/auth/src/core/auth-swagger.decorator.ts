import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

/**
 * Api Auth Swagger Decorator
 * @returns
 */
export function ApiAuth() {
  /**
   * ApiAuth
   * @returns
   */
  return applyDecorators(
    /**
     * ApiOperation
     * @returns
     */
    ApiOperation({ summary: 'Sign in a user', description: 'Sign in a user' }),
    /**
     * ApiResponse
     * @returns
     */
    ApiResponse({
      status: HttpStatus.OK,
      description: 'User signed in successfully',
      example: {
        id: '01KHM0BP8F4TVNYD8JJMPSB05K',
        firstName: 'Some',
        middleName: 'One',
        lastName: 'Name',
        email: 'someone@gmail.com',
        phoneNumber: '+251912345678',
        dob: '2000-01-01T00:00:00.000Z',
        gender: 'male',
        isOnline: false,
        emailVerifiedAt: null,
        lockOutUntil: null,
        failedLoginAttempts: 0,
        isActive: true,
        twoFactorConfirmedAt: null,
        roles: ['super_admin'],
        permissions: ['user:read', 'user:create', 'user:update', 'user:delete'],
        createdAt: '2026-02-16T19:55:39.663Z',
        updatedAt: '2026-02-16T20:14:07.517Z',
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
    }),
    /**
     * ApiResponse
     * @returns
     */
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'Invalid credentials',
      example: {
        message: 'Invalid credentials',
        error: 'Invalid credentials',
        statusCode: HttpStatus.UNAUTHORIZED,
      },
    }),
    /**
     * ApiResponse
     * @returns
     */
    ApiResponse({
      status: HttpStatus.LOCKED,
      description: 'User is locked out',
      example: {
        statusCode: 423,
        message:
          'User someone@gmail.com is locked out until 0 minutes and 56 seconds',
      },
    }),
    /**
     * ApiResponse
     * @returns
     */
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'User not found',
      example: {
        message: 'User not found',
        error: 'Not Found',
        statusCode: HttpStatus.NOT_FOUND,
      },
    }),
  );
}

/**
 * ApiRefreshToken
 * @returns
 */
export function ApiRefreshToken() {
  return applyDecorators(
    ApiOperation({
      summary: 'Refresh access tokens',
      description: 'Refresh access tokens using an expired access token',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Tokens refreshed successfully',
      example: {
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'Invalid, expired or revoked session',
      example: {
        message: 'Invalid, expired or revoked session',
        error: 'Unauthorized',
        statusCode: HttpStatus.UNAUTHORIZED,
      },
    }),
    ApiResponse({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description: 'Internal server error',
      example: {
        message: 'Internal server error',
        error: 'Internal server error',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      },
    }),
  );
}

/**
 * ApiRegister
 * @returns
 */
export function ApiRegister() {
  return applyDecorators(
    ApiOperation({
      summary: 'Register a new user',
      description: 'Register a new user',
    }),
    ApiResponse({
      status: HttpStatus.CREATED,
      description: 'User registered successfully',
      example: {
        id: '01KHM0BP8F4TVNYD8JJMPSB05K',
        firstName: 'Some',
        middleName: 'One',
        lastName: 'Name',
        email: 'someone@gmail.com',
        phoneNumber: '+251912345678',
        dob: '2000-01-01T00:00:00.000Z',
        gender: 'male',
        isActive: true,
        createdAt: '2026-02-16T19:55:39.663Z',
        updatedAt: '2026-02-16T20:14:07.517Z',
      },
    }),
    ApiResponse({
      status: HttpStatus.CONFLICT,
      description: 'User already exists',
      example: {
        message: 'User already exist',
        error: 'someone@gmail.com already exist',
        statusCode: 409,
      },
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Validation error',
    }),
  );
}

/**
 * ApiSignOut
 * @returns
 */
export function ApiSignOut() {
  return applyDecorators(
    ApiOperation({
      summary: 'Sign out',
      description: 'Revokes the current session',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Signed out successfully',
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'Unauthorized',
    }),
  );
}

/**
 * ApiForgotPassword
 * @returns
 */
export function ApiForgotPassword() {
  return applyDecorators(
    ApiOperation({
      summary: 'Request password reset',
      description: 'Sends a password reset email if the user exists',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'If the email exists, a reset link has been sent',
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'User not found',
    }),
  );
}

/**
 * ApiResetPassword
 * @returns
 */
export function ApiResetPassword() {
  return applyDecorators(
    ApiOperation({
      summary: 'Reset password',
      description: 'Resets the password using a valid token',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Password reset successfully',
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'Invalid or expired token',
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Validation error',
    }),
  );
}
