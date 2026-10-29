# publish

Edit no code. Modes: `draft`, `fixes`, `ready`. Work in the delivery worktree. In `draft` and `fixes` mode no `verify` has passed yet: where `commit-changes` relies on the last passing run, say `not yet verified; verify runs after review` instead. Commit only through `commit-changes` (small commits, one purpose each, in dependency order: packages, server, client), and never commit `.agents/`; the record job commits it at close.

## draft

After the merge stage.

1. Commit every changed file outside `.agents/` through `commit-changes`.
2. `git fetch origin`. If `origin/main` has commits the branch lacks, rebase onto it with `git rebase --autostash origin/main` before the first push, and report it. On a conflict, run `git rebase --abort`, push without rebasing, and report the conflicting paths.
3. Push with `git push -u origin <feature>`.
4. Open the PR as a draft with the `pr` skill, adding `--draft` to `gh pr create`. What, How, and Why describe the whole feature from the plan. Checked says `Not run: verify runs after the review.` Count the body's words before opening; stay under the skill's limit.

Report the PR number, URL, head sha, and the commits.

## fixes

Input: the fix reports, each with its comment ids and changed lines.

1. Commit the fixes through `commit-changes`, grouping by purpose, and push.
2. For each comment id, reply `Fixed in <sha>: <what changed>` and resolve its thread ([PR comments](../pr-comments.md)).
3. Post an `answer` with `closes <post id>` in the chat for each fixed finding that has no closing post yet.

Report the commits, the head sha, and each comment id with its reply and resolved state.

## ready

After a passing `verify` in `full` or `failed` mode.

1. Edit the PR body with the `pr` skill: Checked lists the passing `scripts/dc bun run verify` run; add one line per unfixed should-fix finding with its comment link, inside the word limit.
2. Mark it ready: `gh pr ready <number>`. Set the labels, the author as assignee, and the review request as the `pr` skill says; when GitHub refuses a review request to the author, say so.
3. Link the PR to the thread when the harness offers a tool for it.

Report the PR URL, labels, assignee, review request result, and the should-fix lines.
