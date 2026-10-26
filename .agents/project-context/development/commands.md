# Development commands

Evidence: 2026-10-26; `9800020` plus uncommitted step 3; `check`, `verify`, `doctor:stack`, `dev:start`, and `scripts/dc-smoke-test` run locally. `start:docker` not rerun since 2026-10-14.

- Toolchain: Git, Bun (`packageManager`), Docker. `update:toolchain` pins Bun/Turbo.
- First run: `bun run dev` (setup, doctor, database, seed, apps). Agents use `dev:start`/`dev:status`/`dev:stop`.
- Checks: `check` (Biome, boundaries, `check:rules`, `check:compose`, types, tests, build); `verify` adds frozen lockfile, migration drift, and e2e (api, chromium).
- E2E: `test:e2e` (all browsers), `test:e2e:changed`.
- Database: `db:up`, `db:provision`, `drizzle:*`, `seed:dev`. CI files still exist until step 5.
