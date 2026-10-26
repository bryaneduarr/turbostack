# Database configuration

The server uses one Postgres.js pool per process and one Drizzle instance. Import `db` directly from
`@/config/database/database-connection.config`; do not create clients inside
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

## Database roles

Each process connects as its own least-privilege role: migrations and Drizzle
Kit as `app_migrator` (`DB_MIGRATOR_*`), which owns the schema; the API as
`app_runtime` (`DB_USER`/`DB_PASSWORD`); and manual read-only inspection, such
as `psql`, as `app_cli`. Migrations grant each role exactly the tables and
columns it needs, so the role names are fixed and the environment schemas reject
others.

`bun run db:provision` connects as `DB_ADMIN_*`, creates the roles with their
configured passwords, makes `app_migrator` the owner of the `public` schema and
of existing objects, and revokes default `PUBLIC` privileges. It is safe to run
repeatedly; run it once with the provider's admin user before the first
migration. The local PostgreSQL container runs the same
[SQL](./provision/initdb/01-provision-database-roles.sql) on its volume's first
start. Inside the production image, run `bun db/provision/provision-database.script.js`.

## Validated settings

The database schema and its `ValidatedDatabaseEnvironment` interface live in
`packages/schemas/src/database/environment/`. The
[database package](../../../../packages/database/README.md) validates the
credentials directly without requiring HTTP or logging variables, so Drizzle Kit
does not depend on unrelated server configuration.
[`database-connection.config.ts`](../config/database/database-connection.config.ts)
separately validates pool settings and initializes the runtime client. Runtime
and Drizzle Kit use the same structured credentials and TLS policy.

| Variable | Default | Purpose |
| --- | --- | --- |
| `DB_HOST`, `DB_NAME` | Required | Nonempty connection identifiers |
| `DB_USER` | Required | The API's role, `app_runtime` |
| `DB_PASSWORD` | Required | Nonempty password, preserved without trimming |
| `DB_MIGRATOR_USER`, `DB_MIGRATOR_PASSWORD` | Required for migrations | The schema owner, `app_migrator` |
| `DB_ADMIN_USER`, `DB_ADMIN_PASSWORD` | Required for provisioning | An administrative role that can create roles |
| `DB_CLI_USER`, `DB_CLI_PASSWORD` | Required for provisioning | The read-only operator role, `app_cli` |
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

Tables, migrations, and Drizzle Kit commands live in the
[database package](../../../../packages/database/README.md). The build copies its
committed migrations into `dist/db/migrations` for the bundled
[migration runner](./migrate/apply-migrations.script.ts).
