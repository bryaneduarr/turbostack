# Testing <feature> in the container

The verify job runs these in order, first in the test stage after the tests are written, then again in the final test stage on the committed tree. Every command runs through `scripts/dc` from the delivery's worktree, in that worktree's own stack with its own PostgreSQL and ports. Nothing runs on the host. `scripts/dc` queues heavy and database commands itself, so no command needs a lock. Run long commands detached with output in a log file and poll it. A failing command does not stop the next one unless the next one lists it under Needs. Without Docker every row is blocked.

| Order | Check | Command | Needs |
| --- | --- | --- | --- |
| 1 | Rules | `scripts/dc bun run check:rules` | |
| 2 | Lint | `scripts/dc bunx biome ci .` | |
| 3 | Types | `scripts/dc bun run --cwd <package> check-types`, once per affected package | |
| 4 | Unit and route | `scripts/dc bun run --cwd <package> test`, once per affected package | |
| 5 | End to end | `scripts/dc bun run test:e2e -- --project=api --project=chromium --project=firefox --grep "<scenario>"` | 3 |
| 6 | Before push | `scripts/dc bun run check`, then `scripts/dc bun run verify` | |

## Scenarios

| Scenario | File | Task | Proves |
| --- | --- | --- | --- |
| <name> | `apps/client/src/e2e/<area>/<name>.e2e.ts` | t<nn> | <Done when line> |

## Allowed skips

- WebKit locally; the Playwright config skips it in the container and CI runs it.
