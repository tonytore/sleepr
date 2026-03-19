/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'nestjs-prisma';

import { FailedLoginProvider } from '../providers/failed.login.provider/failed.login.provider';
import { HashProvider } from '../providers/hash.provider/hash.provider';
import { RefreshTokensProvider } from '../providers/refresh-tokens.provider';

import { RegisterDto } from './register.dto';
import { SignInDto } from './signIn.dto';

import { ClientInfo } from '@app/common/auth/decorators/client-info.decorator';
import { UserByEmailProvider } from '../users/providers';
import { UsersService } from '../users/users.service';
import { JwtPayload } from '@app/common/auth/interfaces/jwt-payload.interface';

/**
 * Auth service - Core authentication: sign-in, sign-up, sign-out, and token refresh.
 */
@Injectable()
export class AuthService {
  constructor(
    private readonly db: PrismaService,
    private readonly userByEmailProvider: UserByEmailProvider,
    private readonly usersService: UsersService,
    private readonly hashProvider: HashProvider,
    private readonly failedLoginProvider: FailedLoginProvider,
    private readonly refreshTokensProvider: RefreshTokensProvider,
    private readonly configService: ConfigService,
  ) {}

  async signIn(signInDto: SignInDto, client: ClientInfo) {
    const user = await this.userByEmailProvider.findByEmail(
      signInDto.email,
      true,
    );

    if (await this.failedLoginProvider.isLocked(user.email)) {
      throw new HttpException(
        `User ${user.email} is locked out until ${Math.floor(
          (new Date(user.lockOutUntil || '').getTime() - Date.now()) /
            1000 /
            60,
        )} minutes and ${Math.floor(
          ((new Date(user.lockOutUntil || '').getTime() - Date.now()) / 1000) %
            60,
        )} seconds`,
        HttpStatus.LOCKED,
        { cause: new Error('User tried to sign in too many times') },
      );
    }

    if (
      user.failedLoginAttempts >=
      this.configService.get<number>('app.maxFailedLoginAttemptPerMinutes')!
    ) {
      await this.failedLoginProvider.lockUser(user.email);
    }

    const isPasswordValid = await this.hashProvider.verifyPassword(
      signInDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      await this.failedLoginProvider.incrementFailedLoginAttempts(user.email);
      throw new UnauthorizedException('Invalid credentials', {
        description: 'Invalid credentials',
        cause: new Error('Invalid credentials'),
      });
    }

    const userWithRoles =
      await this.failedLoginProvider.resetFailedLoginAttempts(user.email);
    const unlockedUser = await this.failedLoginProvider.unlockUser(user.email);

    const { accessToken } = await this.refreshTokensProvider.handleTokens(
      unlockedUser,
      client,
    );

    const roles = userWithRoles.roles.map((r) => r.role.name);

    // Flatten permissions "resourceName:actionName"
    const permissionSet = new Set<string>();

    for (const r of userWithRoles.roles) {
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
      accessToken,
    };
  }

  async verifyAccessToken(token: string): Promise<JwtPayload> {
    try {
      const payload = await this.refreshTokensProvider[
        'generateTokensProvider'
      ]['jwtService'].verifyAsync(token, {
        secret:
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          this.configService.get('jwt', { infer: true })!.accessTokenSecret,
      });

      return payload;
    } catch (err) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  async refreshToken(user: JwtPayload, client: ClientInfo) {
    return await this.refreshTokensProvider.refreshTokens(user, client);
  }

  async register(registerDto: RegisterDto) {
    return await this.usersService.create(registerDto);
  }

  async signOut(user: JwtPayload) {
    if (!user.sid) {
      throw new UnauthorizedException('No session found for this user');
    }
    try {
      await this.db.refreshToken.delete({ where: { id: user.sid } });
    } catch (error) {
      console.error('Sign out error or session already deleted:', error);
    }
  }
}
