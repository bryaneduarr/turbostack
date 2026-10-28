# Fast checks: browser tests only, one check at the end

Twin plan: `~/worktrees/veyra/fast-checks/.agents/plans/fast-checks/plan.md` (Veyra, same changes plus its GitHub CI file). Rules and skills must end up identical in both projects apart from project names. This project goes first; Veyra reuses its wording.

## 1. Request

Date: 2026-10-28 UTC. Revision: `3e0d096` (`origin/main`). Branch: `chore/fast-checks`. Work tree: `~/worktrees/turbostack/fast-checks`.

The request was made in the Veyra session; the user's words:

> "I need you to help me make this project faster [...] I need to remove some of the tests to make the CI, tests faster and only leave the real important stuff like the browser testing that is the only thing that we care about, because we are now on a Ubuntu 26.04 WSL environment we have more freedom [...] make the process of checking faster because that takes to long on checking, we need to make it faster."

- "the code is done, but then the revision with this setups lasts so much and I will only want like one full revision that is fast and tells me that everything is okay."
- "everything should be those browsers tests unless the user in another prompts says other thing."
- "only chromium tests for now, but we can leave the other browser tests, but do not test them unless the user asks for them."
- "if the user asked for an implementation [...] they will make that until it is done ONLY in code, then it will come the commands/scripts/checks/reviewers [...] so it is faster and we do not waste time on making checks on every file when is written."
- "plan the best approach so it is fast in the fix." / "try to run the most amount you can without hitting the limit."
- "make the same modifications for the project of ~/turbostack so they are the same and we keep equal rules for this two projects [...] each having its own branch and worktree." / "Assign haiku 5.5 high subagent workers in the plan." / "I will not have PR just the branch."

## 2. Goal

The user wants one fast, complete check that runs once, after the code is written, and says "everything is OK", with the same rules as Veyra. Today `check` and `verify` overlap, 35 unit test files run on every check, and agents check while they write. The result: only Playwright tests remain (API project plus Chromium by default), one `verify` command stops at the first failure, a fix rerun repeats only what failed, and agents write code first and check last. Beyond the request: no duplicate runs, a set agent work order, a guard against unit tests returning, and rules kept equal with Veyra. Turbostack has no GitHub CI file, so there is no CI step.

## 3. Done when

1. No `*.test.ts`, `*.test.tsx`, or `*.spec.ts` file is tracked; no package has a `test` or `test:watch` script; no `turbo.json` has a `test` task; `apps/server/bunfig.toml` is gone.
2. `scripts/dc bun run check:rules` fails on a temporary `config/rules/src/x.test.ts` with a message saying to write a browser test (`*.e2e.ts`), and passes once it is removed.
3. `scripts/dc bun run verify` runs, in order and stopping at the first failure: lockfile, Biome, boundaries, project rules, compose config, migrations match, type checks, builds, Playwright `api` + `chromium`. It passes, and prints each step's time.
4. `scripts/dc bun run verify --failed` reruns Biome, boundaries, rules, type checks, builds (Turbo cache skips unchanged packages), and only the Playwright tests that failed last time.
5. `scripts/dc bun run test:e2e -- --project=firefox` still works.
6. Playwright `workers` is the measured fastest safe value, with the measurements written down.
7. `bun run check` is gone. Every reference to it, `bun run test`, unit tests, or mid-work checks in `AGENTS.md`, `.agents/rules/`, `.agents/methods/`, `.agents/skills/`, `README.md`, and `docs/` matches the new flow.
8. `.agents/rules/` and `.agents/skills/` diff against Veyra shows only project-name and project-only differences.
9. Project-context notes are updated; all work is committed on `chore/fast-checks`; no pull request is opened.

## 4. Decisions

