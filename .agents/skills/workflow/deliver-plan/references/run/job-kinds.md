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

Code stage. Write the Code files in `tasks/<task-id>/task.md`, all the logic the task needs to work, and nothing else. Write no test file; the test stage does. Honor its Agreed interfaces exactly, even when the other task's file does not exist yet. Write the code right the first time: follow every applicable rule as you write, because reviewers check every line later. Run no check, formatter, or test. Run only the generating commands the brief lists. Do not commit.

## test

Test stage. Write the Test files in `tasks/<task-id>/task.md`, with the cases and assertions its brief lists, against the code now on the branch. Edit no code file: when the code seems to break the plan, write the test for the planned behavior and report the mismatch under `learned`; the verify run turns it into a failure to fix. Run no check. Do not commit.

## publish

Edit nothing. Commit only through `commit-changes`: small commits, one purpose each, in dependency order (packages, server, client), with short Conventional titles. Modes:

- `open`, after the code stage: commit, push the branch `<feature>`, and open one PR from it against `main` with the `pr` skill: What, How, and Why describe the whole feature from the plan, with its labels, the author as assignee, and a review request. The user ordered the PR before any test, so skip the pr skill's check-before-push step and write the Checked section as `Not run: tests, review, and a final run follow on this branch.` Link the PR to the thread when the harness offers a tool for it.
- `update`, after the test stage, after each review round, and after each final-test fix round: commit the local changes and push. Report the new short shas and every file in `git diff --no-renames --name-only origin/main...HEAD` that is in no review slice.
- `finish`, after a green final test: replace the PR's Checked section with the commands the final verify report lists as passed, and reply to each PR comment from the test, review, and final stages with `Fixed in <short sha>.`, or with the reason no change was needed.

Report the PR URL and number, and the commits.

## verify

Edit and commit no file. Modes `test` (test stage) and `final` (final test stage). Run every command in `testing.md` in order, each through `scripts/dc` in the delivery's worktree, long ones detached with output in a log file that you poll. `scripts/dc` queues heavy and database commands itself. Continue past a failure unless the next command lists it under Needs. Include `bun run check` and `bun run verify` as the last row says. A failing command is a result to report, never a question. Use the project-context notes of the packages and tasks behind each failure to name its owning task.

- Any fail: post one PR review as the user's authenticated GitHub account through `gh api repos/{owner}/{repo}/pulls/<number>/reviews`, event `COMMENT`. Put one inline comment on each diff line or block a failure implicates (`start_line` and `line` for a block): which command fails, its first error lines, and the likely fix. Put failures with no diff line in the review body. Report `result: fail`, the comment URLs, and a numbered failure list. Each entry holds the command, the package, the first error lines (at most 15), the files it implicates, and the owning task id. Put failures that share a file in one group, so groups never share a file, and list `groups: <group -> failure numbers>`.
- All pass in `test` mode: report `result: pass`.
- All pass in `final` mode: answer every question in `questions.md` `yes` or `no` with evidence, add `examples:` with real tested examples in plain words, naming the account or data used and what happened, and report `result: pass`.

## fix

Input: one failure group and the verify comments for it. Apply the simplest change the rules allow, to that group's files only. Add or correct the test a failure implicates. Run only the one failed command, scoped to the affected package, through `scripts/dc`. Report the changed lines per file, so a review can check them. Do not commit.

## review

Input: one review slice (its files), the PR number, and a mode. Mode `full` reviews every line the PR or the local Git diff changes in the slice's files. Mode `lines` reviews only the lines changed since the sha the brief names, such as a fix round's lines. Never review or change a line outside that diff.

1. Read all five rules in `.agents/rules/` completely, and the project-context notes for the slice's owners. Read the diff with `gh pr diff <number>`, `git diff origin/main...HEAD -- <files>`, and `git diff -- <files>` for uncommitted lines.
2. Check every changed line against every applicable rule and note: structure, naming, aliases, size, contracts and validation, React and Next.js, code quality, comments, status constants, and UI tokens and components.
3. For each violation, write one inline comment on its exact line, or on its exact block with `start_line` and `line`: the rule broken, what is wrong, why, and the fix, as a `suggestion` block when it fits one place. Post them as one review through `gh api repos/{owner}/{repo}/pulls/<number>/reviews`, event `COMMENT`, because GitHub does not let an author request changes on their own PR. A violation on an uncommitted line goes in the review body with the file and line. No AI or tool attribution.
4. Apply every fix locally in the slice's files, changing only the commented lines and what the fix needs to compile, such as an import. Run no check. Do not commit.

Report `result: clean` when no violation was found and nothing was posted, or `result: fixed` with the comment URLs and, per file, the changed lines.

## record

Modes:

- `resume`: read the plan folder in the order its `README.md` gives, compare `delivery.md` with `git worktree list`, `git branch --list '<feature>'`, and `gh pr list --state open --search 'head:<feature>'`, and report the finished and unfinished stages, the tasks and slices still to do, and any blocker.
- `update`: edit `delivery.md` in the worktree to match the facts in the brief, including each `decided:` line under Decisions made during delivery.
- `close`: write each `tasks/<task-id>/<feature>-plan.md` handoff (at most 120 words), follow the `project-context` skill using the `learned` and `decided` lines in the brief, commit the docs through `commit-changes`, run `scripts/dc bun run check:rules` and `scripts/dc bunx biome ci .`, push, and then stop the delivery's stack with `scripts/dc stop`. Report the facts for the final report: PR URL and labels, test rounds with their failures and fixes, review rounds with comment counts, the final run, the `examples` from the final verify, the decisions made during delivery, and anything blocked or not tested.
