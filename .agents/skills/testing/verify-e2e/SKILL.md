---
name: verify-e2e
description: "Verify features end to end with the Playwright suite in apps/client: real browsers against production builds, the API, and PostgreSQL. Use when asked to verify, validate, or regression-test user flows such as creating and editing records, or to add an end-to-end scenario for a new feature."
---

# Verify end to end

The suite is the source of truth; prefer running it over manual browser checks.
Every failing test keeps its trace, video, and screenshot, so a failed run is
its own evidence.

## Prerequisites

- Docker is running. Everything runs through `scripts/dc` in this work tree's
  stack ([run-in-container skill](../../workflow/run-in-container/SKILL.md)); nothing
  runs on the host. Without Docker, report the run as blocked.
- The stack provides the `.env` files, PostgreSQL, the Playwright libraries, and
  Chromium and Firefox. Install nothing by hand.
- `scripts/dc` runs e2e commands one at a time per stack, so ports 3100 and 3101
  are never shared. The config skips WebKit in the container.

## Run

```sh
scripts/dc bun run verify                       # every check; browser tests (api, chromium) last
scripts/dc bun run verify --failed              # fix loop: failed browser tests and the checks before them
scripts/dc bun run test:e2e -- --project=firefox # other browsers, only when the user asks
scripts/dc bun run test:e2e -- --project=chromium --grep "profile" # one scenario
```

Send the output to a log file; a full `verify` takes about a minute.
The HTML report is written to `apps/client/playwright-report/` in the shared
folder.

`verify` builds the apps and recreates the test database first, and it runs the
browser tests for `api` and `chromium` by default.
Tests use unique names, and the test database starts empty on every run.

## Read a failure

1. Read the assertion diff in the terminal output.
2. Read the screenshot and video under `apps/client/test-results/<test>/`, and
   the trace (each `test.step`, DOM, network, console) in the HTML report. The
   container has no screen, so open the report from the host only when needed.
3. Decide whether the app or the test is wrong. Never weaken an assertion to pass;
   report real findings such as accessibility violations with the evidence.

## Add a scenario

- Put browser specs under `apps/client/src/e2e/<domain>/<feature>/<scenario>.e2e.ts`
  and API contract specs under `apps/client/src/e2e/api-contracts/`, importing
  `test` and `expect` from `@playwright/test`.
- Drive the UI with role and label locators; name each layer check with `test.step`.
- Keep it fast and independent, as the Tests rules in `.agents/rules/code-quality.md`
  say: a session from the API when signing in is only setup, no waits on the real
  clock, and only the scenario's own records in shared lists.
- Call the API through `requestE2eApi` with shared route definitions and
  `requireApiSuccess`, and use the status constants. Query the database only
  through `@workspace/database` tables when a check needs it. No casts or `any`.
- Do not run the new spec while writing code. The one `verify` run covers it. To
  debug a failing scenario, run it alone with `--project=chromium --grep`.

## Report

State which projects ran, pass/fail counts, each failure with its cause, and any
projects skipped with the reason. Type checks do not replace a run.
