# FancyHub.in 2.0 — Safe Database Migrations & Deployment

## 1. Migration Safety Protocol
1. **Automated Backup**: Backup database and export current snapshots before applying schema changes.
2. **Forward-Compatible Schema**: Use Prisma migrations with default values for new columns.
3. **Zero Data Loss**: Existing product, category, user, order, and vendor records are strictly preserved.
4. **Data Integrity Checks**: Verify row counts and foreign key constraints post-migration.

## 2. Production Deployment Sequence
```bash
# 1. Generate Prisma client
npx prisma generate

# 2. Run database migration
npx prisma migrate deploy

# 3. Seed baseline taxonomies & system configurations
npx tsx prisma/seed.ts

# 4. Execute full platform test suite (47 suites)
npm test

# 5. Compile Next.js production build (186 routes)
npm run build
```
