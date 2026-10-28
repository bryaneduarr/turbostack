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

`scripts/dc` needs Docker and `flock`, which Linux and WSL2 provide. Without either it stops with exit code 69 and a message. On macOS, use VS Code instead.

Other forms: `scripts/dc status` lists the services, `scripts/dc down` removes the stack's containers and keeps its data, and `scripts/dc down -v` also deletes the database data. To confirm the whole setup works on a machine, run `scripts/dc-smoke-test`; it needs Docker, git, and curl, and it refuses to run while other stacks are running.

## One stack per work tree

Every checkout has its own stack: workspace, PostgreSQL, ports, and `node_modules`. Run `scripts/dc` inside a `git worktree` folder, such as `~/worktrees/<repo>/<feature>`, and it starts that folder's own stack with no extra setup. All stacks share one image and one package cache, so a second stack starts without rebuilding or downloading packages again.

A machine with little memory stays usable because `scripts/dc` keeps the load small:

- At most 2 stacks run. Starting a third stops the least recently used idle one. When all are busy, it waits and exits with code 75 after 45 minutes.
- A stack with no command and no extra process (dev server, shell) for 15 minutes is stopped, and its data stays. The next `scripts/dc` call from any work tree does the stopping.
- Build, check, verify, and end-to-end commands run one at a time across all stacks. Database commands run one at a time inside a stack.
- Each workspace container is limited to 6 GB of memory and 8 CPUs, and its logs are capped.

| Command | Does |
| --- | --- |
| `scripts/dc list` | Shows every stack: state, last use, busy flag, ports, and work tree |
| `scripts/dc stop` and `scripts/dc stop --all` | Stops this stack or every stack, keeping data |
| `scripts/dc stop-idle` | Stops every idle stack |
| `scripts/dc prune [--dry-run]` | Removes stacks whose work tree folder is gone after 7 days, and unused older images |

`scripts/dc` only manages stacks that carry its marker label (`dc.managed`), so it never lists, stops, or removes another project's dev container. Every project made from this template shares one notes folder, `~/.local/state/dc/v1`, so they share the stack cap, the idle timer, and the heavy-command slot. The `v1` part keeps a future incompatible version from reading these notes. [Multiple projects](multiple-projects.md) shows the setup with an example and how to verify it.

### Name your containers once

Container, image, and volume names start with `app`. Before you start a second project made from this template, set `NEW_CONTAINER_PREFIX` (and `NEW_SCOPE`) in `scripts/rename-workspace-scope.script.ts`, then run `bun run rename-scope` and `bun run clean`. If two checkouts share a name, `scripts/dc` stops with exit code 78 and tells you the same thing, so one project never reuses another's database.

Change the defaults with `DC_MAX_STACKS`, `DC_IDLE_MINUTES`, `DC_HEAVY_SLOTS`, `DC_WAIT_MINUTES`, `DC_PRUNE_DAYS`, `DEVCONTAINER_WORKSPACE_MEMORY`, and `DEVCONTAINER_WORKSPACE_CPUS`. On WSL2 the stacks share the memory that `.wslconfig` gives the virtual machine, so raise `memory` there if builds run out of it.

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
- The container has no Docker, so run `bun run check:compose` on the host. It has Chromium, Firefox, and their system libraries, so `scripts/dc bun run test:e2e` runs the end-to-end tests inside it. WebKit is skipped there.

## Ports

The container publishes two services on `127.0.0.1` of your machine only: the web client (3000) and the API (3001).

`scripts/dc` handles busy ports. When a wanted port is taken, it uses the next free one, then the next, and so on. Run `scripts/dc ports` to see the address of each service on your machine:

```text
client http://localhost:3001
api http://localhost:3002
```

The API's allowed client origin follows the client port. A running container keeps its ports until `scripts/dc down`. To start the search from other ports, set `DEVCONTAINER_CLIENT_PORT` or `DEVCONTAINER_API_PORT`. A second copy of the project gets its own stack and ports when you run `scripts/dc` from its folder.

From VS Code the ports are fixed, so stop whatever holds them first, or set those variables before opening the container. PostgreSQL publishes no port. Only the containers reach it.

## Change a database password

`scripts/dc` gives the database container the passwords in `apps/server/.env`. PostgreSQL sets role passwords only on a volume's first start, so after you change one, run `scripts/dc down -v` to delete the volume and start again. From VS Code, also set the same value as the default in `.devcontainer/docker-compose.yml`.
