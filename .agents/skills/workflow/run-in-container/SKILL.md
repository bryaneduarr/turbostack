---
name: run-in-container
description: "Detect where the project runs (inside the devcontainer, or on a host with Docker) and use the right way to run commands, tests, the dev stack, file reads and edits, git, and the browser. Use before the first project command of a session, whenever a command fails with a missing tool or database, and when the user mentions the container, Docker, or the devcontainer."
---

# Run in the container

The toolchain (Bun, Node, Turbo, Biome, PostgreSQL) lives in the devcontainer. The repository is a bind mount, so the host and the container see the same files, including `node_modules`, `.env` files, and `.turbo`.

## Output

The right command form for the place you run in, and no host-built files in the shared `node_modules`.

## Detect where you are

Run once per session:

```sh
test "${DEVCONTAINER:-}" = true && echo inside || { docker info >/dev/null 2>&1 && test -x scripts/dc && echo host-with-docker || echo no-container; }
```

| Result | Meaning | Run project commands |
| --- | --- | --- |
| `inside` | You are in the `workspace` container (`/workspace`) | Directly: `bun run test` |
| `host-with-docker` | Host, Docker works | Through `scripts/dc`, always |
| `no-container` | No Docker, such as the restricted sandbox | Directly, following [verification and tools](../../../methods/verification-and-tools.md); report if Bun is missing |

## Host with Docker

- Prefix every `bun`, `bunx`, `turbo`, and `node` command with `scripts/dc`: `scripts/dc bun run check:rules`, `scripts/dc bunx biome ci .`, `scripts/dc bun run --cwd apps/server check-types`, `scripts/dc bun run test`.
- `scripts/dc` starts the container when it is down. The first start takes one to two minutes (image, `bun install`, `.env` files); later starts take seconds. `scripts/dc up` starts it on purpose and rebuilds the image; `scripts/dc status` lists the services; `scripts/dc down` stops them; `scripts/dc down -v` also deletes the database.
- It keeps your subdirectory, forwards standard input, and returns the command's exit code.
- Never run `bun install`, `bun run`, or `turbo` on the host. They would write host-built native files into the shared `node_modules` and break the container.
- Run long commands detached with output in a log file, and poll the file.

## Files, search, edits, git

- Read, search, and edit on the host with the normal tools. The container sees every edit at once; nothing to sync or restart.
- Read logs on the host: `.turbo/dev-stack/dev-stack.log`.
- Run git on the host, including commits through the `commit-changes` skill.
- Type lookups read `node_modules` on the host; they work without running anything.

## Dev stack

- Use `scripts/dc bun run dev:start`, `dev:status`, and `dev:stop`. Never `bun run dev`, whose interactive screen locks the terminal.
- PostgreSQL is already running in the container stack; `db:up` does nothing there.
- Services reach each other by name (`postgres`). The host reaches the services on `127.0.0.1`. Their ports move to the next free one when the default is busy, so never assume `3000`: run `scripts/dc ports` for the URLs of `client` and `api`.

## Browser

- The container has no browser. Browser work stays on the host, with the `agent-chrome` tools from the [use-browser skill](../../testing/use-browser/SKILL.md), pointed at the URLs from `scripts/dc ports`.
- Start the stack with `scripts/dc bun run dev:start` only when the page needs it, and never stop a stack the user started.
- The browser rule still applies: use it only when the user asks for it.
- Inside the container (`inside`), tell the user that browser work must run from the host.
- Playwright end-to-end tests are not set up in the container. Do not run `test:e2e` there.

## When something fails

- `Bind for 127.0.0.1:... failed`: a port was taken between the check and the start, or you started from VS Code. Run `scripts/dc up` again.
- The container exits at start: `docker compose -f .devcontainer/docker-compose.yml logs workspace`.
- `password authentication failed`: the database volume kept older passwords. Run `scripts/dc down -v`, then `scripts/dc up`; this deletes the local data.
- A changed `Dockerfile` or compose file needs `scripts/dc up`.
- Killing a `scripts/dc` command from the host does not stop what it started inside. Look with `scripts/dc ps aux` and stop it with `scripts/dc pkill -f <name>`.
- Verify the whole setup with `scripts/dc-smoke-test` (needs Docker, git, curl); it uses its own project name and free ports.
