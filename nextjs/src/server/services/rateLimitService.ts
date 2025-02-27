import { TRPCError } from '@trpc/server';
import { prisma } from '../db';
import type { Session } from 'next-auth';
import { env } from '@/env';

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
    const ipAddress = ctx.req.headers['x-forwarded-for'] ?? ctx.req.socket.remoteAddress;
    const sessionId = ctx.req.headers['x-session-id'] ?? crypto.randomUUID();

    if (session?.user?.id) {
      return await prisma.queryLimit.upsert({
        where: { userId: session.user.id },
        create: { userId: session.user.id },
        update: {
          sessionId: sessionId as string,
          userId: session.user.id,
          ipAddress: Array.isArray(ipAddress) ? ipAddress[0] : ipAddress
        }
      });
    }

    return await prisma.queryLimit.upsert({
      where: { sessionId: sessionId as string },
      create: {
        sessionId: sessionId as string,
        userId: null,
        ipAddress: Array.isArray(ipAddress) ? ipAddress[0] : ipAddress
      },
      update: {
        ipAddress: Array.isArray(ipAddress) ? ipAddress[0] : ipAddress
      }
    });
  },

  async incrementQueryCount(limitRecord: LimitRecord): Promise<void> {
    await prisma.queryLimit.update({
      where: { id: limitRecord.id },
      data: {
        monthlyCount: { increment: 1 },
        dailyCount: limitRecord.userId ? { increment: 1 } : undefined,
        sessionCount: limitRecord.sessionId ? { increment: 1 } : undefined,
        lastQueryDate: new Date(),
      },
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
    if (limitRecord.monthlyCount >= parseInt(env.MONTHLY_QUERY_LIMIT)) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: `Monthly limit reached (${env.MONTHLY_QUERY_LIMIT} queries). Upgrade your plan for more searches.`
      });
    }
    if (limitRecord.dailyCount >= parseInt(env.DAILY_QUERY_LIMIT)) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: `Daily limit reached (${env.DAILY_QUERY_LIMIT} queries). Come back tomorrow!`
      });
    }
  },

  checkAnonymousLimits(limitRecord: LimitRecord): void {
    if (limitRecord.sessionCount >= parseInt(env.IP_QUERY_LIMIT)) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: `Session limit reached (${env.IP_QUERY_LIMIT} queries). Create an account for more searches.`
      });
    }
    if (limitRecord.monthlyCount >= parseInt(env.IP_TOTAL_QUERY_LIMIT)) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: `Monthly IP limit reached (${env.IP_TOTAL_QUERY_LIMIT} queries). Create an account for unlimited searches.`
      });
    }
  }
}; 