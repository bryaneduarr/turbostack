# Setup and database pitfalls

Evidence: 2026-10-14; base `dd078d8` plus uncommitted changes; dev/start flows run locally with `DB_PORT=55432`.

- Compose reads `DB_*` from `apps/server/.env`; a host PostgreSQL on that `DB_PORT` blocks `db:up`, `dev`, and `start`.
- The client needs `apps/client/.env` (`SERVER_URL`); its standalone server does not load `.env` itself, so `start` passes `--env-file-if-exists`.
- Server tests import the app, validating `apps/server/.env`.
- TLS defaults to `verify-full`; local PostgreSQL needs `DB_SSL_MODE=disable`.
- Turbo strict mode passes only `globalPassThroughEnv` variables.
