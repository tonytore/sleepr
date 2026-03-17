import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';

import { ForgotPasswordDto } from '../verification/forgot-password.dto';
import { ResetPasswordDto } from '../verification/reset-password.dto';
import { VerificationService } from '../verification/verification.service';

import {
  ApiAuth,
  ApiForgotPassword,
  ApiRefreshToken,
  ApiRegister,
  ApiResetPassword,
  ApiSignOut,
} from './auth-swagger.decorator';
import { AuthService } from './auth.service';
import { RegisterDto } from './register.dto';
import { SignInDto } from './signIn.dto';

import type { Response } from 'express';
import { Auth, Public } from '@app/common/auth/decorators/auth.decorator';
import { ClientInfo } from '@app/common/auth/decorators/client-info.decorator';
import { AuthType } from '@app/common/auth/enums/auth-type.enum';
import { CurrentUser } from '@app/common/auth/decorators/current-user.decorator';
import { type JwtPayload } from '@app/common/auth/interfaces/jwt-payload.interface';
import { RootConfig } from '../config/config.type';

/**
 * Auth controller - sign-in, sign-up, sign-out, token refresh, and password reset.
 */
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly verificationService: VerificationService,
    private readonly configService: ConfigService<RootConfig>,
  ) {}

  /**
   * Parse duration - It parses the duration string and returns the duration in milliseconds
   * @param duration - Duration string
   * @returns Duration in milliseconds
   */
  private parseDuration(duration: string): number {
    const match = /^(\d+)(mins|hours|days)$/.exec(duration);
    if (!match) return 0;
    const value = Number.parseInt(match[1]);
    const unit = match[2];
    switch (unit) {
      case 'mins':
        return value * 60 * 1000;
      case 'hours':
        return value * 60 * 60 * 1000;
      case 'days':
        return value * 24 * 60 * 60 * 1000;
      default:
        return 0;
    }
  }

  // Get dynamic cookie options based on JWT config
  private getCookieOptions() {
    const configValue =
      this.configService.get('jwt', { infer: true })?.refreshTokenExpiresIn ||
      '7d';

    return {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      path: '/',
      maxAge: this.parseDuration(configValue),
    };
  }

  @Post('sign-in')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiAuth()
  async signIn(
    @Body() signInDto: SignInDto,
    @ClientInfo() client: ClientInfo,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, ...result } = await this.authService.signIn(
      signInDto,
      client,
    );

    // Attach accessToken to HttpOnly cookie for web clients
    res.cookie('accessToken', accessToken, this.getCookieOptions());

    return result;
  }

  @Post('refresh-tokens')
  @Auth(AuthType.AllowExpiredToken)
  @HttpCode(HttpStatus.OK)
  @ApiRefreshToken()
  async refreshToken(
    @CurrentUser() user: JwtPayload,
    @ClientInfo() client: ClientInfo,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, ...result } = await this.authService.refreshToken(
      user,
      client,
    );

    // Attach new accessToken to HttpOnly cookie for web clients
    res.cookie('accessToken', accessToken, this.getCookieOptions());

    return result;
  }

  @Post('sign-up')
  @Public()
  @HttpCode(HttpStatus.CREATED)
  @ApiRegister()
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('sign-out')
  @Auth(AuthType.Bearer)
  @HttpCode(HttpStatus.OK)
  @ApiSignOut()
  async signOut(
    @CurrentUser() user: JwtPayload,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.signOut(user);

    // Clear the cookie on sign-out
    res.clearCookie('accessToken', this.getCookieOptions());

    return { success: true, message: 'Signed out successfully' };
  }

  @Post('forgot-password')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiForgotPassword()
  forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.verificationService.forgotPassword(forgotPasswordDto);
  }

  @Post('reset-password')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiResetPassword()
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.verificationService.resetPassword(resetPasswordDto);
  }
}
