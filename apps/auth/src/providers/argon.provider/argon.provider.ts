/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/require-await */
import { Injectable } from '@nestjs/common';
import * as argon from 'argon2';

import { HashProvider } from '../hash.provider/hash.provider';

/**
 * Argon provider - It uses argon2 library to hash and verify passwords
 * @implements {HashProvider}
 */
@Injectable()
export class ArgonProvider implements HashProvider {
  /**
   * Hash password
   * @param data - Password to hash
   * @returns Hashed password
   */
  public async hashPassword(data: string | Buffer): Promise<string> {
    return argon.hash(data);
  }

  /**
   * Verify password
   * @param data - Password to verify
   * @param encrypted - Hashed password
   * @returns True if password matches, false otherwise
   */
  async verifyPassword(
    data: string | Buffer,
    encrypted: string,
  ): Promise<boolean> {
    return argon.verify(encrypted, data);
  }
}
