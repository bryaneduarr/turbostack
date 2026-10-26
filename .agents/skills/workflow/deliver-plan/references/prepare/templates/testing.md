# Testing <feature> locally

The verify job runs these in order, first in the test stage after the tests are written, then again in the final test stage on the committed tree. All work shares one PostgreSQL, one `<DB_NAME>_test` database, and ports 3100 to 3102. Run commands marked locked as `flock "$lock" <command>`, with `lock="$(git rev-parse --path-format=absolute --git-common-dir)/local-verify.lock"`. A failing command does not stop the next one unless the next one lists it under Needs.

| Order | Check | Command | Locked | Needs |
| --- | --- | --- | --- | --- |
| 1 | Rules | `bun run check:rules` | no | |
| 2 | Lint | `bunx biome ci .` | no | |
| 3 | Types | `bun run --cwd <package> check-types`, once per affected package | no | |
| 4 | Unit and route | `bun run --cwd <package> test`, once per affected package | when it starts PostgreSQL | |
| 5 | End to end | `bun run test:e2e -- --project=api --project=chromium --project=firefox --grep "<scenario>"` | yes | 3 |
| 6 | Before push | `bun run check`, then `bun run verify` | yes | |

## Scenarios

| Scenario | File | Task | Proves |
| --- | --- | --- | --- |
| <name> | `apps/client/src/e2e/<area>/<name>.e2e.ts` | t<nn> | <Done when line> |

## Allowed skips

- WebKit locally on NixOS; the Playwright config skips it and CI runs it.
