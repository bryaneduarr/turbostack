# Setup and database pitfalls

Evidence: 2026-10-14; base `ef7f1e0` plus uncommitted changes; dev/start flows run locally with `DB_PORT=55432`.

- Compose reads `DB_*` from `apps/server/.env`; a host PostgreSQL on that `DB_PORT` blocks `db:up`, `dev`, and `start`.
- Vitest validates `apps/server/.env`; a set `LOG_LEVEL` makes test logs noisy.
- `next dev` writes `apps/client/AGENTS.md` unless `agentRules: false`.
- TLS defaults to `verify-full`; local PostgreSQL needs `DB_SSL_MODE=disable`.
- Local Docker logs to journald; `docker logs` may be empty.
