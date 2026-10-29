# fix

Modes: `review` (one slice's must-fix PR comments plus the open chat findings on its files), `failure` (one verify failure group), `diagnose` (a failure that survived 3 fix rounds). Work in the delivery worktree (`cd "<delivery worktree>"` first), on the files of your input only. Do not commit; the publish job does.

## review and failure

1. Re-read each file right before editing it. Apply the simplest change the rules allow for each comment or failure, changing only the flagged lines and what the fix needs to compile, such as an import.
2. Reread your fixed lines against the comment, the rule or question behind it, and the plan.
3. Run `scripts/dc bunx biome check --write <your changed files>` once. In `failure` mode, also run the one failed command, scoped to the affected package, when the fix needs it to compile; otherwise run no check.
4. Post an `answer` with `closes <post id>` for each finding you fixed, and append `fix-<slice or group> fixed` to `board-log.md`.

## diagnose

The same failure survived 3 rounds, so the earlier approach is wrong. Read the earlier fix reports in your Facts, gather new evidence (logs, the failing test's trace, the code path end to end), write the cause in one sentence, and fix it a different way. Report the cause, why the earlier fixes missed it, and the new approach under `learned`.

Report, per comment id or failure, the changed lines per file, so the publish reply and the next `verify --failed` can be checked against them.
