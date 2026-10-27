# Run production locally

Run the production builds on your machine, the way a deployment runs them. For daily work, use [run the app](run-the-app.md).

## Built apps on your machine

```sh
bun run start
```

- Builds the apps, starts the local database container, then starts the API and the web client. Docker must be running.
- Runs no migrations. Run `bun run dev` once first, so the database has its roles and tables.
- Needs Node.js 22.9 or newer to run the built web client.

You should see the web client at http://localhost:3000 and http://localhost:3001/health/live answering 200.

Stop it with Ctrl+C.

## Production containers

```sh
bun run doctor -- --production
bun run start:docker
```

- `doctor --production` checks that `apps/server/.env` and `apps/client/.env` hold every value the containers need, after the values Compose sets for them.
- `start:docker` builds the API and web client images, runs migrations, then starts the API and the web client in Docker. No Node.js is needed on your machine.
- Reads production values from `apps/server/.env` and `apps/client/.env`. Nothing generates them for you. Replace every example password before a real deployment.
- Serves the web client at http://localhost:3000 and the API at http://localhost:3001.

The PostgreSQL container creates the database roles on its volume's first start. A managed database needs them created once with `bun db/provision/provision-database.script.js` in the server image, using the provider's admin user.

Stop it with Ctrl+C, then remove the containers:

```sh
docker compose --env-file apps/server/.env --profile production down
```
