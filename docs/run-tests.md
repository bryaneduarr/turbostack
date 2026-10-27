# Run tests

Unit and server tests run in each package. End-to-end tests run in real browsers against production builds.

## Unit and server tests

```sh
bun run test
```

Run it from the repository root. Server tests start PostgreSQL in Docker and recreate a separate test database first, so Docker must be running. The command ends with each package's test summary and no failed tests. Running Bun's test runner directly skips that database setup.

## End-to-end tests

Install the browsers once:

```sh
bun run test:e2e:install
```

Then run the suite from the repository root:

```sh
bun run test:e2e
```

The suite builds both apps, recreates the test database, and runs Playwright on the API, Chromium, and Firefox projects. It uses ports 3100 and 3101, so it can run while `bun run dev` is up. You should see the Playwright summary at the end with no failed tests.

Pass Playwright options after `--`, for example `bun run test:e2e -- --project=chromium` to run one browser. Open the last HTML report with `bun run --cwd apps/client test:e2e:report`.

## Every check at once

```sh
bun run verify
```

It runs the lockfile, lint, boundary, structure, migration, type, unit, build, and end-to-end (API and Chromium) checks and prints a summary. Run it before pushing; there is no hosted CI.

If a run fails because a port is in use, see [troubleshooting](troubleshooting.md).
