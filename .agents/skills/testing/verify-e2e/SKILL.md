---
name: verify-e2e
description: "Verify features end to end with the Playwright suite in apps/client: real browsers against production builds, the API, and PostgreSQL. Use when asked to verify, validate, or regression-test user flows such as sign-up, sign-in, sessions, and sign-out, or to add an end-to-end scenario for a new feature."
---

# Verify end to end

The suite is the source of truth; prefer running it over manual browser checks.
Every failing test keeps its trace, video, and screenshot, so a failed run is
its own evidence.

## Prerequisites

- `apps/server/.env` and `apps/client/.env` exist with a matching key pair from
  `bun run generate:session-keys`; Docker is running for `db:up`.
- Browsers are installed once: `bunx playwright install --with-deps chromium firefox webkit`
  from `apps/client`.
- Ports 3100 (client) and 3101 (API) are free. Dev servers on 3000/3001 are fine.
- NixOS: enable `custom.playwright.enable` in the system config; it adds the
  browser libraries to nix-ld and sets `PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS=1`.
  The config skips WebKit on NixOS (it needs older sonames); CI runs it.

## Run

```sh
bun run verify                                  # every check, e2e last
bun run test:e2e                                # every project
bun run test:e2e -- --project=api --project=chromium
bun run test:e2e:changed                        # fast loop: specs changed since origin/main, chromium
bun run test:e2e -- --grep "sign-out"           # one scenario
bun run --cwd apps/client test:e2e:report       # open the HTML report
```

`test:e2e` builds the apps and recreates the test database first. Use
`test:e2e:changed` while iterating and the full `bun run verify` before pushing;
CI runs one job per browser. Tests create
`e2e-<uuid>@example.com` accounts and delete their rows afterwards.

## Read a failure

1. Read the assertion diff in the terminal output.
2. Open `apps/client/test-results/<test>/trace.zip` with
   `bunx playwright show-trace`; it shows each `test.step`, DOM, network, and console.
3. Decide whether the app or the test is wrong. Never weaken an assertion to pass;
   report real findings such as accessibility violations with the evidence.

## Add a scenario

- Put specs under `apps/client/src/e2e/<domain>/<feature>/<scenario>.e2e.ts`
  and import `test` from `@/e2e/fixtures/test-accounts/test-accounts.fixture`.
- Drive the UI with role and label locators; name each layer check with `test.step`.
- Assert the database through `readAccountRecords` or new queries on the
  `@workspace/database` tables; call the API through `requestE2eApi` with shared
  route definitions and status constants. No casts or `any`.
- Run the new spec on at least `chromium`, then the full suite.

## Report

State which projects ran, pass/fail counts, each failure with its cause, and any
projects skipped with the reason. Type checks do not replace a run.
