import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'nestjs-prisma';

import { HashProvider } from '../providers/hash.provider/hash.provider';

import { ForgotPasswordDto } from './forgot-password.dto';
import { ResetPasswordDto } from './reset-password.dto';
import { MailService } from '@app/common/mail/providers/mail.service';
import { UserByEmailProvider } from '../users/providers';

/**
 * Verification service - Email verification and password reset flows.
 */
@Injectable()
export class VerificationService {
  constructor(
    private readonly db: PrismaService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly userByEmailProvider: UserByEmailProvider,
    private readonly hashProvider: HashProvider,
    private readonly configService: ConfigService,
  ) {}

  async sendVerificationEmail(userId: string) {
    const user = await this.db.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const token = await this.jwtService.signAsync(
      { sub: user.id, type: 'email-verification' },
      {
        secret: this.configService.get<string>('jwt.accessTokenSecret'),
        expiresIn: '24h',
      },
    );

    await this.mailService.sendVerificationEmail(user, token);
  }

  async verifyEmail(token: string) {
    try {
      const payload: { sub: string; type: string } =
        await this.jwtService.verifyAsync(token, {
          secret: this.configService.get<string>('jwt.accessTokenSecret'),
        });

      if (payload.type !== 'email-verification') {
        throw new UnauthorizedException('Invalid token type');
      }

      await this.db.user.update({
        where: { id: payload.sub },
        data: { emailVerifiedAt: new Date() },
      });
    } catch {
      throw new UnauthorizedException('Invalid or expired verification token');
    }
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const user = await this.userByEmailProvider.findByEmail(
      forgotPasswordDto.email,
    );

    const token = await this.jwtService.signAsync(
      { sub: user.id, type: 'password-reset' },
      {
        secret: this.configService.get<string>('jwt.accessTokenSecret'),
        expiresIn: '15m',
      },
    );

    await this.mailService.sendPasswordResetEmail(user, token);
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    try {
      const payload: { sub: string; type: string } =
        await this.jwtService.verifyAsync(resetPasswordDto.token, {
          secret: this.configService.get<string>('jwt.accessTokenSecret'),
        });

      if (payload.type !== 'password-reset') {
        throw new UnauthorizedException('Invalid token type');
      }

      const hashedPassword = await this.hashProvider.hashPassword(
        resetPasswordDto.newPassword,
      );

      await this.db.user.update({
        where: { id: payload.sub },
        data: { password: hashedPassword },
      });
    } catch {
      throw new UnauthorizedException('Invalid or expired reset token');
    }
  }
}
