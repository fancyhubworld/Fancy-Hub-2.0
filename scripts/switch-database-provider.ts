import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const targetProvider = process.argv[2]?.toLowerCase() || "sqlite";

const rootDir = path.resolve(__dirname, "..");
const schemaPath = path.join(rootDir, "prisma", "schema.prisma");
const sqliteSchemaPath = path.join(rootDir, "prisma", "schema.sqlite.prisma");
const postgresSchemaPath = path.join(rootDir, "prisma", "schema.postgresql.prisma");

console.log(`=======================================================================`);
console.log(`   FANCYHUB.IN — DATABASE PROVIDER SWITCHER`);
console.log(`   Switching to: ${targetProvider.toUpperCase()}`);
console.log(`=======================================================================\n`);

if (targetProvider === "postgres" || targetProvider === "postgresql") {
  if (!fs.existsSync(postgresSchemaPath)) {
    console.error("Error: PostgreSQL schema template not found at prisma/schema.postgresql.prisma");
    process.exit(1);
  }

  // Backup current schema as sqlite if not already backed up
  if (!fs.existsSync(sqliteSchemaPath)) {
    fs.copyFileSync(schemaPath, sqliteSchemaPath);
  }

  fs.copyFileSync(postgresSchemaPath, schemaPath);
  console.log("✔ Copied PostgreSQL schema definition to prisma/schema.prisma");
  console.log("✔ Configured provider: 'postgresql' with directUrl support for connection pooling");
} else {
  // Switch to SQLite
  let content = fs.readFileSync(schemaPath, "utf8");
  content = content.replace(
    /datasource db \{[\s\S]*?\}/,
    `datasource db {\n  provider = "sqlite"\n  url      = env("DATABASE_URL")\n}`
  );
  fs.writeFileSync(schemaPath, content);
  console.log("✔ Configured provider: 'sqlite' for local offline testing (dev.db)");
}

console.log("\nRunning prisma generate to update Prisma Client types...");
try {
  execSync("npx prisma generate", { stdio: "inherit", cwd: rootDir });
  console.log(`\n🎉 Successfully switched database provider to: ${targetProvider.toUpperCase()}`);
} catch (e: any) {
  console.error("Failed to generate prisma client:", e.message);
  process.exit(1);
}
