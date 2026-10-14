# @workspace/api-client

Sends requests to the API from shared route definitions and validates every
response with the route's schema, so callers get end-to-end types and never trust
network data by type annotation alone.

## Usage

```typescript
import { sendApiRequest } from "@workspace/api-client/requests/send-api-request.service";
import { healthReadyRoute } from "@workspace/schemas/server/routes/health/ready/health-ready.route";

const result = await sendApiRequest({
  baseUrl: "http://localhost:3001",
  route: healthReadyRoute,
  params: null,
  query: null,
  body: null,
  init: { cache: "no-store", signal: AbortSignal.timeout(5000) },
});
```

The route definition fixes the method, path, and response schema. `params`,
`query`, and `body` are always passed: values typed from the route's schemas, or
`null` when the route does not consume that input. Path parameters such as
`/users/:userId` are filled from `params` and URL-encoded; query arrays become
repeated keys. `init` supplies headers, caching, and abort signals.

## Results

Every outcome is a variant to handle explicitly:

| `kind` | Meaning |
|---|---|
| `success` | A success status whose body matched the route's response schema |
| `failure` | A documented error envelope (`response.error.code`, `response.requestId`) |
| `unexpected-response` | An error status without a valid envelope, such as a proxy's HTML 502 or an error code this client does not know |
| `unreachable` | The request failed before a response, such as a refused connection or an aborted request |

A success response that does not match its route's schema throws, because it
means the server broke its contract.

## Scripts

- **bun run check-types** - Type-check without emitting files
- **bun run test** - Run the Bun tests
- **bun run lint** - Lint with Biome
- **bun run format** - Format with Biome
