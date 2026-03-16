import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiForbiddenResponse,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

/**
 * Swagger decorator for sending verification email.
 */
export function ApiSendVerificationEmail() {
  return applyDecorators(
    ApiOperation({ summary: 'Send email verification link to current user' }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Verification email sent successfully.',
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'User not found',
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
 * Swagger decorator for verifying email.
 */
export function ApiVerifyEmail() {
  return applyDecorators(
    ApiOperation({ summary: 'Verify email address with token' }),
    ApiQuery({
      name: 'token',
      required: true,
      description: 'The verification token sent to email',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Email verified successfully.',
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'Invalid or expired verification token',
    }),
  );
}

/**
 * Swagger decorator for enabling MFA.
 */
export function ApiEnableMfa() {
  return applyDecorators(
    ApiOperation({ summary: 'Initiate MFA setup and generate QR code' }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'MFA secret and QR code generated.',
      example: {
        secret: 'JBSWY3DPEHPK3PXP',
        qrCode: 'data:image/png;base64,...',
      },
    }),
    ApiResponse({
      status: HttpStatus.FORBIDDEN,
      description: 'MFA is already enabled or email not verified',
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'User not found',
    }),
    ApiUnauthorizedResponse({
      description: 'Unauthorized',
    }),
  );
}

/**
 * Swagger decorator for verifying MFA confirmation.
 */
export function ApiVerifyMfa() {
  return applyDecorators(
    ApiOperation({ summary: 'Confirm MFA setup with 6-digit code' }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'MFA activated successfully. Recovery codes returned.',
      example: {
        recoveryCodes: ['RECO-1234', 'RECO-5678', '...'],
      },
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'Invalid verification code',
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'MFA setup not initiated',
    }),
    ApiForbiddenResponse({
      description: 'Forbidden',
    }),
  );
}
