# Success responses

Evidence: 2026-10-13; `0ebf76b`; source-inspected, no application changes; runtime unverified.

- [createSuccessResponse](../../../apps/server/src/services/responses/success/create-success-response.service.ts) parses the route schema and JSON-compatible data before serialization; exposes the request identifier in `x-request-id`.
- [createSuccessResponseSchema](../../../packages/schemas/src/server/responses/success/create-success-response.schema.ts) composes concrete required payloads, explicit success, and absent error.
- The greeting's [contract](../../../apps/server/src/routes/hello-world/hello-world.contract.ts) documents the same schema used by its handler.
- Client response-validation coverage was not audited.
