# Route definitions

Evidence: 2026-10-14; base `56951b6` plus uncommitted changes; type misuse checked with scratch files; client-to-server calls run locally and in Docker.

- [RouteDefinition](../../../packages/schemas/src/server/routes/definition/route-definition.interface.ts) requires every input; `null` means unused.
- Server contracts satisfy [RouteContract](../../../apps/server/src/types/http/routes/route-contract.interface.ts); routers use `.route(method, path, ...)`.
- [sendApiRequest](../../../packages/api-client/src/requests/send-api-request.service.ts) returns four result kinds.
- Client server code calls [requestApi](../../../apps/client/src/services/api/requests/request-api.service.ts).
