# Development commands

Evidence: 2026-10-26; `5952692` plus uncommitted step 2; `bun run check`, `dev:start`, and `dev:stop` run locally. Older items (`start`, Compose, toolchain update) last run 2026-10-14.

- Toolchain: Bun (`packageManager`), Node `>=22.9`, Docker. `update:toolchain` pins Bun/Turbo in manifests, Dockerfiles, and lockfile.
- Root: `setup`, `dev`, `dev:start`/`dev:status`/`dev:stop`, `start`, `start:docker`, `check` (Biome, boundaries, `check:rules`, types, tests, build), `test` (`bun:test`), `rename-scope`.
- Server `test` depends on `drizzle:migrate`, which starts PostgreSQL through `db:up`.
- CI runs `drizzle:check` plus a clean `drizzle:generate`; release builds every Dockerfile app after CI.
- Sources: [turbo](../../../turbo.json), [CI](../../../.github/workflows/ci.yml).
