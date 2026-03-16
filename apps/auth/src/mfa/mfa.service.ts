/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { randomBytes } from 'node:crypto';

import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'nestjs-prisma';
import { generateSecret, generateURI, verify } from 'otplib';
import * as QRCode from 'qrcode';

import { HashProvider } from '../providers/hash.provider/hash.provider';

/**
 * MFA service - TOTP-based Multi-Factor Authentication setup and verification.
 */
@Injectable()
export class MfaService {
  constructor(
    private readonly db: PrismaService,
    private readonly hashProvider: HashProvider,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Generate MFA secret and QR code for a user.
   */
  async generateMfaSecret(
    userId: string,
  ): Promise<{ secret: string; qrCode: string }> {
    const user = await this.db.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.twoFactorConfirmedAt) {
      throw new ForbiddenException('MFA is already enabled');
    }

    const secret = generateSecret();
    const otpauthUrl = generateURI({
      issuer: this.configService.get<string>('app.name') || 'PSCMS',
      label: user.email,
      secret,
    });

    await this.db.user.update({
      where: { id: userId },
      data: { twoFactorSecret: secret },
    });

    const qrCode = await QRCode.toDataURL(otpauthUrl);

    return { secret, qrCode };
  }

  /**
   * Verify and confirm MFA setup using a 6-digit TOTP code.
   */
  async verifyMfaConfirmation(
    userId: string,
    code: string,
  ): Promise<{ recoveryCodes: string[] }> {
    const user = await this.db.user.findUnique({ where: { id: userId } });

    if (!user?.twoFactorSecret) {
      throw new NotFoundException('MFA setup not initiated');
    }

    const result = await verify({ token: code, secret: user.twoFactorSecret });

    if (!result.valid) {
      throw new UnauthorizedException('Invalid verification code');
    }

    const recoveryCodes = Array.from({ length: 10 }, () =>
      randomBytes(4).toString('hex').toUpperCase(),
    );

    const hashedRecoveryCodes = await Promise.all(
      recoveryCodes.map((rc) => this.hashProvider.hashPassword(rc)),
    );

    await this.db.user.update({
      where: { id: userId },
      data: {
        twoFactorConfirmedAt: new Date(),
        twoFactorRecoveryCodes: JSON.stringify(hashedRecoveryCodes),
      },
    });

    return { recoveryCodes };
  }
}
