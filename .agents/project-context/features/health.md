# Health probes and expected failures

Evidence: 2026-10-14; base `dd078d8` plus uncommitted changes; Bun tests, local runs, and Docker Compose probes passed.

- `GET /health/live` (no dependencies) and `GET /health/ready` (fails while draining, then `SELECT 1`, else `SERVICE_UNAVAILABLE`): [router](../../../apps/server/src/routes/health/health.router.ts), [routes](../../../packages/schemas/src/server/routes/health/).
- Shutdown starts [draining](../../../apps/server/src/services/server/lifecycle/server-draining-state.service.ts), waits `SHUTDOWN_DRAIN_DELAY_SECONDS`, then stops.
- Handlers throw [ExpectedFailure](../../../apps/server/src/services/responses/errors/expected-failure.error.ts); [onError](../../../apps/server/src/middleware/errors/on-error.handler.ts) returns its message.
