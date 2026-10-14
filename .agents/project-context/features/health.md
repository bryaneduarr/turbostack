# Health probes and expected failures

Evidence: 2026-10-14; base `018c6c1` plus uncommitted changes; Vitest and container probes passed locally.

- `GET /health/live` (no dependencies) and `GET /health/ready` (`SELECT 1`, else `SERVICE_UNAVAILABLE`): [router](../../../apps/server/src/routes/health/health.router.ts), [schemas](../../../packages/schemas/src/server/routes/health/).
- Handlers throw [ExpectedFailure](../../../apps/server/src/services/responses/errors/expected-failure.error.ts); codes map to statuses in its config; [onError](../../../apps/server/src/middleware/errors/on-error.handler.ts) returns its client-safe message.
