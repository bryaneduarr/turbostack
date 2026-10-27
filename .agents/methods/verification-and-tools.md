# Verification and tools

Pick the row or section that matches the task. This guide chooses methods; it adds no coding rules. Permission to act comes from the task, not from this file.

The commands below run exactly as written inside the devcontainer. On a host with Docker, prefix them with `scripts/dc`; the [run-in-container skill](../skills/workflow/run-in-container/SKILL.md) says how to tell.

## Find things

| Need | Use |
| --- | --- |
| A file whose location is unknown | Filename search inside the likely app or package |
| A literal, import, or config setting | Scoped text search, then read the match |
| A symbol's type, definition, or consumers | Read-only LSP tools; otherwise search for references |
| Code by shape, not spelling | Structural search, then read the surroundings |
| A known file or function | Read a bounded slice of it |
| Git state or a package command | Shell |
| Independent research | A subagent with one bounded question |

A missing search result calls for a narrower query or `git status` (hidden, ignored, or deleted files).

## Check by change type

| Change | Run |
| --- | --- |
| Docs or instructions | `git diff --check -- <path>`; read new files directly; confirm links resolve |
| Any code, quick structural check | `bun run check:rules` and `bunx biome ci .` |
| TypeScript in one package | `bun run --cwd <package> check-types` |
| Contracts or exports shared across packages | The same command in each consumer, such as `bun run --cwd packages/schemas check-types` then `bun run --cwd apps/server check-types` |
| Behavior fix or refactor | Scoped `git diff`, direct consumers, then the affected package checks and tests |
| Aliases, exports, or framework wiring | Also `bun run build` |
| Tables or migrations | `bun run verify` (it fails when `drizzle:generate` leaves uncommitted migrations) |
| Tests | `bun run --cwd <package> test`, or `bun run test` for every affected package |
| User flows across browser, API, and database | `bun run test:e2e` (all) or `bun run test:e2e:changed` (Chromium and API only) |
| Everything before a push | `bun run check`, then `bun run verify` |

Notes:

- Inspect `git status` before editing to separate user changes from yours.
- A passing type check proves compilation, not runtime behavior.
- Server route tests send real requests through `app.handle(new Request(...))`; HTTP clients use a local `Bun.serve`. Assert on parsed contracts, not raw text.
- The server test task starts PostgreSQL with Docker and applies migrations. Tests that write data delete their rows afterwards.
- Canvas or other browser-only rendering needs a real browser test. Propose Playwright for the owning app instead of adding it speculatively.

## Running the app

`bun run dev` opens turbo's interactive TUI and locks the terminal, so it suits humans only. Agents use the detached stack ([script](../../scripts/dev-stack.script.ts)):

| Command | Does |
| --- | --- |
| `bun run dev:start` | Runs the API and client in the background; writes plain text to `.turbo/dev-stack/dev-stack.log` and the process ID with its start time to `.turbo/dev-stack/dev-stack.pid`. Returns once API live/ready and the client home page answer 200. Exits 1 on a busy port (3000-3001), an already-running stack, an early exit, or no readiness after 240 s (the timeout also stops the stack and clears the process ID file) |
| `bun run dev:status` | Prints the process ID and the status of the readiness URLs; exits 1 unless the stack is running from its process ID file and every URL answers 200 |
| `bun run dev:stop` | Stops the whole stack (SIGTERM, then SIGKILL after 20 s); leaves PostgreSQL up. A process ID file whose process is gone, has a different start time, or holds only a number is stale: it is removed and the command reports `Not running.` without signalling anything |

- Read the log with `grep -E "Ready in|server.started|seed:dev" .turbo/dev-stack/dev-stack.log`, and `grep -iE "error|failed"` for problems.
- After `dev:stop`, confirm ports 3000-3001 are free (`ss -ltn`).
- A local PostgreSQL already listening on the database port blocks `db:up`; stop it first. See [setup pitfalls](../project-context/development/setup-pitfalls.md).
- Point a browser at this stack. Use `agent-browser` only when the user names it; a plain request for "the browser" or Chrome means the `agent-chrome` tools. Follow the [use-browser skill](../skills/testing/use-browser/SKILL.md) and the Browser automation section below.
- The e2e suite runs its own stack on ports 3100-3101. Run `bun run test:e2e` detached with output going to a log file, and poll that file with short checks instead of blocking on it. Install browsers once with `bun run test:e2e:install`. On NixOS the Playwright config builds the browser libraries with Nix itself; a launch error naming a missing library means `nix` failed, so check its warning in the log.

## Investigating without changing code

Start from the reported behavior, find the definitions, trace the consumers, and compare docs with implementation. Output: an evidence-based explanation with file references and stated uncertainties. Edits, test runs, and browser work are separate activities.

## Browser automation

A plain request for "the browser" or Chrome uses the `chrome` and `chrome-isolated` MCP servers or the `agent-chrome` command, as the [use-browser skill](../skills/testing/use-browser/SKILL.md) describes. The commands below apply only when the user names `agent-browser` or Chrome DevTools, and then only for that tool. Try localhost first, then the default gateway:

```sh
timeout 10s agent-browser connect "http://localhost:9222"
timeout 10s chrome-devtools start --browserUrl http://localhost:9222

GATEWAY_IP="$(ip route show | grep default | awk '{print $3}')"
timeout 10s agent-browser connect "http://${GATEWAY_IP}:9222"
timeout 10s chrome-devtools start --browserUrl "http://${GATEWAY_IP}:9222"
```

After connecting, `agent-browser snapshot -i` or `chrome-devtools list_pages` gives the starting context. If neither connects, report the problem and do not act without a session.

## Rules review

`bun run check:rules` and `bunx biome ci .` cover the mechanical rules in under a second each, and their messages name the fix. Judgment rules (deepest owner, forwarding wrappers) are reviewed once per PR by reading the diff against the files in `.agents/rules/`; `turbo boundaries`, `bun run check:rules`, and `bunx biome ci .` check the mechanical part. When a review finds the same mechanical problem twice, add a check to `config/rules` or a GritQL plugin in `config/biome/plugins/`.

## Delivering a pull request

1. Run `bun run check`, then `bun run verify`. Push only when both pass.
2. There is no hosted CI. Run what the change touches that `check` skips, such as `bun run test:e2e` or `bun run start:docker`, before pushing.
3. Never open a PR on top of a PR whose checks fail.

## When a test fails

1. Never rerun a failing test just to see if it passes. Each run tests one written hypothesis.
2. Read the evidence first: logs, traces, screenshots, and the Playwright report in `apps/client/playwright-report/`.
3. After two attempts that do not converge, stop and gather new evidence or build a reproduction.
4. Fix the cause. Raise timeouts or retries only when measurements show the work needs more time.
5. Log each attempt in the task handoff, one line: hypothesis, evidence, result.

## When verification is blocked

Name the obstacle (missing dependency, unavailable tool, environment, connection, or existing code error), which check it blocked, and what you could still inspect. End with a short summary: what changed, which checks passed or failed, and what remains unverified.
