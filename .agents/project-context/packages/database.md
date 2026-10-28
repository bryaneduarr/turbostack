# Database package

Evidence: 2026-10-28; `chore/fast-checks` on `759ac4e`; `scripts/dc bun run verify` passed, including the migrations step.

- [packages/database](../../../packages/database/README.md) owns tables, migrations, and Drizzle Kit; the server owns the pool in `apps/server/src/config/database/`.
- Roles from [DATABASE_ROLES](../../../packages/schemas/src/database/roles/database-role.constant.ts): `app_migrator` owns the schema, `app_runtime` serves the API, `app_cli` reads only.
- Provisioning SQL in `apps/server/src/db/provision/initdb/` runs on the container's first start and through `bun run db:provision`.
- Grants are migrations. No automated grant check exists since unit tests were dropped (user accepted 2026-10-28).
- E2E uses `<DB_NAME>_test`, recreated by `db:test:prepare`.