- **Where it hurts:** local checks after the code is done. One full, fast revision replaces `check` + `verify`.
- **Unit tests:** delete all 35 (apps, packages, `config/rules`, `config/setup`). Browser tests are the only tests unless a later prompt says otherwise. The user accepted losing server checks such as database grants. Rejected: keeping a subset; keeping files but not running them.
- **Browsers:** `api` + `chromium` by default. Firefox and WebKit projects stay in `apps/client/playwright.config.ts` and run only when the user asks.
- **Fast static checks stay** (Biome, boundaries, rules, compose, migrations, types, builds), merged with the browser run into one `verify`.
- **Environment.** All building, installing, testing, and running happens in the devcontainer stack of the work tree, through `scripts/dc`. Nothing is installed or run on the host; only git, `gh`, Docker, the agent tool, and the user's browser stay there. If Docker is missing, the checks are reported as blocked and never run on the host. Stacks are managed automatically through `scripts/dc` (stop idle ones, respect the cap, wait for a busy slot) and the user is never asked about resources. Rejected: running on WSL directly; a self-hosted CI runner.
- **API project:** the Playwright `api` tests stay in `verify`.
- **Agent order:** code only until the work is complete → review by reading the diff → one `verify` → fix loop with `verify --failed`. No checks, tests, or builds while writing code.
- **Failures:** `verify` stops at the first failing step. The fix loop reruns only failed browser tests; the user accepted that a fix could break another test unseen until the next full run.
- **Workers:** measure and raise Playwright `workers` as high as memory safely allows.
- **Guard:** `check:rules` rejects new unit test files.
- **Container tool tests** `scripts/dc-test` and `scripts/dc-smoke-test` stay: they are not in `verify`.
- **Test database stays:** e2e uses the `_test` database, prepared by `api-server#db:test:prepare` (`apps/client/turbo.json`). Keep `apps/server/src/db/testing/test-database/prepare-test-database.script.ts` and the `@workspace/database/config/test-database/test-database-name.service` module, and the `db:test:prepare` task in `apps/server/turbo.json`.
- **Workers (agents):** every child is `delegate_task` with `target: { providerInstanceId: "pi", model: "claude-bridge/claude-haiku-5-5", options: { thinking: "high" } }` (Claude Haiku 5.5, high thinking), told to work only in `~/worktrees/turbostack/fast-checks`.
- **Machine sharing:** code may be written in both projects at once; memory measurement and full checks run one project at a time.
- **Timing:** starts as soon as the user says yes; Veyra waits for the user's go.
- **Delivery:** commits on `chore/fast-checks` through the commit-changes skill; no PR, no push unless asked.
- **Baseline:** no separate "before" run; `verify` prints step times for comparison.

## 5. Scope

In: deleting unit tests and test-only helpers, scripts, tasks, configs, and dependencies; the rules guard; `verify` and `verify --failed`; worker measurement; rules, skills, methods, `AGENTS.md`, `README.md`, `docs/`, and project-context notes.

Out: new browser tests to replace coverage; changing `scripts/dc`; app behavior; old plan folders under `.agents/plans/`.

Additions: block new unit tests (now); more workers (now); browser tests for lost coverage (skipped unless asked).

## 6. Risks

- **Lost coverage** (grants, error handler, health, profiles): accepted by the user.
- **Fix rerun misses a newly broken test:** accepted; the next full `verify` catches it.
- **More workers exhaust memory:** pick the fastest value whose workspace peak stays at or below 80 % of the container limit with zero failures.
- **Deleting a helper that e2e or runtime imports:** delete only files whose importers are all test files; `verify` builds every app.
- **Template users lose example unit tests:** accepted; the template now shows browser tests only.
- **Rules and skills diverge from Veyra:** step 10 diffs them.

## 7. Steps

Workers: W1 implements (Haiku 5.5 high), W2 reviews by reading (a new Haiku 5.5 high delegate), W3 runs checks and fixes (Haiku 5.5 high). Steps 1 to 6 are code-only: no `bun`, `turbo`, tests, or builds until step 8.

