# Development commands

Evidence: 2026-10-14; base `ef7f1e0` plus uncommitted changes; `bun run check`, `dev`, and `start` run locally.

- Toolchain: Bun `1.4.0` (`packageManager`), Node `>=20` for Next.js, Docker for PostgreSQL/images.
- Root: `setup`, `dev` (starts PostgreSQL first), `start` (build, PostgreSQL, production servers), `start:docker`, `check` (Biome, boundaries, types, Vitest, builds), `rename-scope`.
- Apps: `api-server` (`apps/server`), `web-client` (`apps/client`).
- CI uses `turbo --affected`; images publish for affected apps with a Dockerfile.
- Sources: [root manifest](../../../package.json), [turbo](../../../turbo.json), [CI](../../../.github/workflows/ci.yml).
