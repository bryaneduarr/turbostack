# Setup and database pitfalls

Evidence: 2026-10-13; `0ebf76b`; sources/docs inspected, no application changes; runtime unverified.

- [setup](../../../package.json) deletes the lockfile, reinstalls, generates/applies migrations, and writes formatting. `setup:update` also updates dependencies; neither is harmless verification.
- [Database docs](../../../apps/server/src/db/README.md) require reviewing generated migrations and reconciling existing databases before application.
- Docs specify verified TLS by default; non-TLS local PostgreSQL needs explicit `DB_SSL_MODE=disable`.
- The documented startup connection check does not validate tables or migration history.
