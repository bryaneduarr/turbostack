# Dev container

Run the whole stack in a container, with no Bun, Node.js, or PostgreSQL on your machine. You need Docker and git. VS Code with the Dev Containers extension (`ms-vscode-remote.remote-containers`) is optional; a terminal is enough.

## Start it from a terminal

From the repository root:

```sh
scripts/dc up
scripts/dc bun run dev
```

The first start builds the image, installs the packages, and creates the `apps/*/.env` files, which takes a minute or two. Later starts take seconds. The URLs match the host setup in [run the app](run-the-app.md).

`scripts/dc <command>` runs any command inside the container and starts the container first when it is down. Examples:

```sh
scripts/dc bun run test
scripts/dc bun run check
scripts/dc shell
```

Other forms: `scripts/dc status` lists the services, `scripts/dc down` stops them, and `scripts/dc down -v` also deletes the database data. To confirm the whole setup works on a machine, run `scripts/dc-smoke-test`; it needs Docker, git, and curl.

## Start it from VS Code

1. Open the repository in VS Code.
2. Run **Dev Containers: Reopen in Container** from the command palette.
3. In the container's terminal, run `bun run dev`.

To return to your local editor, run **Dev Containers: Reopen Folder Locally**.

## What runs where

- The `workspace` container holds Bun, Node.js, git, and the apps: web client and API.
- The `postgres` container holds the database.
- Inside the container, the apps reach the database by name. The devcontainer sets `DB_HOST=postgres`, which replaces the `localhost` value in the env file.
- The repository is shared with your machine, including `node_modules`, the env files, and the dev stack log. Your editor and search tools see every change at once. The container runs as your user, so it creates no root-owned files.
- Run `bun`, `bunx`, and `turbo` only inside the container. On your machine they would write files built for another system into the shared `node_modules`.
- The container has no Docker and no browsers, so run `bun run check:compose` and `bun run test:e2e` on the host.

## Ports

The container publishes two services on `127.0.0.1` of your machine only: the web client (3000) and the API (3001).

`scripts/dc` handles busy ports. When a wanted port is taken, it uses the next free one, then the next, and so on. Run `scripts/dc ports` to see the address of each service on your machine:

```text
client http://localhost:3001
api http://localhost:3002
```

The API's allowed client origin follows the client port. A running container keeps its ports until `scripts/dc down`. To start the search from other ports, set `DEVCONTAINER_CLIENT_PORT` or `DEVCONTAINER_API_PORT`. To run a second copy, also set `COMPOSE_PROJECT_NAME` to a new name.

From VS Code the ports are fixed, so stop whatever holds them first, or set those variables before opening the container. PostgreSQL publishes no port. Only the containers reach it.

## Change a database password

`scripts/dc` gives the database container the passwords in `apps/server/.env`. PostgreSQL sets role passwords only on a volume's first start, so after you change one, run `scripts/dc down -v` to delete the volume and start again. From VS Code, also set the same value as the default in `.devcontainer/docker-compose.yml`.
