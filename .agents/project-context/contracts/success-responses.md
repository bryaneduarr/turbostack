# Success responses

Evidence: 2026-10-14; base `dd078d8` plus uncommitted changes; source-inspected; Bun tests cover liveness.

- [createSuccessResponse](../../../apps/server/src/services/responses/success/create-success-response.service.ts) parses the route schema and JSON-compatible data before serialization; exposes the request identifier in `x-request-id`.
- [createSuccessResponseSchema](../../../packages/schemas/src/server/responses/success/create-success-response.schema.ts) composes concrete required payloads, explicit success, and absent error.
- Handlers pass their route definition's `response` schema; contracts document the same schema.
- Clients validate responses in [api-client](../../../packages/api-client/src/requests/send-api-request.service.ts).
