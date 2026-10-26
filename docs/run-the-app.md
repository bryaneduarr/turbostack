# Run the app

After `bun run dev` shows every service ready, open these addresses. Each one answers while its service runs.

| Address | What it is |
| --- | --- |
| `http://localhost:3000` | Web client; the home page shows whether the API and database are ready |
| `http://localhost:3000/profiles` | The user profiles example: list, create, and rename |
| `http://localhost:3001/health/live` | API server, returns a 200 response while it runs |
| `http://localhost:3001/api/v1/reference` | API reference, served outside production unless `OPENAPI_ENABLED=false` |

## Run it in the background

`bun run dev:start` starts the same stack detached and logs to `.turbo/dev-stack/dev-stack.log`. `bun run dev:status` checks each address, and `bun run dev:stop` stops the stack.

## Stop

- Press Ctrl+C in the terminal running `bun run dev` to stop the apps.
- If you started the apps with `bun run dev:start`, stop them with `bun run dev:stop`.
- Stop the database container with `bun run db:down`. Your data stays in a Docker volume.
