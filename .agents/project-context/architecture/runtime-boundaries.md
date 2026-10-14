# Runtime and ownership

Evidence: 2026-10-13; `0ebf76b`; source-inspected, no application changes; runtime unverified.

- UI: Next/React [client](../../../apps/client/package.json); routing starts at [page](../../../apps/client/src/app/page.tsx).
- API: Bun/Elysia [server](../../../apps/server/package.json). [Bootstrap](../../../apps/server/src/index.ts) connects the database before listening.
- [Composition](../../../apps/server/src/application.module.ts) mounts OpenAPI and the versioned greeting router.
- Greeting contracts live in the [schema package](../../../packages/schemas/src/server/routes/hello-world/hello-world-response.schema.ts); canonical statuses in the [catalog](../../../packages/utils/src/http/status-codes/http-status-code.constant.ts).
