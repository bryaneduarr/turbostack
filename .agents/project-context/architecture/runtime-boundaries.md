# Runtime and ownership

Evidence: 2026-10-14; base `dd078d8` plus uncommitted changes; source-inspected; boundaries, builds, and Docker images checked.

- `web-client`: Next standalone [client](../../../apps/client/package.json) on Node; reads `SERVER_URL` at runtime. `api-server`: Bun/Elysia [server](../../../apps/server/package.json), bundled by `bun build`.
- [Composition](../../../apps/server/src/application.module.ts) mounts optional OpenAPI and health probes; versioned paths use `API_V1_PREFIX` from schemas.
- [Boundary tags](../../../turbo.json) restrict app, runtime-neutral, server, and config dependencies.
- `@workspace/ui` depends only on React.
