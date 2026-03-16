import {
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

import { CreateUserDto } from '../dto';
import { HashProvider } from '../../providers/hash.provider/hash.provider';
import { MailService } from '@app/common/mail/providers/mail.service';

/**
 * Provider responsible for the business logic of creating a new user.
 * Includes email and phone number uniqueness checks, password hashing,
 * database persistence, and sending welcome emails.
 */
@Injectable()
export class CreateUserProvider {
  /**
   * Initializes the CreateUserProvider.
   * @param db - The database service for user data persistence.
   * @param hashProvider - The provider for password hashing.
   * @param mailService - The service for sending automated emails.
   */
  constructor(
    private readonly db: PrismaService,
    @Inject(forwardRef(() => HashProvider))
    private readonly hashProvider: HashProvider,
    private readonly mailService: MailService,
  ) {}

  /**
   * Orchestrates the process of creating a new user account.
   * @param createUserDto - The data required to create a user.
   * @returns A promise that resolves to the newly created user object.
   * @throws {ConflictException} If a user with the same email or phone number already exists.
   */
  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.db.user.findFirst({
      where: { email: createUserDto.email },
    });
    const existingUserByPhone = await this.db.user.findFirst({
      where: { phoneNumber: createUserDto.phoneNumber },
    });
    if (existingUser || existingUserByPhone) {
      throw new ConflictException('User already exist', {
        description: `${existingUser?.email || existingUserByPhone?.phoneNumber} already exist`,
      });
    }

    const hashedPassword = await this.hashProvider.hashPassword(
      createUserDto.password,
    );

    const { roleIds, ...userData } = createUserDto;

    if (roleIds && roleIds.length > 0) {
      const rolesCount = await this.db.role.count({
        where: { id: { in: roleIds } },
      });

      if (rolesCount !== roleIds.length) {
        throw new NotFoundException('One or more roles do not exist');
      }
    }

    const newUser = await this.db.user.create({
      data: {
        ...userData,
        password: hashedPassword,
        roles: roleIds
          ? {
              create: roleIds.map((roleId) => ({ roleId })),
            }
          : undefined,
      },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });

    // Send a welcome email asynchronously
    await this.mailService.sendUserWelcomeEmail(newUser);

    return newUser;
  }
}
