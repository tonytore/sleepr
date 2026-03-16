import { RootConfig } from 'apps/reservations/src/config/config.type';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, type JwtSignOptions } from '@nestjs/jwt';

import type { User } from '@prisma/client';

/**
 * Generate tokens provider - It generates access and refresh tokens for the user
 */
@Injectable()
export class GenerateTokensProvider {
  /**
   * Constructor for GenerateTokensProvider. It injects the JwtService.
   */
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<RootConfig>,
  ) {}

  /**
   * Sign token - It signs a token with the given payload
   * @param userId - User ID
   * @param expiresIn - Token expiration time
   * @param secret - Token secret
   * @param payload - Token payload
   * @returns Signed token
   */
  private async signToken<T>(
    userId: string,
    expiresIn: string,
    secret: string,
    payload?: T,
  ) {
    return await this.jwtService.signAsync(
      {
        sub: userId,
        ...payload,
      },
      {
        secret,
        expiresIn,
        audience: this.configService.get('jwt', { infer: true })!.tokenAudience,
        issuer: this.configService.get('jwt', { infer: true })!.tokenIssuer,
      } as JwtSignOptions,
    );
  }

  /**
   * Generate tokens - It generates access and refresh tokens for the user and returns an object containing the access token
   * @param user - User
   * @param roles - Roles
   * @param permissions - Permissions
   * @param sessionId - Session ID
   * @returns Object containing the access token
   */
  async generateTokens(
    user: User,
    roles: string[],
    permissions: string[],
    sessionId: string,
  ) {
    // Pack permissions: Array of "resource:action" -> Record<resource, action[]>
    const perms: Record<string, string[]> = {};
    for (const permission of permissions) {
      const [resource, action] = permission.split(':');
      if (!perms[resource]) {
        perms[resource] = [];
      }
      perms[resource].push(action);
    }

    const fullName = [user.firstName, user.middleName, user.lastName]
      .filter(Boolean)
      .join(' ');

    const payload = {
      name: fullName,
      email: user.email,
      emailVerifiedAt: user.emailVerifiedAt,
      roles,
      perms,
      sid: sessionId,
    };

    const accessToken = await this.signToken(
      user.id,
      this.configService.get('jwt', { infer: true })!.accessTokenExpiresIn,
      this.configService.get('jwt', { infer: true })!.accessTokenSecret!,
      payload,
    );

    return { accessToken };
  }
}
