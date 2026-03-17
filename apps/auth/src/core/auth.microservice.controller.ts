/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// apps/auth/src/auth.microservice.ts

import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Controller()
export class AuthMicroserviceController {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  @MessagePattern('validate_token')
  async validateToken(token: string) {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get('jwt.accessTokenSecret'),
      });

      return {
        valid: true,
        user: payload,
      };
    } catch {
      return {
        valid: false,
        user: null,
      };
    }
  }
}
