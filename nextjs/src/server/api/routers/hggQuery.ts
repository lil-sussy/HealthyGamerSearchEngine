import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { prisma } from "../../db";
import results from "../../../test/results.json";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { RateLimitService } from "../../services/rateLimitService";

export const hggQuery = createTRPCRouter({
  query: publicProcedure
    .input(z.object({ query: z.string() }))
    .mutation(async ({ ctx }) => {
      try {
        const limitRecord = await RateLimitService.getOrCreateLimitRecord({
          req: ctx.req,
          session: ctx.session,
        });

        RateLimitService.checkLimits(limitRecord);

        await RateLimitService.incrementQueryCount(limitRecord);

        return results;
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        console.error("Query error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to process query",
        });
      }
    }),
});
