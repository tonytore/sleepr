/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthClientService {
  constructor(@Inject('AUTH_SERVICE') private client: ClientProxy) {}

  async validateToken(token: string) {
    return firstValueFrom(this.client.send('validate_token', token));
  }
}
