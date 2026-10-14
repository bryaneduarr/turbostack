# Development commands

Evidence: 2026-10-14; base `dd078d8` plus uncommitted changes; check steps, `start`, Compose, and toolchain update (temporary worktree) run locally.

- Toolchain: Bun (`packageManager`), Node `>=22.9`, Docker. `update:toolchain` pins Bun/Turbo in manifests, Dockerfiles, and lockfile.
- Root: `setup`, `dev`, `start`, `start:docker`, `check`, `test` (`bun:test`), `rename-scope`.
- Server `drizzle:check` plus a clean `drizzle:generate` run in CI.
- Release builds every Dockerfile app after CI passes on `main`.
- Sources: [root manifest](../../../package.json), [CI](../../../.github/workflows/ci.yml), [release](../../../.github/workflows/release-images.yml).
