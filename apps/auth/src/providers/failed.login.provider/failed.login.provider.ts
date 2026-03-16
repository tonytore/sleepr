import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'nestjs-prisma';

/**
 * Failed login provider - It handles failed login attempts and locks the user account after a certain number of failed attempts
 */
@Injectable()
export class FailedLoginProvider {
  /**
   * Constructor for FailedLoginProvider. It injects the DatabaseService.
   */
  constructor(
    private readonly db: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Increment failed login attempts
   * @param email - Email of the user
   * @returns Updated user
   */
  async incrementFailedLoginAttempts(email: string) {
    const user = await this.db.user.findUnique({ where: { email } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.db.user.update({
      where: { email },
      data: { failedLoginAttempts: user.failedLoginAttempts + 1 },
    });
  }

  /**
   * Reset failed login attempts
   * @param email - Email of the user
   * @returns Updated user
   */
  async resetFailedLoginAttempts(email: string) {
    const user = await this.db.user.findUnique({ where: { email } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return await this.db.user.update({
      where: { email },
      data: { failedLoginAttempts: 0 },
      select: {
        id: true,
        email: true,
        firstName: true,
        middleName: true,
        lastName: true,
        phoneNumber: true,
        dob: true,
        gender: true,
        isOnline: true,
        emailVerifiedAt: true,
        createdAt: true,
        updatedAt: true,
        roles: {
          include: {
            role: {
              include: {
                permissions: {
                  include: {
                    permission: {
                      include: {
                        resource: true,
                        action: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  /**
   * Lock user account
   * @param email - Email of the user
   * @returns Updated user
   */
  async lockUser(email: string) {
    const user = await this.db.user.findUnique({ where: { email } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.db.user.update({
      where: { email },
      data: {
        lockOutUntil: new Date(
          Date.now() +
            this.configService.get<number>('app.lockOutDuration')! * 60 * 1000,
        ),
      },
    });
  }

  /**
   * Unlock user account
   * @param email - Email of the user
   * @returns Updated user
   */
  async unlockUser(email: string) {
    const user = await this.db.user.findUnique({ where: { email } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.db.user.update({
      where: { email },
      data: { lockOutUntil: null },
    });
  }

  /**
   * Check if user account is locked
   * @param email - Email of the user
   * @returns True if user account is locked, false otherwise
   */
  async isLocked(email: string) {
    const user = await this.db.user.findUnique({ where: { email } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user.lockOutUntil ? user.lockOutUntil > new Date() : false;
  }
}
