# Runtime and ownership

Evidence: 2026-10-14; base `ef7f1e0` plus uncommitted changes; source-inspected; boundaries and builds checked.

- `web-client`: Next/React [client](../../../apps/client/package.json). `api-server`: Bun/Elysia [server](../../../apps/server/package.json), bundled by `bun build`.
- [Composition](../../../apps/server/src/application.module.ts) mounts optional OpenAPI and health probes; versioned routers use `API_VX_PREFIX`.
- [Boundary tags](../../../turbo.json) restrict app, runtime-neutral, server, and config dependencies.
- TypeScript presets live in [config/typescript](../../../config/typescript/package.json); [api-client](../../../packages/api-client/src/requests/send-api-request.service.ts) validates responses.
