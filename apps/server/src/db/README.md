# Database configuration

The server uses one Postgres.js pool per process and a Drizzle instance registered
with the table schema. Import `db` directly from
`@/db/config/connection/database-connection.config`; do not create clients inside
request handlers.

## Startup and shutdown

Startup runs `SELECT 1` before the HTTP listener starts. Unreachable databases,
authentication failures, and TLS failures prevent startup. This check does not
verify tables, permissions for application operations, or the migration baseline.

SIGINT and SIGTERM stop accepting HTTP requests, wait for active handlers, and
close the pool. After `SHUTDOWN_TIMEOUT_SECONDS`, active HTTP requests are forced
closed. Database cleanup uses its own bounded timeout. Startup failures also
close the pool. Shutdown is handled once, including signals received during startup.
The implementation lives in
[`shutdown-server.service.ts`](../services/server/shutdown/shutdown-server.service.ts).

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
| `DB_STATEMENT_TIMEOUT_SECONDS` | `30` | PostgreSQL cancels application queries running longer; `0` disables |
| `DB_MIGRATION_LOCK_TIMEOUT_SECONDS` | `10` | A migration statement fails instead of waiting longer for a table lock |
| `SHUTDOWN_TIMEOUT_SECONDS` | `30` | HTTP request drain deadline; not needed by Drizzle Kit |

Existing local `.env` files must explicitly set `DB_SSL_MODE=disable` if PostgreSQL
has no TLS. Copy the local setting from `.env.example`. Remote databases should
use `verify-full`; configure trusted certificate authorities in the deployment
rather than disabling certificate verification.

Budget total connections as the number of server processes multiplied by
`DB_POOL_MAX`, leaving capacity for migrations and administration. Do not increase
the pool without measuring database capacity and query load. Keep prepared
statements enabled unless the provider's pooler configuration requires otherwise.
The statement timeout is sent as a connection startup parameter; PgBouncer must
list `statement_timeout` in `ignore_startup_parameters` or set it on the role.

## Table behavior

The user-profile table belongs to
[`tables/users/profile/user-profile.table.ts`](./tables/users/profile/user-profile.table.ts).
`drizzle.config.ts` discovers every `*.table.ts` file under `src/db/tables/`, so new
tables need no Drizzle Kit configuration change. Add a table to the `schema` map in
[`database-connection.config.ts`](./config/connection/database-connection.config.ts)
only when it is used through Drizzle's relational query API. Migration SQL and
snapshots remain in `src/db/migrations/`.

`updatedAt` uses PostgreSQL `now()` for Drizzle updates when no explicit update
value is supplied. This is a Drizzle runtime hook, not a database trigger. Raw SQL
or other applications must set the field explicitly or use a reviewed trigger
migration. `now()` uses the current transaction's start time.

## Migrations

Run commands from `apps/server`:

```sh
bun run drizzle:generate
bun run drizzle:migrate
```

Review and commit generated SQL and snapshots before applying migrations in a
controlled deployment step. Production images do not include Drizzle Kit; the
build bundles [`apply-migrations.script.ts`](./migrate/apply-migrations.script.ts)
with the committed migrations, and `bun run start:migrate` (or
`bun db/migrate/apply-migrations.script.js` inside the image) applies them using
only the `DB_*` variables. The runner holds a PostgreSQL advisory lock, so
concurrent deployments wait instead of applying the same migrations twice, and
sets `lock_timeout` so a migration cannot queue behind a long query and block
traffic to that table. Do not automatically run migrations on every server
startup.

Drizzle applies migrations newer than the last applied one, so a migration
generated on an older branch is skipped silently if a newer one was applied first.
CI runs `drizzle-kit check`, which rejects two migrations generated from the same
parent, and fails when `drizzle:generate` would create a migration that is not
committed. After merging a branch that also changed tables, delete your
unapplied migration and run `bun run drizzle:generate` again.

Old and new server versions run together during a deploy, so keep each migration
compatible with the previous release: add columns and tables first, and remove or
rename them in a later release once no deployed code uses them. Keep `drizzle:push` for deliberate development workflows rather than
unreviewed production schema changes.

For another database that already has tables, reconcile its live schema and
migration history before applying this initial create-table migration. Existing
`timestamp without time zone` data requires a separately reviewed conversion
using the timezone represented by those values; the session timezone alone does
not establish historical intent. The runtime update hook is not a database trigger.

Type checks and builds do not verify connection startup, CRUD, defaults, update
timestamps, or timezone round-tripping. Validate those behaviors separately in a
controlled environment before deployment.
