/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

import type { User } from '@prisma/client';

/**
 * MailService
 * @description This service is used to send emails.
 */
@Injectable()
export class MailService {
  /**
   * constructor
   * @param mailerService The mailer service.
   */
  constructor(private readonly mailerService: MailerService) {}

  /**
   * sendUserWelcomeEmail
   * @description This method is used to send a welcome email to a user.
   * @param user The user to send the welcome email to.
   */
  public async sendUserWelcomeEmail(user: User): Promise<void> {
    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Welcome to our platform',
      template: './welcome',
      context: {
        name: user.firstName + ' ' + user.middleName + ' ' + user.lastName,
        email: user.email,
        url: 'https://google.com',
      },
    });
  }

  /**
   * sendPasswordResetEmail
   * @description This method is used to send a password reset email to a user.
   * @param user The user to send the password reset email to.
   * @param token The token to be used in the password reset email.
   */
  public async sendPasswordResetEmail(
    user: {
      email: string;
      firstName: string;
      middleName: string;
      lastName: string;
    },
    token: string,
  ): Promise<void> {
    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Password Reset Request',
      template: './password-reset',
      context: {
        name: user.firstName + ' ' + user.middleName + ' ' + user.lastName,
        email: user.email,
        url: `https://yourapp.com/reset-password?token=${token}`,
      },
    });
  }

  /**
   * sendVerificationEmail
   * @description This method is used to send a verification email to a user.
   * @param user The user to send the verification email to.
   * @param token The token to be used in the verification email.
   */
  public async sendVerificationEmail(
    user: {
      email: string;
      firstName: string;
      middleName: string;
      lastName: string;
    },
    token: string,
  ): Promise<void> {
    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Verify Your Email Address',
      template: './email-verification',
      context: {
        name: user.firstName + ' ' + user.middleName + ' ' + user.lastName,
        email: user.email,
        url: `https://yourapp.com/verify-email?token=${token}`,
      },
    });
  }
}
