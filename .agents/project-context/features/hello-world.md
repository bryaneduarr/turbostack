# Hello-world API

Evidence: 2026-10-13; `0ebf76b`; source-inspected, no application changes; runtime unverified.

- Implemented: `GET /api/v1/hello-world`; no request body.
- Returns `Hello World!` with deliberately null data in the success envelope; this is not a domain payload.
- Trace: [prefix](../../../apps/server/src/config/http/routing/api-prefix.constant.ts) → [mount](../../../apps/server/src/application.module.ts) → [router](../../../apps/server/src/routes/hello-world/hello-world.router.ts) → [handler](../../../apps/server/src/routes/hello-world/hello-world.handler.ts) → [schema](../../../packages/schemas/src/server/routes/hello-world/hello-world-response.schema.ts).
