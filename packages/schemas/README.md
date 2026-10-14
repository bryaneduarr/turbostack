# @workspace/schemas

Shared [Zod](https://zod.dev/) schemas and schema-derived contracts for the server
and client. Schemas import `z` directly from `zod`; no framework-specific wrapper
is needed.

## Directory Structure

```text
src/
├── client/
│   └── environment/      # Web client runtime settings
├── database/
│   └── environment/      # PostgreSQL environment settings
└── server/
    ├── environment/      # Server environment composition
    ├── responses/        # Envelope, success, and error responsibilities
    └── routes/
        ├── definition/   # RouteDefinition contract shared by server and clients
        ├── versioning/   # API version path prefix
        └── health/       # Liveness and readiness routes and responses
```

Directory placement communicates intended use; it is not a security boundary.
Import runtime schemas and type-only interfaces directly from their owning
modules. Use extensionless `@workspace/schemas/...` imports within this package and
from other workspaces, never relative source imports or `.js`/`.ts` extensions.
The package's wildcard exports and self-alias support these nested module paths.
Do not create barrel files.

## Database and Server Environment

[`database-env.schema.ts`](./src/database/environment/database-env.schema.ts)
owns PostgreSQL settings, TLS policy, pool limits, and cleanup timeouts.
[`database-env.interface.ts`](./src/database/environment/database-env.interface.ts)
exports the schema-derived `ValidatedDatabaseEnvironment` contract. Database
configuration can validate these settings without requiring HTTP or logging
variables.

[`server-env.schema.ts`](./src/server/environment/server-env.schema.ts) composes
the database schema with server settings.
[`server-env.interface.ts`](./src/server/environment/server-env.interface.ts)
contains its `ValidatedServerEnvironment` interface. An omitted raw `LOG_LEVEL` becomes a
required output level: debug in development, silent in test, and info in
production. An omitted `OPENAPI_ENABLED` becomes `false` in production and `true`
otherwise. Explicit null
or an invalid level is rejected. Startup configuration uses `parse` to fail fast.

## Server Response Contracts

All JSON API envelopes use `{ success, message, data, error, status, requestId }`.
Compose each route's concrete payload with `createSuccessResponseSchema` rather
than duplicating envelope fields. The liveness probe defines its payload like this:

```typescript
import { createSuccessResponseSchema } from "@workspace/schemas/server/responses/success/create-success-response.schema";
import { z } from "zod";

export const healthLiveResponseSchema = createSuccessResponseSchema(
  z.object({
    /* Confirms the process is running and able to serve HTTP requests. */
    status: z.literal("alive"),
  }),
);
```

Its runtime schema and schema-derived interface live in
[`server/routes/health/live/`](./src/server/routes/health/live/).
Failure contracts live in
[`server/responses/errors/`](./src/server/responses/errors/). Broad success and
envelope schemas are composition or documentation bases, not concrete endpoint
payload validators.

Response envelopes retain intentional protocol nulls: no error on success, no
success data on failure. Routes must define concrete payload schemas and
document legitimate absence. Do not
substitute arbitrary empty objects for these protocol states.
See [API response conventions](../../apps/server/README.md#required-values-and-explicit-absence).

## Route Definitions

Each endpoint has one `<operation>.route.ts` next to its schemas. It declares every
`RouteDefinition` member, using `null` for inputs the route does not consume:

```typescript
import { API_V1_PREFIX } from "@workspace/schemas/server/routes/versioning/api-version-prefix.constant";

export const getUserProfileRoute = {
  method: "GET",
  path: `${API_V1_PREFIX}/users/:userId/profile`,
  params: getUserProfileParamsSchema,
  query: null,
  body: null,
  response: getUserProfileResponseSchema,
} as const satisfies RouteDefinition;
```

The server registers it with `.route(route.method, route.path, handler, contract)`
and clients call it with `sendApiRequest` from `@workspace/api-client`, so both
sides share one typed contract. See the
[server README](../../apps/server/README.md#adding-a-route) for the server side.

## Elysia OpenAPI Integration

The server uses Elysia 1.4.30 and `@elysia/openapi` 1.4.16. Its `jsonContent`
configuration function converts Zod schemas to JSON Schema for response
documentation, and the OpenAPI plugin maps Zod input schemas automatically. Route
metadata belongs in the contract's `detail` object, which the server checks with
`satisfies RouteContract<typeof route>`:

```typescript
import { healthLiveRoute } from "@workspace/schemas/server/routes/health/live/health-live.route";
import { OK } from "@workspace/utils/http/status-codes/http-status-code.constant";
import { jsonContent } from "@/config/openapi/responses/content/json-response-content.config";
import type { RouteContract } from "@/types/http/routes/route-contract.interface";

export const healthLiveContract = {
  detail: {
    tags: ["Health"],
    summary: "Liveness probe",
    responses: {
      [OK]: jsonContent(healthLiveRoute.response, "The process is alive."),
    },
  },
} satisfies RouteContract<typeof healthLiveRoute>;
```

The `@/` imports belong in server code, not in this package. Documentation
metadata does not perform runtime validation or set HTTP status. Server handlers
use the same concrete schema through `createSuccessResponse` to validate output
and set matching HTTP metadata. `createRouter()` supplies common error
documentation automatically.

The server serves Scalar at `/api/v1/reference` and OpenAPI 3.0.0 at `/api/v1/doc`.
See the [server README](../../apps/server/README.md) for configuration and
compatibility details.

## HTTP Status Constants

The canonical catalog belongs to
[`@workspace/utils`](../utils/README.md), in
`src/http/status-codes/http-status-code.constant.ts`. Import statuses directly
through `@workspace/utils/http/status-codes/http-status-code.constant`; never copy
numbers or import server source into schemas.

Use named constants for response statuses, comparisons, validation bounds, and
computed OpenAPI response keys. Executable descriptions interpolate constants
rather than repeating their numbers. `MAX_HTTP_STATUS` supplies the upper
validation bound, including unassigned server-error statuses.

## Creating Schemas and Interfaces

Choose the deepest meaningful domain or operation owner and name files
`<specific-responsibility>.schema.ts` and `<specific-responsibility>.interface.ts`.
Keep runtime schemas and their contracts separate. Document every schema field,
every interface, and every explicitly declared interface member with brief
`/* ... */` comments.

For example, an illustrative `users/profile/user-profile.schema.ts` could define:

```typescript
import { z } from "zod";

export const userProfileSchema = z.object({
  /* Identifies the profile using a validated UUID. */
  id: z.uuid(),
  /* Contains the profile's validated lowercase contact email. */
  email: z.email().toLowerCase(),
  /* Contains the nonempty given name, limited to 100 characters. */
  firstName: z.string().min(1).max(100),
  /* Contains the nonempty family name, limited to 100 characters. */
  lastName: z.string().min(1).max(100),
});
```

Its dedicated `users/profile/user-profile.interface.ts` would derive the output:

```typescript
import type { userProfileSchema } from "@workspace/schemas/users/profile/user-profile.schema";
import type { z } from "zod";

/* Represents the validated profile data exposed by the illustrative contract. */
export interface ValidatedUserProfile extends z.output<typeof userProfileSchema> {}
```

This example does not describe an existing user API or the database table's
nullable name columns. When transformations change input shape, distinguish raw
`z.input<typeof schema>` contracts from validated `z.output<typeof schema>`
contracts in the same responsibility-specific interface file. Use type aliases
for shapes interfaces cannot faithfully represent.

Validated domain values are required by default. Normalize genuinely optional
boundary values in their owning schemas, and use parsed results afterward. Keep
server-only operations on the server; type-only imports must not add server
runtime dependencies to clients. Validate received API responses on the client
as well as requests and generated responses on the server.
