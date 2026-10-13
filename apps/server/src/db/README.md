## Validated settings

The database schema and its `ValidatedDatabaseEnvironment` interface live in
`packages/schemas/src/database/environment/`.
[`database-credentials.config.ts`](./config/environment/database-credentials.config.ts)
validates that schema directly without requiring HTTP or logging variables, so
Drizzle Kit does not depend on unrelated server configuration.
[`database-connection.config.ts`](./config/connection/database-connection.config.ts)
separately validates pool settings and initializes the runtime client. Runtime
and Drizzle Kit use the same structured credentials and TLS policy.

| Variable | Default | Purpose |
| --- | --- | --- |
| `DB_HOST`, `DB_USER`, `DB_NAME` | Required | Nonempty connection identifiers |
| `DB_PASSWORD` | Required | Nonempty password, preserved without trimming |
| `DB_PORT` | Required | Integer from 1 to 65535 |
| `DB_SSL_MODE` | `verify-full` | Verified TLS; `disable` is available for trusted local databases |
| `DB_POOL_MAX` | `10` | Maximum connections per process |
| `DB_CONNECT_TIMEOUT_SECONDS` | `10` | Connection-establishment timeout, not query timeout |
| `DB_IDLE_TIMEOUT_SECONDS` | `0` | Zero keeps idle connections open |
| `DB_PREPARE` | `true` | Accepts `true` or `false`; use the provider's pooler requirements |
| `DB_SHUTDOWN_TIMEOUT_SECONDS` | `5` | Deadline for finishing database queries during cleanup |
| `SHUTDOWN_TIMEOUT_SECONDS` | `30` | HTTP request drain deadline; not needed by Drizzle Kit |

Existing local `.env` files must explicitly set `DB_SSL_MODE=disable` if PostgreSQL
has no TLS. Copy the local setting from `.env.example`. Remote databases should
use `verify-full`; configure trusted certificate authorities in the deployment
rather than disabling certificate verification.

Budget total connections as the number of server processes multiplied by
`DB_POOL_MAX`, leaving capacity for migrations and administration. Do not increase
the pool without measuring database capacity and query load. Keep prepared
statements enabled unless the provider's pooler configuration requires otherwise.

## Table behavior

The user-profile table belongs to
[`tables/users/profile/user-profile.table.ts`](./tables/users/profile/user-profile.table.ts).
`drizzle.config.ts` references that schema; migration SQL and snapshots remain in
`src/db/migrations/`.

`updatedAt` uses PostgreSQL `now()` for Drizzle updates when no explicit update
value is supplied. This is a Drizzle runtime hook, not a database trigger. Raw SQL
or other applications must set the field explicitly or use a reviewed trigger
migration. `now()` uses the current transaction's start time.
