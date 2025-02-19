import { TRPCError } from '@trpc/server';
import { prisma } from '../db';
import type { Session } from 'next-auth';

interface RateLimitContext {
  req: {
    headers: Record<string, string | string[] | undefined>;
    socket: {
      remoteAddress?: string;
    };
  };
  session: Session | null;
}

interface LimitRecord {
  id: string;
  userId?: string | null;
  sessionId?: string | null;
  ipAddress?: string | null;
  monthlyCount: number;
  dailyCount: number;
  sessionCount: number;
  lastQueryDate: Date;
}

export const RateLimitService = {
  async getOrCreateLimitRecord(ctx: RateLimitContext): Promise<LimitRecord> {
    const session = ctx.session;
    const ipAddress = ctx.req.headers['x-forwarded-for'] || ctx.req.socket.remoteAddress;
    const sessionId = ctx.req.headers['x-session-id'] || crypto.randomUUID();

    if (session?.user?.id) {
      return await prisma.queryLimit.upsert({
        where: { userId: session.user.id },
        create: { userId: session.user.id },
        update: {}
      });
    }

    return await prisma.queryLimit.upsert({
      where: { sessionId },
      create: {
        sessionId,
        ipAddress: Array.isArray(ipAddress) ? ipAddress[0] : ipAddress
      },
      update: {}
    });
  },

  checkLimits(limitRecord: LimitRecord): void {
    const now = new Date();
    const lastQuery = new Date(limitRecord.lastQueryDate);
    const isNewDay = now.getDate() !== lastQuery.getDate();

    if (isNewDay && limitRecord.userId) {
      limitRecord.dailyCount = 0;
    }

    if (limitRecord.userId) {
      this.checkAuthenticatedLimits(limitRecord);
    } else {
      this.checkAnonymousLimits(limitRecord);
    }
  },

  checkAuthenticatedLimits(limitRecord: LimitRecord): void {
    if (limitRecord.monthlyCount >= 200) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'Monthly limit reached (200 queries). Upgrade your plan for more searches.'
      });
    }
    if (limitRecord.dailyCount >= 2) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'Daily limit reached (2 queries). Come back tomorrow!'
      });
    }
  },

  checkAnonymousLimits(limitRecord: LimitRecord): void {
    if (limitRecord.sessionCount >= 5) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'Session limit reached (5 queries). Create an account for more searches.'
      });
    }
    if (limitRecord.monthlyCount >= 30) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'Monthly IP limit reached (30 queries). Create an account for unlimited searches.'
      });
    }
  }
}; 