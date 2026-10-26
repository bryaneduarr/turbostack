# Database package

Evidence: 2026-10-26; `9800020` plus uncommitted step 3; `bun run verify` and server tests passed locally.

- [packages/database](../../../packages/database/README.md) owns tables, migrations, and Drizzle Kit; the server owns the pool in `apps/server/src/config/database/`.
- Roles from [DATABASE_ROLES](../../../packages/schemas/src/database/roles/database-role.constant.ts): `app_migrator` owns the schema, `app_runtime` serves the API, `app_cli` reads only.
- Provisioning SQL in `apps/server/src/db/provision/initdb/` runs on the container's first start and through `bun run db:provision`.
- Grants are migrations; `apps/server/src/db/testing/grants/` tests every table per role.
- Server tests use `<DB_NAME>_test`, recreated by `db:test:prepare`.
