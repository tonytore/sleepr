import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

/**
 * Provider responsible for retrieving user data by email.
 * Includes logic for checking user status and handling deleted accounts.
 */
@Injectable()
export class UserByEmailProvider {
  /**
   * Initializes the UserByEmailProvider.
   * @param db - The database service for user data access.
   */
  constructor(private readonly db: PrismaService) {}

  /**
   * Searches for a user based on their email address.
   * @param email - The unique email address of the user.
   * @param includePassword - Flag to determine if the hashed password should be included in the response (useful for authentication).
   * @returns A promise that resolves to the user object if found and active.
   * @throws {NotFoundException} If the user does not exist, is deactivated, or has been deleted.
   */
  async findByEmail(email: string, includePassword: boolean = false) {
    const user = await this.db.user.findFirst({
      where: { email },
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
        failedLoginAttempts: true,
        lockOutUntil: true,
        ...(includePassword && { password: true }),
        isActive: true,
        deletedAt: true,
      },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.deletedAt) {
      throw new NotFoundException('User has been deleted!');
    }

    if (!user.isActive) {
      throw new NotFoundException('User is not active!');
    }
    return user;
  }
}
