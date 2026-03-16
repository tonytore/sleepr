import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { MfaService } from '../mfa/mfa.service';
import { VerifyMfaDto } from '../mfa/verify-mfa.dto';

import {
  ApiEnableMfa,
  ApiSendVerificationEmail,
  ApiVerifyEmail,
  ApiVerifyMfa,
} from './verification-swagger.decorator';
import { VerificationService } from './verification.service';
import { AuthType } from '@app/common/auth/enums/auth-type.enum';
import { CurrentUser } from '@app/common/auth/decorators/current-user.decorator';
import { type JwtPayload } from '@app/common/auth/interfaces/jwt-payload.interface';
import { Auth, Public } from '@app/common/auth/decorators/auth.decorator';
import { VerifiedEmail } from '@app/common/auth/decorators/verified-email.decorator';

/**
 * Verification controller - Email verification and MFA setup.
 */
@Controller('verification')
@ApiTags('Verification')
export class VerificationController {
  constructor(
    private readonly verificationService: VerificationService,
    private readonly mfaService: MfaService,
  ) {}

  @Post('send-email')
  @Auth(AuthType.Bearer)
  @HttpCode(HttpStatus.OK)
  @ApiSendVerificationEmail()
  sendEmail(@CurrentUser() user: JwtPayload): Promise<void> {
    return this.verificationService.sendVerificationEmail(user.sub);
  }

  @Get('verify-email')
  @Public()
  @ApiVerifyEmail()
  verifyEmail(@Query('token') token: string): Promise<void> {
    return this.verificationService.verifyEmail(token);
  }

  @Post('mfa/enable')
  @Auth(AuthType.Bearer)
  @VerifiedEmail()
  @HttpCode(HttpStatus.OK)
  @ApiEnableMfa()
  async enableMfa(
    @CurrentUser() user: JwtPayload,
  ): Promise<{ secret: string; qrCode: string }> {
    return await this.mfaService.generateMfaSecret(user.sub);
  }

  @Post('mfa/verify')
  @Auth(AuthType.Bearer)
  @VerifiedEmail()
  @HttpCode(HttpStatus.OK)
  @ApiVerifyMfa()
  async verifyMfa(
    @CurrentUser() user: JwtPayload,
    @Body() verifyMfaDto: VerifyMfaDto,
  ): Promise<{ recoveryCodes: string[] }> {
    return await this.mfaService.verifyMfaConfirmation(
      user.sub,
      verifyMfaDto.code,
    );
  }
}
