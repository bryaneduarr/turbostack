# Runtime and ownership

Evidence: 2026-10-14; base `018c6c1` plus uncommitted changes; source-inspected; container runtime checked locally.

- UI: Next/React [client](../../../apps/client/package.json).
- API: Bun/Elysia [server](../../../apps/server/package.json), bundled by `bun build` into `dist/` (no tsc emit). [Bootstrap](../../../apps/server/src/index.ts) connects the database, then listens with the body limit.
- [Composition](../../../apps/server/src/application.module.ts) mounts optional OpenAPI, root-level health probes, and `/api/v1` routers.
- Contracts live in [schemas](../../../packages/schemas/src/server/); statuses in the [catalog](../../../packages/utils/src/http/status-codes/http-status-code.constant.ts).
