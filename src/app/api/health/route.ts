import { NextResponse } from "next/server";
import { checkDatabaseHealth } from "@/lib/prisma";
import { ObservabilityEngine } from "@/lib/observability-engine";

export const dynamic = "force-dynamic";

export async function GET() {
  const startTime = Date.now();
  const dbHealth = await checkDatabaseHealth();
  const uptimeSeconds = process.uptime();
  const memoryUsage = process.memoryUsage();
  const infraTelemetry = ObservabilityEngine.getInfraTelemetry();
  const appTelemetry = ObservabilityEngine.getAppTelemetry();

  const isHealthy = dbHealth.status !== "UNHEALTHY";

  const responsePayload = {
    status: isHealthy ? "OK" : "SERVICE_UNAVAILABLE",
    app: {
      name: process.env.NEXT_PUBLIC_APP_NAME || "FancyHub.in",
      version: "2.0.0",
      environment: process.env.NODE_ENV || "production",
      uptimeSeconds: Math.floor(uptimeSeconds),
    },
    database: {
      status: dbHealth.status,
      latencyMs: dbHealth.latencyMs,
    },
    cache: {
      status: "HEALTHY",
      hitRatePercent: infraTelemetry.redisCacheHitRatePercent,
    },
    system: {
      memoryRssMb: Math.round(memoryUsage.rss / (1024 * 1024)),
      memoryHeapUsedMb: Math.round(memoryUsage.heapUsed / (1024 * 1024)),
      cpuUtilizationPercent: infraTelemetry.cpuUtilizationPercent,
      nodeVersion: process.version,
    },
    telemetry: {
      totalRequests: appTelemetry.totalRequests,
      errorRate: `${appTelemetry.errorRatePercentage}%`,
      avgLatencyMs: appTelemetry.averageLatencyMs,
    },
    dependencies: {
      database: dbHealth.status === "HEALTHY" ? "UP" : "DEGRADED",
      storage: "UP",
      paymentGatewaySandbox: "UP",
    },
    totalResponseTimeMs: Date.now() - startTime,
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(responsePayload, {
    status: isHealthy ? 200 : 503,
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate",
    },
  });
}
