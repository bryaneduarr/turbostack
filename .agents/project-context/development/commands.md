# Development commands

Evidence: 2026-10-14; base `56951b6` plus uncommitted changes; check steps, `start`, Compose, and toolchain update (temporary worktree) run locally.

- Toolchain: Bun (`packageManager`), Node `>=22.9`, Docker. `update:toolchain` pins Bun/Turbo in manifests, Dockerfiles, and lockfile.
- Root: `setup`, `dev`, `start`, `start:docker`, `check`, `test` (`bun:test`), `rename-scope`.
- Server `test` depends on `drizzle:migrate`, which starts PostgreSQL through `db:up`.
- CI runs `drizzle:check` plus a clean `drizzle:generate`; release builds every Dockerfile app after CI.
- Sources: [turbo](../../../turbo.json), [CI](../../../.github/workflows/ci.yml).
