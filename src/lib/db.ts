import { Pool } from "pg";

/**
 * Shared Postgres pool. Works with any standard Postgres connection string:
 * Neon, Vercel Postgres, Prisma Postgres, Supabase, self-hosted, etc.
 *
 * Cached on `globalThis` so hot-reloads in dev and serverless invocations
 * reuse the same pool instead of opening a new one per request.
 */

declare global {
  var __pgPool: Pool | undefined;
}

export function getPool(): Pool | null {
  if (!process.env.POSTGRES_URL) return null;
  if (!globalThis.__pgPool) {
    globalThis.__pgPool = new Pool({
      connectionString: process.env.POSTGRES_URL,
      ssl: { rejectUnauthorized: false },
      max: 3,
    });
  }
  return globalThis.__pgPool;
}
