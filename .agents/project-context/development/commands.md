# Development commands

Evidence: 2026-10-14; base `018c6c1` plus uncommitted production-foundation changes; `bun run check` passed locally.

- Toolchain: Bun `1.4.0` (`packageManager`), Node `>=20` for Next.js, Docker for PostgreSQL/images.
- Root: `bun run setup`, `dev`, `check` (Biome CI, types, Vitest, builds), `test`, `db:up`.
- Server: `bun run --cwd apps/server check-types|test|build|start|start:migrate`.
- CI uses `turbo --affected`; images publish only for affected apps with a Dockerfile.
- Sources: [root manifest](../../../package.json), [server scripts](../../../apps/server/package.json), [CI](../../../.github/workflows/ci.yml).
