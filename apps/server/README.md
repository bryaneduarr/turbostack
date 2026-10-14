# Elysia TypeScript Server

A type-safe **backend** built with [Elysia](https://elysiajs.com/), TypeScript, and [Bun](https://bun.sh/).

## Technology Stack

| Technology | Purpose |
|------------|---------|
| Elysia 1.4.30 | HTTP server and routing |
| @elysia/openapi 1.4.16 | OpenAPI generation and Scalar reference |
| @scalar/types ^0.23.2 | Compile-time Scalar configuration contract |
| Zod | Environment and reusable response schemas |
| Pino | Logging |
| Drizzle / Postgres | Database access |
| Vitest | Tests |

## Getting Started

Run these commands from `apps/server` after installing workspace dependencies at the repository root:

```sh
cp .env.example .env
bun run --cwd ../.. db:up
bun run drizzle:migrate
bun run dev
```

Development uses `bun --watch src/index.ts`. Bun loads `.env` automatically, and
Drizzle Kit loads it for its own commands, so no `dotenv` package is needed. The
default server URL is [http://localhost:3001](http://localhost:3001).

## Production

`bun run build` bundles the server and every runtime dependency into
`dist/index.js` with Bun, which also resolves the `@/` and `@workspace/` aliases.
`bun run start` runs that bundle. The build also emits
`dist/db/migrate/apply-migrations.script.js` and copies the committed migrations
next to it; `bun run start:migrate` applies them without Drizzle Kit. Run
migrations as a deliberate deployment step before starting new server versions.

The [Dockerfile](./Dockerfile) builds the same bundle from the repository root and
ships only `dist/` on Bun's slim image, running as the unprivileged `bun` user:

```sh
docker build -f apps/server/Dockerfile -t server .
docker run --rm --env-file apps/server/.env server bun db/migrate/apply-migrations.script.js
docker run --rm --env-file apps/server/.env -p 3001:3001 server
```

Set `NODE_ENV=production` and real database settings in the deployment
environment. In production, logs are JSON lines on stdout and the OpenAPI
reference is disabled unless `OPENAPI_ENABLED=true`.

## Health Checks

| Endpoint | Checks | Use |
|---|---|---|
| `GET /health/live` | The process serves HTTP | Liveness probe; restart the instance when it fails |
| `GET /health/ready` | PostgreSQL answers `SELECT 1` | Readiness probe; stop routing traffic while it returns `SERVICE_UNAVAILABLE` |

Probes stay outside `/api/v1` so infrastructure paths never change with API
versions. The Docker image's `HEALTHCHECK` uses the liveness endpoint.

## Expected Failures

Throw `ExpectedFailure` from handlers or services for anticipated failures. Its
code selects the HTTP status, and its message is returned to the client, so write
it for clients and never include private details:

```typescript
import { ExpectedFailure } from "@/services/responses/errors/expected-failure.error";

throw new ExpectedFailure({
  code: "CONFLICT",
  message: "A profile with this name already exists.",
});
```

Available codes are `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`, and
`SERVICE_UNAVAILABLE`, defined in
[`expected-failure-statuses.config.ts`](./src/services/responses/errors/expected-failure-statuses.config.ts).
To add one, add the code to the error schema in `@workspace/schemas`, its status
in that file, and a default message in
[`error-response-messages.config.ts`](./src/services/responses/errors/error-response-messages.config.ts).
Any other thrown error becomes a generic response; 5xx errors never expose their
message.

## Request Limits and Security Headers

- `MAX_REQUEST_BODY_BYTES` (default 1 MiB) is passed to Bun's server. Bun rejects
  larger bodies, including chunked uploads, with a bodyless `413` before routing.
- Every response sets `X-Content-Type-Options: nosniff`.
- HEAD requests are answered by Elysia from the matching GET route without a body.

## Available Scripts

- **bun run build**: Bundle the server and migration runner into `dist/`
- **bun run check-types**: Type-check without emitting files
- **bun run clean**: Remove dist, node_modules, and .turbo
- **bun run dev**: Watch and run the server with Bun
- **bun run format**: Format with Biome
- **bun run lint**: Lint with Biome
- **bun run start**: Run the bundled server
- **bun run start:migrate**: Apply committed migrations using the bundled runner
- **bun run test**: Run Vitest once
- **bun run test:watch**: Run Vitest in watch mode
- **bun run drizzle:generate**: Generate database migrations
- **bun run drizzle:migrate**: Apply database migrations with Drizzle Kit
- **bun run drizzle:push**: Push the database schema
- **bun run drizzle:studio**: Open Drizzle Studio

## Testing

Tests use [Vitest](https://vitest.dev/) and live next to the code they cover as
`<responsibility>.test.ts`. [`vitest.config.ts`](./vitest.config.ts) resolves the
`@/` aliases and supplies fictional environment values with `NODE_ENV=test`, so
tests need no `.env` and logs stay silent. Send requests with
`app.handle(new Request(...))`; no port is opened. Routes that query PostgreSQL
need a reachable database. Tests run under Node.js through Vitest, while the
server runs on Bun, so avoid Bun-only APIs in code under test or cover them
another way.

## Logging

The validated environment always provides `LOG_LEVEL`, defaulting to debug in
development and info in production. Request logs have required correlation and
timing fields; failure classification and captured exceptions use explicit states.
Only allowlisted error names/codes and local source locations are serialized.
Absent diagnostics are omitted from emitted logs, not assigned undefined.

## Environment and Database

Environment variables are validated with Zod in
[src/config/environment/server-env.config.ts](./src/config/environment/server-env.config.ts).
Missing or invalid required variables cause startup to fail. `NODE_ENV` accepts
`development`, `test`, and `production`; see [`.env.example`](./.env.example) for
every variable and its default.

Startup verifies PostgreSQL with `SELECT 1` before listening. Shutdown drains HTTP
requests before closing the database pool. See [database configuration](./src/db/README.md)
for TLS settings, pool limits, update timestamps, and migration precautions.

## OpenAPI and Scalar

Configuration lives in
[src/config/openapi/openapi.config.ts](./src/config/openapi/openapi.config.ts).
OpenAPI headers and response content have dedicated owners beneath that folder.

- `OPENAPI_ENABLED` controls both endpoints. It defaults to `true` outside
  production and `false` in production.
- `/api/v1/reference` serves the Scalar API reference.
- `/api/v1/doc` serves the OpenAPI **3.0.0** document.
- Route documentation belongs in the route options' `detail` object.
- Reusable Zod schemas are converted to JSON Schema for response documentation.

The declared `@scalar/types` development dependency is `^0.23.2`.
`ApiReferenceConfiguration` is a type-only import, and the Scalar options use
`satisfies ApiReferenceConfiguration`. This is a compile-time configuration check,
not runtime parsing through a Scalar schema. The plugin's types require every
option, so all of them are listed with a comment explaining each one; telemetry
is disabled.

## Adding a Route

Routes separate handlers, contracts, and routers within a feature folder.
Follow the [required-value conventions](#required-values-and-explicit-absence) below.

JSON endpoints use `{ success, message, data, error, status, requestId }`.
Define only the route-specific data schema, compose it with
`createSuccessResponseSchema`, return it through `createSuccessResponse`, and
reference the same schema in `detail.responses` through `jsonContent`.
Routers created with `createRouter()` inherit standard error documentation.

Request schemas and their dedicated schema-derived interfaces belong under their
operation owners in `packages/schemas/src/`. Attach request schemas to route
options as `body`, `query`, `params`, or `headers`. The app mounts feature routers
under `/api/v1` in [src/application.module.ts](./src/application.module.ts).

HTTP application hooks and content-type normalization live in
[src/config/http/application/http-application.config.ts](./src/config/http/application/http-application.config.ts).
Router defaults and the API prefix live under `src/config/http/routing/`;
`jsonContent` belongs to `src/config/openapi/responses/content/`, not middleware.

## Unified HTTP Statuses

Import named HTTP statuses directly from
`@workspace/utils/http/status-codes/http-status-code.constant` for responses,
comparisons, log severity thresholds, and OpenAPI response keys. For example,
return `status: OK` and document the route with `[OK]` rather than a numeric key.
Response schemas use the same catalog for their status ranges and exclusions.
The catalog belongs to the runtime-neutral `@workspace/utils` package. Both the
server and schemas declare that workspace dependency and use its exported alias,
without copying definitions or crossing server runtime boundaries.
Every code change must audit affected code and its diff for hardcoded HTTP statuses.

## Required Values and Explicit Absence

- `createSuccessResponse` requires `request`, `schema`, `data`, `message`, and
  `status`; `createErrorResponse` requires `request`, `code`, `message`, and `status`.
  Callers choose statuses explicitly; response schemas reject invalid ranges and
  success statuses `NO_CONTENT` and `RESET_CONTENT`, which cannot carry JSON bodies.
- Request context is initialized once per request, including errors that precede
  logging middleware. Derived context and response builders receive the same
  concrete logger and correlation ID instead of nullable lookups.
- Missing completed-log entries are a deliberate no-op because preflight and
  favicon responses may finish before the after-response hook. Unmatched routes
  are normalized to the explicit `<unmatched>` log label at the framework boundary.
- Captured exceptions remain `unknown`, including thrown null or undefined;
  serialization narrows them and never exposes raw messages or credentials.
- The published envelope intentionally uses `error: null` on success and
  `data: null` on failure. The greeting also has null data because it carries no
  domain payload. HEAD and `NO_CONTENT` responses have no body. These protocol cases
  are not nullable internal status or message fields.
- Application-owned access must use concrete contracts or explicit narrowing,
  never optional chaining or non-null assertions to hide missing-value cases.
  TypeScript enforces exact optional properties and checked indexed access;
  Biome rejects non-null assertions.

## Migration Compatibility

- Generic errors now return the actual HTTP error status and a sanitized response
  with a correlation request ID. Raw error messages and validation objects are no
  longer returned to clients.
- Generated OpenAPI now includes `operationId` fields. Scalar HTML generated by
  the new plugin differs, while the reference and specification URLs stay the same.
  The HTTP application configuration normalizes HTML responses, including Scalar,
  to `text/html; charset=UTF-8` and JSON responses to `application/json`. Error
  responses set `application/json` directly because they bypass response mapping.
- A native Elysia CORS hook preserves the exact existing policy: `CLIENT_URL` as
  the allowed origin, no credentials, and `Vary: Origin`.
- Preflight responses retain `NO_CONTENT` with methods
  `GET,HEAD,PUT,POST,DELETE,PATCH,QUERY`. Requested headers are echoed with comma
  normalization and `Vary: Origin, Access-Control-Request-Headers` when present.

## TypeScript Path Aliases

`@/*` resolves to `./src/*`, for example:

```typescript
import env from "@/config/environment/server-env.config";
```
