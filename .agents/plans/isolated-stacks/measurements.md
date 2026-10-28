# Isolated stacks: measurements

Machine: WSL2, 15.5 GB RAM, 28 CPUs, Docker 29.9.2. Date (UTC): 2026-10-28. Code: branch `template/06-isolated-stacks` at `9336cc7`. Memory comes from one `docker stats --no-stream` sample, so it includes reclaimable file cache.

## Measured in this template

| What | Command | Result |
| --- | --- | --- |
| First start of the primary stack (image layers cached, shared volumes new) | `scripts/dc bun --version` | under 2 minutes, including the Chromium and Firefox download |
| Second work tree on the committed code (empty `node_modules`) | `scripts/dc bun --version` | 6 s, no image build, packages from the shared cache |
| Rules and lint in the second tree | `scripts/dc bun run check:rules`, `scripts/dc bunx biome ci .` | both pass |
| Full e2e in the container | `scripts/dc bun run test:e2e -- --project=api --project=chromium --project=firefox` | 12 passed, 5.8 s of tests, 10.6 s in all |
| Idle, one fresh stack | 20 s after start | workspace 65 MiB, PostgreSQL 39 MiB, CPU about 0% |
| Image | `docker image ls app-workspace` | 1.49 GB, shared by every stack |
| Kill a host command | `timeout 3 scripts/dc sleep 300` | no `sleep` left in the container after 5 s |

## Taken from the source project, not measured here

The source project measured these with a larger stack (its own PostgreSQL, mail, and storage services, and 224 e2e tests), so they are upper bounds for the template:

- Build peak 3.4 GiB, full e2e peak 4.7 GiB in the workspace, `check-types` 1.7 GiB.
- Resume after `stop` or `down` about 7 s; a no-op `bun install` 0.05 s.
- Heavy commands (peak above 2 GB or long): `build`, `check`, `verify`, e2e, Playwright.
- The 6 GB workspace limit fits the e2e peak with 1.3 GB spare.

## Not run

- `scripts/dc-smoke-test`: it refuses to run while other stacks run, and a stack of another project was running.
- A third start that triggers the cap with a real stack: covered only by `scripts/dc-test` (least recently used choice).
