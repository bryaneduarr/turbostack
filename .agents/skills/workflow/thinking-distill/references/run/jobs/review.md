# review

Modes: `rules` (one review slice), and `plan`, `reliability`, `security` (the whole change). Reviewers comment only and edit no file; fix jobs apply the findings. One round.

1. Read your [question set](../reviewers/) for your mode, and what the subagent rules list for your mode.
2. Read the change in one command from the delivery worktree: `git diff origin/main...HEAD -- <slice files>` in `rules` mode, or `git diff origin/main...HEAD -- . ':!.agents'` otherwise. Judge only changed lines; read surrounding code only to judge them.
3. Read the chat for findings already posted on your files, so you never post one twice.
4. Answer every question in your set for the change.
5. For each finding, comment on its PR line ([PR comments](../pr-comments.md)) and post a `finding` in the chat that links the comment and mentions the task that owns the file.
6. Append `<reviewer id> clean` or `<reviewer id> findings` to `board-log.md`.

Severity:

- `rules` and `plan` findings are always must-fix; the rules are mandatory and the plan is approved.
- `reliability` and `security`: must-fix when the problem can lose or leak data, let someone past a permission or a step, break under normal traffic, or leave production unable to see or undo it. Otherwise should-fix.

Report `result: clean` or `result: findings`, then one line per finding: severity, `path:line`, comment id, chat post id. Add `answers:`, one line per question group: `ok`, `n/a`, or the finding ids.
