# record

Edits `.agents/` only. Modes: `resume`, `update`, `close`. Only one record job runs at a time.

## resume

Read the plan folder in the order its `README.md` gives. Compare `board.md` and `chat.md` with `git worktree list`, `git branch --list '<feature>'`, `git -C <delivery worktree> status --short`, and `gh pr list --state all --search 'head:<feature>'`. Report the finished and unfinished stages, the tasks still to merge, the reviews and comments still open, the open chat posts, and any blocker.

## update

Fold `board-log.md` into the tables of `board.md` to match the facts in the brief: task, review, and stage status; each `decided:` line under Decisions made during delivery; and every chat post without a `closes` post under Open chat posts. When the brief names files that sit in no slice, add a slice `r<nn>` for them and report its id. Never edit `board-log.md` or `chat.md`.

## close

1. Write each `tasks/<task-id>/<feature>-plan.md` handoff (at most 120 words).
2. Fill `outcomes.md` ([proof and lessons](../../learn/proof-and-lessons.md)): each Done when line with its proof level and evidence, each prediction against what happened, what went well, what went wrong with its cause, and the success/failure checks only the user can answer.
3. Write the lessons the outcomes support into `.agents/project-context/lessons/`, one line each, in the format and limits that file gives.
4. Follow the `project-context` skill with the `learned` and `decided` lines in the brief. Check every sha you record with `git cat-file -t`.
5. Answer the questions in `questions.md` assigned to close.
6. As a separate step after that skill, commit `.agents/` through `commit-changes` (it relies on the last passing `verify`) and push.
7. Remove any task worktree left under `~/worktrees/<repo>/<feature>.tasks/` with `git worktree remove --force`, then stop the delivery's stack with `cd "<delivery worktree>" && scripts/dc stop`.

Report the facts for the final report: PR URL and labels, review and audit findings with their fixes, verify runs with their failing steps and fixes, the `examples` from the final verify, the decisions made during delivery, the scorecard in one line, the lessons written, the success/failure checks, the material for What you learned, and anything blocked or not tested.
