# Run tests

Browser tests are the only tests. They run in real browsers against production builds, and `verify` runs them together with the other checks.

## Every check at once

```sh
bun run verify
```

It runs, in order and stopping at the first failure: the lockfile check, lint, boundaries, structure rules, the Compose file, migrations against the tables, type checks and builds, and the browser tests for the API and Chromium. It prints each step's time and a summary. Run it once the code is finished; there is no hosted CI.

After a failure, fix the cause and run:

```sh
bun run verify --failed
```

It repeats the fast checks and the builds. It reruns only the browser tests that failed when the last failure was in them, and every browser test when an earlier step failed.

## Browser tests

Install the browsers once:

```sh
bun run test:e2e:install
```

Then run the suite from the repository root:

```sh
bun run test:e2e
```

The suite builds both apps, recreates the test database, and runs Playwright on every project: API, Chromium, and Firefox. The everyday check, `bun run verify`, runs only the API and Chromium projects; run Firefox only when you need it. It uses ports 3100 and 3101, so it can run while `bun run dev` is up. Pass Playwright options after `--`, for example `bun run test:e2e -- --project=chromium` to run one browser. Open the last HTML report with `bun run --cwd apps/client test:e2e:report`.

In the [dev container](devcontainer.md), run `scripts/dc bun run verify` instead. The stack installs Chromium and Firefox itself, so skip the install step, and WebKit is not run there.

If a run fails because a port is in use, see [troubleshooting](troubleshooting.md).
