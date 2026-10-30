# fix

Modes: `review` (one slice's must-fix PR comments plus the open chat findings on its files), `failure` (one verify failure group), `directed` (apply an advise job's directions, given as Facts). Work in the delivery worktree (`cd "<delivery worktree>"` first), on the files of your input only. Do not commit; the publish job does.

## review and failure

1. Read every file you fix in one call right before editing. Apply the simplest change the rules allow for each comment or failure, changing only the flagged lines and what the fix needs to compile, such as an import.
2. Reread your fixed lines against the comment, the rule or question behind it, and the plan.
3. Run `scripts/dc bunx biome check --write <your changed files>` once. In `failure` mode, also run the one failed command, scoped to the affected package, when the fix needs it to compile; otherwise run no check.
4. Post an `answer` with `closes <post id>` for each chat finding you fixed (PR comments are closed by the publish job), and append `fix-<slice or group> fixed` to `board-log.md`.

## directed

The brain's [advise](advise.md) job decided what to change. Apply its directions exactly, run its proof once when it is a check you may run, and report each direction as done or not done and why. Put its cause under `learned`.

Report, per comment id or failure, the changed lines per file, so the publish reply and the next `verify --failed` can be checked against them.
