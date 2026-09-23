# FancyHub Agent Guide

## Project Shape

- FancyHub is a Next.js 14 App Router marketplace using React 18, TypeScript, Tailwind CSS, Prisma, and `tsx` scripts.
- Customer storefront routes live in `src/app`; admin routes are under `src/app/admin`; vendor routes are under `src/app/vendor`; API handlers are under `src/app/api`.
- Shared application composition is in `src/app/layout.tsx`. Inspect it before changing providers, navigation, modals, widgets, or PWA behavior.
- Use `src/lib/routes.ts` for route construction. Do not add hardcoded internal URLs when the route registry can express the link.
- CMS rendering is centered on `src/lib/page-builder.ts`, `src/components/builder/SectionRenderer.tsx`, and `src/components/widgets/WidgetDispatcher.tsx`.

## Working Conventions

- Start from the nearest existing page, API handler, shared library, component, test, and documentation before creating a new pattern.
- Keep server-side Prisma access in server code and API handlers. Treat client context state and mock catalog fallbacks as demo or resilience behavior, not proof that a feature is persisted.
- Preserve existing provider boundaries and loading/error fallbacks. Check both the actual `src/app` tree and `src/lib/routes.ts` because route documentation can lag implementation.
- For schema changes, inspect both `prisma/schema.prisma` and `prisma/schema.postgresql.prisma`; the checked-in default is SQLite even though production documentation often discusses PostgreSQL.
- Do not treat development authentication fallbacks, in-memory OTP/reset stores, or default secrets as production-safe configuration. Follow [docs/SECRETS.md](docs/SECRETS.md) and [docs/AUTHENTICATION.md](docs/AUTHENTICATION.md).

## Commands

```bash
npm install
npm run db:push
npm run db:seed
npm run dev
npm run lint
npm test
npm run build
```

- `npm run lint` runs `tsc --noEmit`; the TypeScript config excludes `test` and `scripts`.
- `npm test` runs `test/run-tests.ts`, not every file in `test/`. Run the closest relevant phase or feature script explicitly when changing broader behavior.
- Database setup uses the active Prisma schema. Use `npm run db:switch:postgres` or `npm run db:switch:sqlite` only after reviewing the provider-switching script and local data implications.
- Required environment variables and integration secrets are documented in [docs/SECRETS.md](docs/SECRETS.md).

## Verification And Documentation

- For feature work, verify the nearest focused test first, then run `npm run lint`; run `npm run build` for changes that affect routing, server rendering, Prisma generation, or production configuration.
- Tests may mutate a shared database and are not uniformly isolated. Do not assume the full `test/` directory is a unit-test suite.
- Update or link the relevant documentation instead of duplicating it: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md), [docs/ROUTING.md](docs/ROUTING.md), [docs/DATABASE.md](docs/DATABASE.md), [docs/API.md](docs/API.md), [docs/ADMIN.md](docs/ADMIN.md), [docs/THEMES.md](docs/THEMES.md), and [docs/WIDGETS.md](docs/WIDGETS.md).