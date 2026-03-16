import { Injectable } from '@nestjs/common';

/**
 * Hash provider
 * @abstract
 */
@Injectable()
export abstract class HashProvider {
  /**
   * Hash password
   * @param password - Password to hash
   * @returns Hashed password
   */
  abstract hashPassword(password: string | Buffer): Promise<string>;

  /**
   * Verify password
   * @param password - Password to verify
   * @param hash - Hashed password
   * @returns True if password matches, false otherwise
   */
  abstract verifyPassword(
    password: string | Buffer,
    hash: string,
  ): Promise<boolean>;
}
