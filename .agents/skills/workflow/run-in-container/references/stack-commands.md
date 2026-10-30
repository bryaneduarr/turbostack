# Stack commands, limits, and failures

Contract from the isolated stacks plan. Read the project note for what is built.

## Commands

| Command | Does |
| --- | --- |
| `scripts/dc <command>` | Runs the command in this work tree's workspace container, starting the stack first when needed |
| `scripts/dc list` | One line per stack: state, last use, busy flag, ports, work tree path, and what `prune` would remove |
| `scripts/dc ports` | URLs of `client` and `api` (ports move to the next free one; never assume `3000`) |
| `scripts/dc stop` / `stop --all` | Stops this stack / every stack, keeping data |
| `scripts/dc stop-idle` | Stops every idle stack |
| `scripts/dc down` | Removes this stack's containers and network, keeping data. `down -v` also deletes its database |
| `scripts/dc prune [--dry-run]` | Removes stacks whose work tree folder is gone (idle at least 7 days) and unused older `app-workspace` images |

## Limits

| Setting | Default | Variable |
| --- | --- | --- |
| Running stacks | 2 | `DC_MAX_STACKS` |
| Idle before stop | 15 minutes | `DC_IDLE_MINUTES` |
| Heavy slots | 1 | `DC_HEAVY_SLOTS` |
| Longest wait, then exit 75 | 45 minutes | `DC_WAIT_MINUTES` |
| Age before an orphaned stack is pruned | 7 days | `DC_PRUNE_DAYS` |

- Starting a third stack stops the least recently used idle one. A stack with a running command or any extra process (dev server, shell, editor server) is never idle.
- Build, check, verify, e2e, and Playwright commands run one at a time across all stacks. Database and e2e commands run one at a time inside a stack. `DC_LOCK=none|stack|heavy` overrides the choice for one call.
- Exit 69: Docker or `flock` is missing. Exit 75: waited the full limit for a stack or slot. Exit 78: the stack name already belongs to another checkout; set `NEW_CONTAINER_PREFIX` in the rename script and run `bun run rename-scope`.
- Only stacks with the `dc.managed` label are managed. Every project made from the template shares `~/.local/state/dc/v1` (`DC_STATE_DIR`), so they share the cap and the heavy slot.

## Dev stack

- Use `scripts/dc bun run dev:start`, `dev:status`, and `dev:stop`. Never `bun run dev`, whose interactive screen locks the terminal.
- PostgreSQL already runs in the stack; `db:up` does nothing there. Services reach each other by name (`postgres`).

## When something fails

- `Bind for 127.0.0.1:... failed`: a port was taken between the check and the start. Run `scripts/dc` again.
- The stack exits at start: run `scripts/dc list`, then report the stack's state and the command's output as the blocker. Do not start the services by hand.
- `password authentication failed`: the database volume kept older passwords. Run `scripts/dc down -v`, then any `scripts/dc` command; this deletes that stack's local data.
- A changed `Dockerfile` or compose file is picked up by the next `scripts/dc` call, which rebuilds the image once.
- Check the whole tool with `scripts/dc-test` (offline logic) and `scripts/dc-smoke-test` (needs Docker and git).
