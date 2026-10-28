# @workspace/database

Drizzle table definitions, committed migrations, and Drizzle Kit commands for the
API server's PostgreSQL database. The server owns the runtime connection pool;
other consumers, such as end-to-end tests, open their own connection with the
exported credentials and query through the same tables. Drizzle Kit and migrations
connect with the migrator credentials, which own the schema.

Import directly from exported modules:

```ts
import { databaseCredentials } from "@workspace/database/config/environment/database-credentials.config";
import { databaseMigratorCredentials } from "@workspace/database/config/environment/database-migrator-credentials.config";
import { usersProfile } from "@workspace/database/tables/users/profile/user-profile.table";
```

The package is tagged `server`, so it never depends on browser packages. Add it to
`dependencies` for runtime consumers and to `devDependencies` for test-only ones.

## Table behavior

[`drizzle.config.ts`](./drizzle.config.ts) discovers every `*.table.ts` file under
`src/tables/`, so new tables need no Drizzle Kit configuration change. Register a
table with a Drizzle instance only when it is used through Drizzle's relational
query API. Migration SQL and snapshots live in `src/migrations/`.

`updatedAt` uses PostgreSQL `now()` for Drizzle updates when no explicit update
value is supplied. This is a Drizzle runtime hook, not a database trigger. Raw SQL
or other applications must set the field explicitly or use a reviewed trigger
migration. `now()` uses the current transaction's start time.

## Migrations

Run commands from `packages/database`. Each script passes `apps/server/.env` to
Drizzle Kit, which connects as `DB_MIGRATOR_*`. Provision the database roles
first (see the [server database guide](../../apps/server/src/db/README.md)):

```sh
bun run drizzle:generate
bun run drizzle:migrate
```

Review and commit generated SQL and snapshots before applying migrations in a
controlled deployment step. Production images do not include Drizzle Kit; the
server build bundles its migration runner with these committed migrations, and `bun run start:migrate` (or
`bun db/migrate/apply-migrations.script.js` inside the image) applies them using
only the `DB_*` variables.

Grants are migrations too. Generate an empty one with
`bun --env-file=../../apps/server/.env drizzle-kit generate --custom --name=<name>`
and grant each role only the tables and columns it needs. The runner holds a
PostgreSQL advisory lock, so
concurrent deployments wait instead of applying the same migrations twice, and
sets `lock_timeout` so a migration cannot queue behind a long query and block
traffic to that table. Do not automatically run migrations on every server
startup.

Drizzle applies migrations newer than the last applied one, so a migration
generated on an older branch is skipped silently if a newer one was applied first.
`bun run verify` runs `drizzle-kit check`, which rejects two migrations generated from the same
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
