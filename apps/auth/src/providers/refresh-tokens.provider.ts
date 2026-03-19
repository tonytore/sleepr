import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma, type User } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

import { GenerateTokensProvider } from './generate-tokens.provider';
import { UsersService } from '../users/users.service';
import { RootConfig } from 'apps/reservations/src/config/config.type';
import { JwtPayload } from '@app/common/auth/interfaces/jwt-payload.interface';
import { ClientInfo } from '@app/common/auth/decorators/client-info.decorator';

/**
 * User with access include - It includes the roles, role, permissions, resource and action
 */
const userWithAccessInclude = Prisma.validator<Prisma.UserInclude>()({
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
});

/**
 * Refresh tokens provider - It handles refresh tokens and generates new access tokens
 */
@Injectable()
export class RefreshTokensProvider {
  /**
   * Constructor for RefreshTokensProvider. It injects the GenerateTokensProvider, UsersService and PrismaService.
   */
  constructor(
    private readonly generateTokensProvider: GenerateTokensProvider,
    private readonly usersService: UsersService,
    private readonly db: PrismaService,
    private readonly configService: ConfigService<RootConfig>,
  ) {}

  /**
   * Refresh tokens - It refreshes the access and refresh tokens for the user
   * @param userData - User data
   * @param client - Client information
   * @returns Object containing the access token
   */
  public async refreshTokens(userData: JwtPayload, client: ClientInfo) {
    try {
      const refreshTokenData = await this.db.refreshToken.findUnique({
        where: {
          id: userData.sid,
        },
      });

      if (
        !refreshTokenData ||
        refreshTokenData.isRevoked ||
        refreshTokenData.expiresAt < new Date()
      ) {
        throw new UnauthorizedException('Invalid, expired or revoked session');
      }

      // Check if session belongs to the user
      if (refreshTokenData.userId !== userData.sub) {
        throw new UnauthorizedException('Invalid session owner');
      }

      // Handle token rotation: Delete old session and create a new one
      await this.db.refreshToken.delete({
        where: { id: refreshTokenData.id },
      });

      const user = await this.usersService.findOne(userData.sub);
      return await this.handleTokens(user, client);
    } catch (error) {
      throw new UnauthorizedException(
        error instanceof Error ? error.message : 'Refresh failed',
      );
    }
  }

  /**
   * Parse duration - It parses the duration string and returns the duration in milliseconds
   * @param duration - Duration string
   * @returns Duration in milliseconds
   */
  private parseDuration(duration: string): number {
    const match = /^(\d+)(m|h|d|mins|hours|days)$/.exec(duration);
    if (!match) return 0;

    const value = Number(match[1]);
    const unit = match[2];

    switch (unit) {
      case 'm':
      case 'mins':
        return value * 60 * 1000;
      case 'h':
      case 'hours':
        return value * 60 * 60 * 1000;
      case 'd':
      case 'days':
        return value * 24 * 60 * 60 * 1000;
      default:
        return 0;
    }
  }

  /**
   * Handle tokens - It handles the tokens for the user. It generates a new access token and a new refresh token.
   * @param user - User
   * @param client - Client information
   * @returns Object containing the access token
   */
  public async handleTokens(user: User, client: ClientInfo) {
    const userWithRoles = await this.db.user.findUnique({
      where: { id: user.id },
      include: userWithAccessInclude,
    });

    const roles = userWithRoles?.roles.map((ur) => ur.role.name) || [];

    const permissions = Array.from(
      new Set(
        userWithRoles?.roles.flatMap((ur) =>
          ur.role.permissions.map(
            (rp) =>
              `${rp.permission.resource.name}:${rp.permission.action.name}`,
          ),
        ) || [],
      ),
    );

    const expiresAt = new Date(
      Date.now() +
        this.parseDuration(
          this.configService.get('jwt', { infer: true })!
            .refreshTokenExpiresIn || '15mins',
        ),
    );

    const sessionId = (
      await this.db.refreshToken.create({
        data: {
          userId: user.id,
          expiresAt,
          agent: client.userAgent || 'unknown',
          browser: client.browser || 'unknown',
          os: client.os || 'unknown',
          device: client.device || 'unknown',
          ipAddress: client.ip || 'unknown',
        },
      })
    ).id;

    const { accessToken } = await this.generateTokensProvider.generateTokens(
      user,
      roles,
      permissions,
      sessionId,
    );

    return { accessToken };
  }
}
