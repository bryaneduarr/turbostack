# Setup and database pitfalls

Evidence: 2026-10-26; step 5 on `template/05-docs`; a fresh-clone `bun run dev` ran on the host with a system PostgreSQL on 5432.

- A host PostgreSQL on `DB_PORT` fails `doctor`, which suggests a free `DB_PORT`; another project's container on 3000/3001 also fails it.
- A database volume created before the role setup keeps old passwords; `docker compose --env-file apps/server/.env down -v` deletes it.
- `doctor` accepts the pinned Bun and its later patches (`~` range), nothing else.
- Local PostgreSQL needs `DB_SSL_MODE=disable`; Turbo passes only `globalPassThroughEnv` variables.
- `next build` and `next dev` rewrite `apps/client/next-env.d.ts`; do not commit that toggle.
