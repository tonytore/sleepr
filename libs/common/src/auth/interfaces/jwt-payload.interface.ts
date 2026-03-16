/**
 * JwtPayload
 * @description This interface is used to define the payload of a JWT.
 */
export interface JwtPayload {
  /**
   * sub
   * @description The subject of the JWT (User ID).
   */
  sub: string;
  /**
   * name
   * @description The full name of the user (firstName + middleName + lastName).
   */
  name: string;
  /**
   * email
   * @description The email of the user.
   */
  email: string;
  /**
   * emailVerified
   * @description The email verification status of the user.
   */
  emailVerified: boolean;
  /**
   * roles
   * @description The roles of the user.
   */
  roles: string[];
  /**
   * perms
   * @description The permissions of the user, grouped by resource.
   * Format: { [resource]: [action1, action2] }
   */
  perms: Record<string, string[]>;
  /**
   * sid
   * @description The session ID.
   */
  sid: string;
  /**
   * iat
   * @description The issued at time of the JWT.
   */
  iat?: number;
  /**
   * exp
   * @description The expiration time.
   */
  exp?: number;
  /**
   * aud
   * @description The audience.
   */
  aud?: string;
  /**
   * iss
   * @description The issuer.
   */
  iss?: string;
}
