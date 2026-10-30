# publish

Edit no code. Modes: `draft`, `fixes`, `ready`. Work in the delivery worktree. In `draft` and `fixes` mode no `verify` has passed yet: where `commit-changes` relies on the last passing run, say `not yet verified; verify runs after review` instead. Commit only through `commit-changes` (small commits, one purpose each, in dependency order: packages, server, client), and never commit `.agents/`; the record job commits it at close.

## draft

After every task is done.

1. Confirm `~/worktrees/<repo>/<feature>.tasks/` holds no worktree; report any left.
2. List the changed code files: `git -C "<delivery worktree>" status --porcelain -uall -- . ':!.agents'`, keeping only the path column. Format them once: `cd "<delivery worktree>" && scripts/dc bunx biome check --write <those files>`. Report every file that sits in no review slice of `board.md`.
3. Commit every changed file outside `.agents/` through `commit-changes`. Write the whole diff to one file once and read it from there; take each commit's purpose from its tasks' Your piece lines in `board.md`.
4. `git fetch origin`. If `origin/main` has commits the branch lacks, rebase onto it with `git rebase --autostash origin/main` before the first push, and report it. On a conflict, run `git rebase --abort`, push without rebasing, and report the conflicting paths.
5. Push with `git push -u origin <feature>`.
6. Open the PR as a draft with the `pr` skill, adding `--draft` to `gh pr create`. What, How, and Why describe the whole feature from the plan. Checked says `Not run: verify runs after the review.` Count the body's words before opening; stay under the skill's limit.

Report the PR number, URL, head sha, the commits, the formatted files, and any file in no slice.

## fixes

Input: the fix reports, each with its comment ids and changed lines.

1. Commit the fixes through `commit-changes`, grouping by purpose, and push.
2. Reply `Fixed in <sha>: <what changed>` to every fixed comment and resolve its thread with the one script in [PR comments](../pr-comments.md#reply-and-resolve-many), never one comment at a time.

Report the commits, the head sha, and each comment id with its reply and resolved state.

## ready

After a passing `verify` in `full` or `failed` mode.

1. Edit the PR body with the `pr` skill: Checked lists the passing `scripts/dc bun run verify` run; add one line per unfixed should-fix finding with its comment link, inside the word limit.
2. Mark it ready: `gh pr ready <number>`. Set the labels, the author as assignee, and the review request as the `pr` skill says; when GitHub refuses a review request to the author, say so.
3. Link the PR to the thread when the harness offers a tool for it.

Report the PR URL, labels, assignee, review request result, and the should-fix lines.
