# @workspace/api-client

Sends JSON requests to the API and validates every response with the shared
schemas from `@workspace/schemas`, so consumers never trust network data by type
annotation alone.

## Usage

```typescript
import { sendApiRequest } from "@workspace/api-client/requests/send-api-request.service";
import { healthReadyResponseSchema } from "@workspace/schemas/server/routes/health/ready/health-ready-response.schema";

const result = await sendApiRequest({
  baseUrl: "http://localhost:3001",
  path: "/health/ready",
  init: { method: "GET" },
  schema: healthReadyResponseSchema,
});

if (result.kind === "success") {
  console.info(result.response.data.database);
} else {
  console.warn(result.response.error.code, result.response.message);
}
```

A success status is parsed with the route's schema; a failure status is parsed
with the shared error schema. Responses that match neither, including bodyless
responses, throw instead of returning unvalidated data.

## Scripts

- **bun run check-types** - Type-check without emitting files
- **bun run lint** - Lint with Biome
- **bun run format** - Format with Biome
