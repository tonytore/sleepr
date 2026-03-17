/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthClientService } from '../authClientService/auth-client-service';

@Injectable()
export class ReservationAuthGuard implements CanActivate {
  constructor(private authClient: AuthClientService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const token =
      request.cookies?.accessToken ||
      request.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('No token');
    }

    const result = await this.authClient.validateToken(token);

    if (!result.valid) {
      throw new UnauthorizedException('Invalid token');
    }

    request.user = result.user;

    return true;
  }
}
