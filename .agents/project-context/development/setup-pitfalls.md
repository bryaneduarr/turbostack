# Setup and database pitfalls

Evidence: 2026-10-14; base `018c6c1` plus uncommitted changes; compose stack verified locally.

- [setup](../../../package.json) installs from the lockfile, runs `db:up` (Docker), then applies migrations; it needs `apps/server/.env` first.
- Port 5432 may be taken by a host PostgreSQL; use `POSTGRES_PORT` and matching `DB_PORT`.
- TLS defaults to `verify-full`; local PostgreSQL needs `DB_SSL_MODE=disable`.
- `SELECT 1` checks skip tables and migration history.
- Local Docker here logs to journald; `docker logs` may be empty.
