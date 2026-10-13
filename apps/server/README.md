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

## Getting Started

Run these commands from `apps/server` after installing workspace dependencies at the repository root:

```sh
cp .env.example .env
bun run dev
```

Development uses `bun --watch src/index.ts`. The default server URL is
[http://localhost:3001](http://localhost:3001).

## Production

Build TypeScript and resolve path aliases, then start the compiled server with Bun:

```sh
bun run build
bun run start
```

The build writes to `dist/`; start runs `bun ./dist/src/index.js`.

## Available Scripts

- **bun run build**: Compile TypeScript and resolve aliases
- **bun run check-types**: Type-check without emitting files
- **bun run clean**: Remove dist, node_modules, and .turbo
- **bun run dev**: Watch and run the server with Bun
- **bun run format**: Format with Biome
- **bun run lint**: Lint with Biome
- **bun run start**: Run the compiled server with Bun
- **bun run update**: Update dependencies to their latest versions
- **bun run drizzle:generate**: Generate database migrations
- **bun run drizzle:migrate**: Apply database migrations
- **bun run drizzle:push**: Push the database schema
- **bun run drizzle:studio**: Open Drizzle Studio

No permanent test suite is configured. Available static checks are
`bun run check-types`, `bun run lint`, and `bun run build`; run the schemas package's
type check and lint when its contracts change. These checks do not establish
runtime HTTP behavior, database correctness, or graceful shutdown.

## Logging

The validated environment always provides `LOG_LEVEL`, defaulting to debug in
development and info in production. Request logs have required correlation and
timing fields; failure classification and captured exceptions use explicit states.
Only allowlisted error names/codes and local source locations are serialized.
Absent diagnostics are omitted from emitted logs, not assigned undefined.

## Environment and Database

Environment variables are validated with Zod in
[src/config/environment/server-env.config.ts](./src/config/environment/server-env.config.ts).
Missing or invalid required variables cause startup to fail.

Startup verifies PostgreSQL with `SELECT 1` before listening. Shutdown drains HTTP
requests before closing the database pool. See [database configuration](./src/db/README.md)
for TLS settings, pool limits, update timestamps, and migration precautions.

## OpenAPI and Scalar

Configuration lives in
[src/config/openapi/openapi.config.ts](./src/config/openapi/openapi.config.ts).
OpenAPI headers and response content have dedicated owners beneath that folder.

- `/api/v1/reference` serves the Scalar API reference.
- `/api/v1/doc` serves the OpenAPI **3.0.0** document.
- Route documentation belongs in the route options' `detail` object.
- Reusable Zod schemas are converted to JSON Schema for response documentation.

The declared `@scalar/types` dependency is `^0.23.2`.
`ApiReferenceConfiguration` is a type-only import, and the Scalar options use
`satisfies ApiReferenceConfiguration`. This is a compile-time configuration check,
not runtime parsing through a Scalar schema. The options are supplied explicitly
to the OpenAPI plugin.

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
  `status`; `createErrorResponse` requires `request`, `code`, and `status`.
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
  to `text/html; charset=UTF-8` and JSON responses to `application/json`.
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
