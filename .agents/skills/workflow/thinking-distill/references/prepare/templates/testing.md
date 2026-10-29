# Testing <feature> in the container

The local CI is one command. The verify job runs it once after the review fixes, then `verify --failed` in the fix loop until it passes. Every command runs through `scripts/dc` from the delivery worktree, in its own stack with its own PostgreSQL and ports. Nothing runs on the host, and nothing runs in a task worktree. `scripts/dc` queues heavy and database commands itself, so no command needs a lock. Send the output to a log file and wait for it; a full run takes about a minute. Without Docker every row is blocked.

| Order | Run | Command | What it covers |
| --- | --- | --- | --- |
| 1 | Full run | `scripts/dc bun run verify` | Lockfile, Biome, boundaries, project rules, compose, migrations, types and builds, and the `api` and `chromium` browser tests; stops at the first failure |
| 2 | Fix loop | `scripts/dc bun run verify --failed` | Biome, boundaries, rules, types and builds, and only the failed browser tests, or every remaining step when an earlier step failed |

## Scenarios

| Scenario | File | Task | Proves |
| --- | --- | --- | --- |
| <name> | `apps/client/src/e2e/<area>/<name>.e2e.ts` | t<nn> | <Done when line> |

## Allowed skips

- Firefox and WebKit unless the user asks; the default run covers `api` and `chromium`.
