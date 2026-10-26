# Setup and database pitfalls

Evidence: 2026-10-26; `9800020` plus uncommitted step 3; doctor, stack, check, and verify run locally with `DB_PORT=55433`.

- A host PostgreSQL on `DB_PORT` blocks `db:up`; another project's container on 3000/3001 fails `doctor`.
- A database volume created before the role setup keeps old passwords; `docker compose --env-file apps/server/.env down -v` deletes it.
- `doctor` warns when local Bun differs from `packageManager`.
- Local PostgreSQL needs `DB_SSL_MODE=disable`; Turbo passes only `globalPassThroughEnv` variables.
- `next build` and `next dev` rewrite `apps/client/next-env.d.ts`; do not commit that toggle.