0. **Done 2026-10-28:** work tree `~/worktrees/turbostack/fast-checks` on `chore/fast-checks` from `3e0d096`; this plan committed. On the user's yes, start the stack detached: `scripts/dc bun --version > /tmp/turbostack-fast-checks-dc.log 2>&1 &`, polling the log.
1. **W1, delete unit tests.** Remove every tracked `*.test.ts`, `*.test.tsx`, `*.spec.ts`. Remove `apps/server/bunfig.toml`, `apps/server/src/db/testing/test-database/use-test-database.config.ts`, and files whose importers are only deleted tests (for example `apps/server/src/db/testing/fixtures/` and `grants/expectations/`). Remove the `test` task from `apps/server/turbo.json`. For `apps/client/tsconfig.test.json`: delete it and the `-p tsconfig.test.json` part of `check-types` only if it covers nothing but unit tests; otherwise keep what covers `src/e2e`. Verify by reading: `git ls-files | grep -E '\.(test|spec)\.tsx?$'` is empty, and no remaining file imports a removed path.
2. **W1, scripts and tasks.** Remove `test` and `test:watch` from every `package.json` and the `test` task from `turbo.json`. Root `package.json`: remove `check`, `test`, `test:e2e:changed`; keep `test:e2e` and `test:e2e:install`. Remove dev dependencies used only by deleted tests.
3. **W1, rules guard.** Replace `config/rules/src/checks/testing/test-runner.check.ts` with a check that fails on any tracked `*.test.ts`, `*.test.tsx`, or `*.spec.ts` with: "Unit tests are not used; write a browser test (`*.e2e.ts`) instead." Update `config/rules/src/config/naming/file-roles.config.ts` and the check registry.
4. **W1, one verify command.** Rewrite `scripts/verify-workspace.script.ts`: steps in the order of Done-when 3, stopping at the first failure with a timed summary; browser step `bunx turbo run test:e2e -- --project=api --project=chromium`. Add `--failed`: Biome, boundaries, rules, `turbo run check-types build`, then `bunx turbo run test:e2e -- --project=api --project=chromium --last-failed`. At most 200 lines per file.
5. **W1, workers setting.** In `apps/client/playwright.config.ts`, read workers from `PLAYWRIGHT_WORKERS` (passed through by Turbo) with 3 as the default until step 9.
6. **W1, instructions.** Same wording as Veyra's plan step 7: `.agents/rules/code-quality.md`, `AGENTS.md`, `.agents/methods/verification-and-tools.md`, `.agents/skills/workflow/deliver-plan/`, `.agents/skills/workflow/run-in-container/`, `.agents/skills/workflow/thinking-distill/references/environment.md`, `.agents/skills/workflow/update-dependencies/`, `.agents/skills/testing/verify-e2e/`, `.agents/skills/github/commit-changes/SKILL.md` (no test run at commit time; rely on the last passing `verify`), `.agents/skills/github/pr/`, `README.md`, and `docs/` (especially `docs/run-tests.md` and `docs/get-started.md`). Find spots with a search for `bun run check\b|bun run test\b|check-types test|bun:test|\.test\.ts|affected packages' tests` outside `.agents/plans/` and `.agents/project-context/`.
7. **W2, review by reading.** A new delegate reads the full diff against `.agents/rules/*.md` and this plan, and reports findings. W1 (or the orchestrator, for small ones) fixes them. Still no commands.
8. **W3, one full check.** No other project's check runs at the same time. `scripts/dc bun install` (lockfile), then `scripts/dc bun run verify > /tmp/turbostack-verify.log 2>&1 &`, polling the log. On failure: fix the cause, then `scripts/dc bun run verify --failed` until it passes. Also check Done-when 2 with a temporary file and Done-when 5 once.
9. **W3, measure workers.** With no other e2e run: `PLAYWRIGHT_WORKERS=N scripts/dc bun run test:e2e -- --project=chromium` for N = 4, 6, 8, 10, 12 until a run fails or memory passes the limit, sampling `docker stats --no-stream` on the workspace container. Record wall time, peak memory, and failures per N in `.agents/plans/fast-checks/measurements.md`. Set the default to the fastest safe N, then `scripts/dc bun run verify --failed`. With only 4 e2e files the gain may be small; Veyra measures its own value.
10. **Equal rules.** When Veyra reaches its step 11, `diff -r` `.agents/rules`, `.agents/skills`, and `.agents/methods` between both work trees; only project names and project-only items may differ.
11. **Record and commit.** Follow the project-context skill (`development/commands.md`, `development/e2e-tests.md`, `development/rule-enforcement.md`, `start-here.md`), commit through the commit-changes skill on `chore/fast-checks`, and stop the stack with `scripts/dc stop`. No PR, no push.

## 8. Status

Delivered 2026-10-28 on `chore/fast-checks`, then merged into `main` with the branch deleted, as the user asked. Checked: `scripts/dc bun run verify` passed 8/8, `verify --failed` passed, the unit-test guard failed on a throwaway `x.test.ts`, and Firefox passed 5/5. Measurements: [measurements.md](measurements.md).

Changes from the steps, decided during delivery:

- Step 4: `--failed` reruns a lockfile, compose, or migrations step unless it passed last time (the record keeps `passedSteps`). It adds `--last-failed` only when the browser step failed; otherwise it runs the full browser step, so a run that stopped early never skips browser tests.
- Step 5: no `PLAYWRIGHT_WORKERS` variable. Playwright's own `--workers=N` flag covers measurement and one-off runs, so the config keeps a fixed, measured value (3; with 7 tests more workers gave no gain).
