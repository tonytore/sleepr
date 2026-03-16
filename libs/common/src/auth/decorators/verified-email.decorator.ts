import { applyDecorators, UseGuards } from '@nestjs/common';

import { EmailVerifiedGuard } from '../guards/email-verified.guard';

/**
 * VerifiedEmail decorator. It applies the EmailVerifiedGuard to ensure the user's email is verified.
 * @returns Decorator function
 */
export const VerifiedEmail = () => {
  return applyDecorators(UseGuards(EmailVerifiedGuard));
};
