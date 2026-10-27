# Troubleshooting

## A port is already in use

**Symptom:** a start fails or a page does not load on 3000, 3001, or the database port. **Cause:** another process owns the port. **Fix:** find the holder, then stop it with `kill <pid>`. When another PostgreSQL, such as a system service, holds the database port, set `DB_PORT` in `apps/server/.env` to the free port that `bun run doctor` suggests instead.

```sh
lsof -nP -iTCP:3000 -sTCP:LISTEN
```

## A stale container stack

**Symptom:** `bun run db:up` fails because a port or container name is taken. **Cause:** containers from an earlier run still hold them. **Fix:** stop the containers, then start them again.

```sh
bun run db:down
bun run db:up
```

## A wrong database password

**Symptom:** the API, provisioning, or migrations report a rejected database password. **Cause:** the database volume kept passwords from an older `apps/server/.env`. **Fix:** delete the local database volume, which erases local data, then run `bun run dev` to provision, migrate, and seed again.

```sh
docker compose --env-file apps/server/.env down -v
```

## Orphaned servers on 3000 and 3001

**Symptom:** `bun run dev:status` fails while a port still answers. **Cause:** an earlier server is no longer tracked by the dev stack. **Fix:** stop the tracked stack, then stop what still holds the ports.

```sh
bun run dev:stop
lsof -nP -iTCP:3000-3001 -sTCP:LISTEN
```

Stop each listed `PID` with `kill <pid>`.

## A browser fails to launch in the end-to-end tests

**Symptom:** Playwright reports a missing shared library such as `libglib-2.0.so.0`. **Cause:** on NixOS, the config could not build the browser libraries with Nix; its warning is earlier in the log. **Fix:** make sure `nix` works with flakes, then run the suite again. On other systems, run `bunx playwright install --with-deps chromium firefox` from `apps/client`.

## A first start that cannot find a workspace package

**Symptom:** the first `bun run dev` stops with `Cannot find module '@workspace/schemas/...'`. **Cause:** that process started before `bun install` linked the workspace packages. **Fix:** run `bun run dev` again.
