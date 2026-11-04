# Verification and tools

Pick the row or section that matches the task. This guide chooses methods; it adds no coding rules. Permission to act comes from the task, not from this file.

Run every command below in the work tree's devcontainer stack: `bun run <script>` forwards itself there, and anything else goes through `scripts/dc` (inside the container, run it as written). Nothing runs on the host; without Docker, report the check as blocked. The [run-in-container skill](../skills/workflow/run-in-container/SKILL.md) says how to tell where you are.

## Find things

| Need | Use |
| --- | --- |
| A file whose location is unknown | Filename search inside the likely app or package |
| A literal, import, or config setting | Scoped text search, then read the match |
| A symbol's type, definition, or consumers | Read-only LSP tools; otherwise search for references |
| Code by shape, not spelling | Structural search, then read the surroundings |
| A known file or function | Read a bounded slice of it |
| Git state or a package command | Shell |

A missing search result calls for a narrower query or `git status` (hidden, ignored, or deleted files).

## Check by change type

| Change | Run |
| --- | --- |
| Docs or instructions | `git diff --check -- <path>`; read new files directly; confirm links resolve |
| Code, any size | Nothing while writing. When the code is complete, review the scoped diff, then run `bun run verify` once |
| Behavior fix or refactor | Scoped `git diff` and direct consumers while reviewing; the same `verify` run covers them |
| Tables or migrations | `verify` (it fails when `drizzle:generate` leaves uncommitted migrations) |
| User flows, validation, permissions, and bug fixes | A Playwright scenario under `apps/client/src/e2e/`, run by `verify` (`api` and `chromium`) |
| Firefox or WebKit | `scripts/dc bun run test:e2e -- --project=firefox`, only when the user asks |
| After a failed `verify` | Fix the cause, then `bun run verify --failed` |

Notes:

- Inspect `git status` before editing to separate user changes from yours.
- A passing type check proves compilation, not runtime behavior.
- The e2e suite uses the test database that `api-server#db:test:prepare` prepares.
- Canvas or other browser-only rendering needs a real browser test. Propose Playwright for the owning app instead of adding it speculatively.

## Running the app

Starting, checking, restarting, and stopping the dev server, finding its URLs and logs, and running several work trees at once follow the [dev-server skill](../skills/workflow/dev-server/SKILL.md). The e2e suite runs its own servers on ports 3100-3101 inside the stack; run `bun run test:e2e` detached with output going to a log file, and poll that file with short checks instead of blocking on it. The stack installs Chromium and Firefox itself; WebKit is skipped in the container. Point `agent-browser` at the stack only when the user asks for the browser, following the [agent-browser skill](../skills/testing/agent-browser/SKILL.md).

## Investigating without changing code

Start from the reported behavior, find the definitions, trace the consumers, and compare docs with implementation. Output: an evidence-based explanation with file references and stated uncertainties. Edits, test runs, and browser work are separate activities.

## Browser automation

A request for "the browser" or Chrome uses `agent-browser`, as its skill describes. Load the guide with `agent-browser skills get core`. Each agent runs in its own session, so parallel agents never share a browser:

```sh
S=$(agent-browser session id --scope worktree --prefix task)
agent-browser --session "$S" open "<url from scripts/dc ports>"
agent-browser --session "$S" snapshot -i
agent-browser --session "$S" close
```

If the browser does not launch, run `agent-browser doctor`, report the problem, and do not act without a session.

## Rules review

`bun run check:rules` and `bunx biome ci .` cover the mechanical rules, and their messages name the fix. Judgment rules (deepest owner, forwarding wrappers) are reviewed by reading the diff against the files in `.agents/rules/` before the one `verify` run; `turbo boundaries`, `bun run check:rules`, and `bunx biome ci .` check the mechanical part, and `verify` runs them. When a review finds the same mechanical problem twice, add a check to `config/rules` or a GritQL plugin in `config/biome/plugins/`.

## Delivering a pull request

1. Pass `scripts/dc bun run verify` (or `scripts/dc bun run verify --failed` after a fix). Push only when it passes.
2. There is no hosted CI. Run what the change touches that `verify` skips, such as `bun run start:docker`, before pushing.
3. Never open a PR on top of a PR whose checks fail.

## When a test fails

1. Never rerun a failing test just to see if it passes. Each run tests one written hypothesis.
2. Read the evidence first: logs, traces, screenshots, and the Playwright report in `apps/client/playwright-report/`.
3. After two attempts that do not converge, stop and gather new evidence or build a reproduction.
4. Fix the cause. Raise timeouts or retries only when measurements show the work needs more time.

## When verification is blocked

Name the obstacle (missing dependency, unavailable tool, environment, connection, or existing code error), which check it blocked, and what you could still inspect. End with a short summary: what changed, which checks passed or failed, and what remains unverified.
