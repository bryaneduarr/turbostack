# Job kinds

Read only your kind's section, after the [subagent rules](subagent-rules.md).

## setup

Create the one worktree and branch, start its stack, and report the absolute worktree path.

```sh
repo="$(dirname "$(git rev-parse --path-format=absolute --git-common-dir)")"
root="$HOME/worktrees/$(basename "$repo")"
mkdir -p "$root"
git -C "$repo" worktree add -b "<feature>" "$root/<feature>" main
cd "$root/<feature>" && scripts/dc bun --version > "$root/<feature>-setup.log" 2>&1 &
```

The first `scripts/dc` call builds or reuses the shared image, starts the stack, and installs packages, which can take minutes. Start it detached as above and poll the log with short checks until the version prints; never block on it. Install nothing on the host and copy no `.env` file: the stack creates them. Reuse an existing worktree when resuming. If Docker is missing, report `blocked`.

## implement

Code stage. Write the Code files in `tasks/<task-id>/task.md`, all the logic the task needs to work, plus its browser scenario when the task lists one, and nothing else. Honor the Agreed interfaces exactly, even when the other task's file does not exist yet. Write the code right the first time: follow every applicable rule as you write, because reviewers check every line later. Run no check, formatter, or test. Run only the generating commands the brief lists. Do not commit.

## review

Input: one review slice (its files). Review every line the local Git diff changes in the slice's files, and never a line outside that diff. One round per slice: your report covers your own fixes, so no second review follows.

The verify run checks these by tool in seconds, so spend no time on them: formatting, import order, file and folder names, placement, file length, folder size, alias imports, comment and suppression style, interface and schema field docs, route definitions, optional chaining, zero fallbacks, dependencies, unit test files, type errors, direct API requests, environment reads, hard-coded HTTP statuses, double type assertions, loose Zod schemas, manual memoization, and form event types.

1. Read all five rules in `.agents/rules/` completely, and the project-context notes for the slice's owners. Read the diff in one command: `git diff main -- <files>; git diff -- <files>`.
2. Judge every changed line on what only a reader can see: it does what `task.md` and the plan ask, its logic and edge cases are right, input is validated at its boundary, the server and client split, Server Actions, and caching follow the rules, permissions are checked, status values use constants, UI uses tokens and existing components, existing helpers are reused, names and comments say what and why, and browser scenarios cover the task and follow the Tests rules.
3. Apply every fix locally in the slice's files, changing only the flagged lines and what the fix needs to compile, such as an import. Then read your fixed lines once more against the same rules.
4. Run `scripts/dc bunx biome check --write <the slice's changed files>` once, so formatting and import order never fail the verify. Run no other check. Do not commit and post nothing outside the worktree.

Report `result: clean` when no violation was found, or `result: fixed` with, per file, the changed lines and the rule each fix answers.

## verify

Edit and commit no file. Modes `full` (the one run after review) and `failed` (the fix loop). Run `scripts/dc bun run verify` in `full` mode, or `scripts/dc bun run verify --failed` in `failed` mode, in the delivery's worktree. Send its output to a log file and wait for it with your shell tool's longest timeout (a full run takes about a minute); if the tool cannot wait that long, run it detached and check the log every 30 seconds. The run stops at the first failing step; a failing step is a result to report, never a question.

- Any fail: report `result: fail`, the failing step name, its first error lines (at most 15), the files it implicates, and the owning task id. Use the project-context notes of the packages and tasks behind the failure to name the owner. Put failures that share a file in one group, and list `groups: <group -> failure numbers>`.
- Pass: report `result: pass`, the mode, and the step times the summary prints.
- Pass in either mode, once the fix loop ends: answer every question in `questions.md` `yes` or `no` with evidence, add `examples:` with real tested examples in plain words, naming the account or data used and what happened, and report `result: pass`.

The run writes `.turbo/verify/last-result.json`; never edit that file.

## fix

Input: one failure group and the verify output for it. Apply the simplest change the rules allow, to that group's files only. Run only the one failed command, scoped to the affected package, through `scripts/dc`, when the fix needs it to compile; otherwise run no check. Report the changed lines per file, so the next `verify --failed` run can be checked against them. Do not commit.

## publish

Edit nothing. Start once, after a `verify` in `full` or `failed` mode passes. Commit only through `commit-changes`: small commits, one purpose each, in dependency order (packages, server, client), with short Conventional titles. Then push the branch `<feature>` and open one PR from it against `main` with the `pr` skill: What, How, and Why describe the whole feature from the plan, the Checked section lists the passing `scripts/dc bun run verify` run, with its labels, the author as assignee, and a review request. Link the PR to the thread when the harness offers a tool for it.

Report the PR URL and number, and the commits.

## record

Modes:

- `resume`: read the plan folder in the order its `README.md` gives, compare `delivery.md` with `git worktree list`, `git branch --list '<feature>'`, and `gh pr list --state open --search 'head:<feature>'`, and report the finished and unfinished stages, the tasks and slices still to do, and any blocker.
- `update`: edit `delivery.md` in the worktree to match the facts in the brief, including each `decided:` line under Decisions made during delivery.
- `close`: write each `tasks/<task-id>/<feature>-plan.md` handoff (at most 120 words), follow the `project-context` skill using the `learned` and `decided` lines in the brief, commit the docs through `commit-changes` (it relies on the last passing `verify`), push, and then stop the delivery's stack with `scripts/dc stop`. Report the facts for the final report: PR URL and labels, review rounds with their fixed lines, verify runs with their failing steps and fixes, the `examples` from the final verify, the decisions made during delivery, and anything blocked or not tested.
