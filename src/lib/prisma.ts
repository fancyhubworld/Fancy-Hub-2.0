import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Database Connection Pooling & Logging Configuration
const createPrismaClient = () => {
  const isProduction = process.env.NODE_ENV === "production";

  return new PrismaClient({
    log: isProduction
      ? [{ emit: "stdout", level: "error" }, { emit: "stdout", level: "warn" }]
      : [{ emit: "event", level: "query" }, { emit: "stdout", level: "error" }, { emit: "stdout", level: "warn" }],
  });
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export interface DatabaseHealthStatus {
  status: "HEALTHY" | "UNHEALTHY" | "DEGRADED";
  provider: "postgresql" | "sqlite" | "unknown";
  latencyMs: number;
  isConnectionPooled: boolean;
  sslEnabled: boolean;
  timestamp: string;
  error?: string;
}

/**
 * Health check telemetry utility to verify database connectivity,
 * connection pooling, and query latency.
 */
export async function checkDatabaseHealth(): Promise<DatabaseHealthStatus> {
  const startTime = Date.now();
  const dbUrl = process.env.DATABASE_URL || "";
  const isPostgres = dbUrl.startsWith("postgresql://") || dbUrl.startsWith("postgres://");
  const isPooled = dbUrl.includes("pgbouncer=true") || dbUrl.includes("connection_limit=");
  const sslEnabled = dbUrl.includes("sslmode=require") || dbUrl.includes("ssl=true");

  try {
    // Execute a lightweight query to test round-trip latency
    await prisma.$queryRaw`SELECT 1`;
    const latencyMs = Date.now() - startTime;

    return {
      status: latencyMs < 500 ? "HEALTHY" : "DEGRADED",
      provider: isPostgres ? "postgresql" : "sqlite",
      latencyMs,
      isConnectionPooled: isPooled,
      sslEnabled,
      timestamp: new Date().toISOString(),
    };
  } catch (error: any) {
    return {
      status: "UNHEALTHY",
      provider: isPostgres ? "postgresql" : "sqlite",
      latencyMs: Date.now() - startTime,
      isConnectionPooled: isPooled,
      sslEnabled,
      timestamp: new Date().toISOString(),
      error: error?.message || "Database connection failed",
    };
  }
}

export default prisma;
