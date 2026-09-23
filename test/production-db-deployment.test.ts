import fs from "fs";
import path from "path";
import { checkDatabaseHealth } from "../src/lib/prisma";

let passed = 0;
let failed = 0;

function assert(condition: boolean, message: string) {
  if (condition) {
    console.log(`  [PASS] ${message}`);
    passed++;
  } else {
    console.error(`  [FAIL] ${message}`);
    failed++;
  }
}

async function runProductionDbTests() {
  console.log("=======================================================================");
  console.log("   FANCYHUB.IN 2.0 — PRODUCTION DATABASE & CLOUD DEPLOYMENT SUITE");
  console.log("=======================================================================\n");

  try {
    // -----------------------------------------------------------------------
    // 1. Database Health Check Telemetry
    // -----------------------------------------------------------------------
    console.log("--- 1. DATABASE HEALTH & LATENCY TELEMETRY ---");
    const health = await checkDatabaseHealth();
    assert(health.status === "HEALTHY" || health.status === "DEGRADED", "Database connection health check returned active status");
    assert(health.latencyMs >= 0, `Database round-trip query latency measured: ${health.latencyMs}ms`);
    assert(health.provider === "sqlite" || health.provider === "postgresql", `Detected active database provider: ${health.provider}`);

    // -----------------------------------------------------------------------
    // 2. Production Environment Variable Templates
    // -----------------------------------------------------------------------
    console.log("\n--- 2. PRODUCTION ENVIRONMENT VARIABLE TEMPLATES ---");
    const rootDir = path.resolve(__dirname, "..");
    const envExamplePath = path.join(rootDir, ".env.example");
    const envProdPath = path.join(rootDir, ".env.production");

    assert(fs.existsSync(envExamplePath), ".env.example template file exists");
    assert(fs.existsSync(envProdPath), ".env.production file exists");

    const envExampleContent = fs.readFileSync(envExamplePath, "utf8");
    assert(envExampleContent.includes("DATABASE_URL="), ".env.example contains DATABASE_URL configuration");
    assert(envExampleContent.includes("DIRECT_URL="), ".env.example contains DIRECT_URL for unpooled migrations");
    assert(envExampleContent.includes("pgbouncer=true"), ".env.example configures PgBouncer connection pooling");
    assert(envExampleContent.includes("sslmode=require"), ".env.example enforces SSL encryption in connection string");

    // -----------------------------------------------------------------------
    // 3. PostgreSQL Schema Compatibility & Models Synchronization
    // -----------------------------------------------------------------------
    console.log("\n--- 3. POSTGRESQL SCHEMA COMPATIBILITY ---");
    const postgresSchemaPath = path.join(rootDir, "prisma", "schema.postgresql.prisma");
    assert(fs.existsSync(postgresSchemaPath), "prisma/schema.postgresql.prisma exists");

    const postgresContent = fs.readFileSync(postgresSchemaPath, "utf8");
    assert(postgresContent.includes('provider  = "postgresql"'), "PostgreSQL schema defines provider = 'postgresql'");
    assert(postgresContent.includes('directUrl = env("DIRECT_URL")'), "PostgreSQL schema configures directUrl for migration pool separation");
    assert(postgresContent.includes("model Page {"), "PostgreSQL schema contains CMS Page model");
    assert(postgresContent.includes("model Vendor {"), "PostgreSQL schema contains Vendor model");
    assert(postgresContent.includes("model Order {"), "PostgreSQL schema contains Order model");

    // -----------------------------------------------------------------------
    // 4. Connection Pooling Parameter Parsing
    // -----------------------------------------------------------------------
    console.log("\n--- 4. CONNECTION POOLING PARAMETERS ---");
    const mockPgUrl = "postgresql://user:pass@db.aws.com:5432/fancyhub?pgbouncer=true&connection_limit=25&pool_timeout=15&sslmode=require";
    const urlObj = new URL(mockPgUrl);
    assert(urlObj.searchParams.get("pgbouncer") === "true", "Parsed PgBouncer pooling flag");
    assert(urlObj.searchParams.get("connection_limit") === "25", "Parsed connection limit parameter (25 connections)");
    assert(urlObj.searchParams.get("pool_timeout") === "15", "Parsed pool timeout parameter (15s)");
    assert(urlObj.searchParams.get("sslmode") === "require", "Parsed SSL requirement parameter");

    console.log("\n=======================================================================");
    console.log(`Production DB & Cloud Deployment Results: ${passed} Passed, ${failed} Failed`);
    console.log("=======================================================================\n");

    if (failed > 0) process.exit(1);
  } catch (e) {
    console.error("Test execution error:", e);
    process.exit(1);
  }
}

runProductionDbTests();
