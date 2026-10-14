# Success responses

Evidence: 2026-10-14; base `ef7f1e0` plus uncommitted changes; source-inspected; Vitest covers liveness.

- [createSuccessResponse](../../../apps/server/src/services/responses/success/create-success-response.service.ts) parses the route schema and JSON-compatible data before serialization; exposes the request identifier in `x-request-id`.
- [createSuccessResponseSchema](../../../packages/schemas/src/server/responses/success/create-success-response.schema.ts) composes concrete required payloads, explicit success, and absent error.
- The liveness [contract](../../../apps/server/src/routes/health/live/health-live.contract.ts) documents the same schema used by its handler.
- Client response-validation coverage was not audited.
