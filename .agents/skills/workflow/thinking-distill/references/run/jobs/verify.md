# verify

Edit and commit no file. Modes: `full` (the first run, after the review fixes) and `failed` (the fix loop). From the delivery worktree (`cd "<delivery worktree>"` first), run `scripts/dc bun run verify` in `full` mode or `scripts/dc bun run verify --failed` in `failed` mode. Send the output to a log file and wait for it with your shell tool's longest timeout (a full run takes about a minute); if the tool cannot wait that long, run it detached and check the log every 30 seconds. The run stops at the first failing step; a failing step is a result to report, never a question.

- **Fail:** report `result: fail`, the failing step, its first error lines (at most 15), the files it implicates, and the owning task id from the board and the project-context notes. Put failures that share a file in one group and list `groups: <group -> failure numbers>`. For each failure with a `path:line` in the PR's diff, comment on that line ([PR comments](../pr-comments.md)) as `must-fix · verify`.
- **Pass:** report `result: pass`, the mode, and the step times the summary prints.
- **Pass, once the fix loop ends:** answer the questions in `questions.md` that it assigns to verify, `yes` or `no` with evidence, add `examples:` with real tested examples in plain words (the account or data used and what happened), and give the proof level of each Done when line ([proof and lessons](../../learn/proof-and-lessons.md)).

Append `verify pass` or `verify fail` to `board-log.md`. The run writes `.turbo/verify/last-result.json`; never edit that file.
