# Setup and database pitfalls

Evidence: 2026-10-14; base `56951b6` plus uncommitted changes; dev, start, and test flows run locally with `DB_PORT=55432`.

- A host PostgreSQL on `DB_PORT` (from `apps/server/.env`) blocks `db:up`, `dev`, `start`, and server tests.
- The client needs `apps/client/.env`; `start` loads it with `--env-file-if-exists`.
- The standalone client runs as `next-server`; stop it by port.
- Local PostgreSQL needs `DB_SSL_MODE=disable`.
- Turbo passes only `globalPassThroughEnv` variables.
