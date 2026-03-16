import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

/**
 * Session service - Manages user sessions (active listing, revocation).
 */
@Injectable()
export class SessionService {
  constructor(private readonly db: PrismaService) {}

  /**
   * Get all active sessions for a user.
   */
  async getSessions(userId: string) {
    return await this.db.refreshToken.findMany({
      where: {
        userId,
        isRevoked: false,
        expiresAt: { gt: new Date() },
      },
      select: {
        id: true,
        agent: true,
        browser: true,
        os: true,
        device: true,
        ipAddress: true,
        createdAt: true,
      },
    });
  }

  /**
   * Revoke a specific session.
   */
  async revokeSession(userId: string, sessionId: string) {
    const session = await this.db.refreshToken.findFirst({
      where: { id: sessionId, userId },
    });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    await this.db.refreshToken.delete({ where: { id: sessionId } });
  }

  /**
   * Revoke all other sessions except the current one.
   */
  async revokeOtherSessions(userId: string, currentSessionId: string) {
    await this.db.refreshToken.deleteMany({
      where: { userId, id: { not: currentSessionId } },
    });
  }
}
