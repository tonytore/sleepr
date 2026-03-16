import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

import {
  ChangePasswordDto,
  CreateUserDto,
  UpdateProfileDto,
  UpdateStatusDto,
  UpdateUserDto,
} from './dto';
import { CreateUserProvider } from './providers';
import { BaseService } from '@app/common/services/base.service';
import { CsvService } from '@app/common/services/csv.service';
import { PaginationDto } from '@app/common/dto/pagination.dto';
import { IdsDto } from '@app/common/dto/id.dto';
import { HashProvider } from '../providers/hash.provider/hash.provider';

/**
 * Service responsible for user-related database operations.
 * Connects to the database and performs CRUD operations for users.
 */
@Injectable()
export class UsersService extends BaseService<
  'user',
  Prisma.UserGetPayload<Record<string, never>>
> {
  protected searchableFields = [
    'firstName',
    'middleName',
    'lastName',
    'email',
    'phoneNumber',
  ];

  /**
   * Initializes the UsersService.
   * @param db - The database service for user data access.
   * @param createUserProvider - Provider for user creation logic.
   * @param hashProvider - Provider for password hashing and verification.
   */
  constructor(
    protected readonly db: PrismaService,
    private readonly createUserProvider: CreateUserProvider,
    private readonly hashProvider: HashProvider,
    private readonly csvService: CsvService,
  ) {
    super(db, 'user', 'User');
  }

  /**
   * Fetches a paginated list of registered users.
   * @param paginationDto - The pagination data (limit, page).
   * @param args - Additional Prisma arguments.
   * @returns A promise that resolves to a paginated response containing users.
   */
  override async findAll(
    paginationDto: PaginationDto,
    args?: Prisma.Args<PrismaService['user'], 'findMany'>,
  ) {
    return super.findAll(paginationDto, {
      ...args,
      where: {
        ...args?.where,
      },
      include: {
        ...(args?.include as Record<string, unknown>),
      },
    });
  }

  /**
   * Fetches a single user by their unique identifier.
   * @param id - The unique ID of the user.
   * @param args - Additional Prisma arguments.
   * @returns A promise that resolves to the user object.
   * @throws {NotFoundException} If no user is found with the given ID.
   */
  override async findOne(
    id: string,
    args?: Omit<Prisma.Args<PrismaService['user'], 'findUnique'>, 'where'>,
  ) {
    return super.findOne(id, {
      ...args,
      include: {
        ...(args?.include as Record<string, unknown>),
        roles: {
          include: {
            role: true,
          },
        },
      },
    });
  }

  /**
   * Creates a new user in the system.
   * @param createUserDto - The data required to create a user.
   * @returns A promise that resolves to the newly created user object.
   */
  override async create(createUserDto: CreateUserDto) {
    return await this.createUserProvider.create(createUserDto);
  }

  /**
   * Updates an existing user's information.
   * @param id - The unique ID of the user to update.
   * @param updateUserDto - The new data for the user.
   * @param args - Additional Prisma arguments.
   * @returns A promise that resolves to the updated user object.
   * @throws {NotFoundException} If the user to update does not exist.
   */
  override async update(
    id: string,
    updateUserDto: UpdateUserDto,
    args?: Omit<Prisma.Args<PrismaService['user'], 'update'>, 'where' | 'data'>,
  ) {
    const { roleIds, ...userData } = updateUserDto;

    // Use super.update which already verifies existence
    return super.update(
      id,
      {
        ...userData,
        roles: roleIds
          ? {
              deleteMany: {},
              create: roleIds.map((roleId) => ({ roleId })),
            }
          : undefined,
      },
      args,
    );
  }

  override async remove(id: string) {
    return super.remove(id);
  }

  /**
   * Permanently deletes a user from the system.
   * @param id - The unique ID of the user to permanently delete.
   * @returns A promise that resolves to the deleted user object.
   * @throws {NotFoundException} If the user to delete does not exist.
   */
  override async removePermanently(id: string) {
    return super.removePermanently(id);
  }

  /**
   * Deletes multiple users.
   * @param idsDto - DTO containing multiple user IDs.
   */
  override async removeMany(idsDto: IdsDto) {
    return super.removeMany(idsDto);
  }

  /**
   * Retrieves the profile information for a specific user.
   * @param userId - The ID of the user whose profile is being requested.
   * @returns A promise that resolves to the user's profile details.
   * @throws {NotFoundException} If the user is not found.
   */
  async getProfile(userId: string) {
    const user = await this.db.user.findUnique({
      where: { id: userId },
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

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Map extracted roles into simple string arrays
    const roles = user.roles.map((r) => r.role.name);

    // Flatten permissions "resourceName:actionName"
    const permissionSet = new Set<string>();

    for (const r of user.roles) {
      for (const rp of r.role.permissions) {
        const resourceName = rp.permission.resource.name;
        const actionName = rp.permission.action.name;
        permissionSet.add(`${resourceName}:${actionName}`);
      }
    }

    return {
      ...user,
      roles,
      permissions: Array.from(permissionSet),
    };
  }

  /**
   * Updates the profile information of the authenticated user.
   * @param userId - The ID of the authenticated user.
   * @param updateProfileDto - The new profile data.
   * @returns A promise that resolves to the updated user's profile info.
   * @throws {NotFoundException} If the user is not found.
   */
  async updateProfileInfo(userId: string, updateProfileDto: UpdateProfileDto) {
    return super.update(userId, updateProfileDto, {
      select: {
        id: true,
        email: true,
        firstName: true,
        middleName: true,
        lastName: true,
        phoneNumber: true,
        dob: true,
        gender: true,
        updatedAt: true,
      },
    });
  }

  /**
   * Changes the password for a specific user.
   * @param userId - The ID of the user changing their password.
   * @param changePasswordDto - The current and new password data.
   * @returns A promise that resolves when the password has been successfully updated.
   * @throws {NotFoundException} If the user is not found.
   * @throws {UnauthorizedException} If the current password is invalid.
   */
  async changePassword(userId: string, changePasswordDto: ChangePasswordDto) {
    const user = await super.findOne(userId, {
      select: { password: true },
    });

    // Verify current password
    const isPasswordValid = await this.hashProvider.verifyPassword(
      changePasswordDto.currentPassword,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid current password');
    }

    // Hash new password
    const hashedPassword = await this.hashProvider.hashPassword(
      changePasswordDto.newPassword,
    );

    // Update password
    await super.update(userId, { password: hashedPassword });
  }

  /**
   * Toggles the active status of a user account.
   * @param id - The ID of the user whose status is being updated.
   * @param updateStatusDto - The new status data (isActive).
   * @returns A promise that resolves to the updated user object.
   * @throws {NotFoundException} If the user is not found.
   */
  async updateStatus(id: string, updateStatusDto: UpdateStatusDto) {
    return super.update(id, updateStatusDto);
  }

  /**
   * Exports user data to a CSV string.
   * @param ids - Optional array of user IDs to filter the export. If not provided, all users are exported.
   * @returns A promise that resolves to the generated CSV string.
   */
  async exportToCsv(ids?: string[]): Promise<string> {
    const where = ids && ids.length > 0 ? { id: { in: ids } } : {};

    const users = await this.db.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phoneNumber: true,
        gender: true,
        isActive: true,
        createdAt: true,
      },
    });

    return this.csvService.generate(users, [
      'id',
      'email',
      'firstName',
      'lastName',
      'phoneNumber',
      'gender',
      'isActive',
      'createdAt',
    ]);
  }
}
