# record

Edits `.agents/` only. Modes: `resume` and `close`. No record job runs between stages: the orchestrator keeps the state, and every job's `board-log.md` line keeps it on disk.

## resume

Read the plan folder in the order its `README.md` gives, then `board-log.md`, the newest truth. Compare them with `git worktree list`, `git branch --list '<feature>'`, `git -C <delivery worktree> status --short`, and `gh pr list --state all --search 'head:<feature>'`, in one shell call. Report the finished and unfinished stages, the tasks still to do, the reviews and comments still open, the open chat asks, and any blocker.

## close

1. Fold `board-log.md` into the tables of `board.md`: task, review, and stage status; each `decided:` line from the brief under Decisions made during delivery; and every `ask` or `finding` without a `closes` under Open chat posts. Never edit `board-log.md` or `chat.md`.
2. Write each `tasks/<task-id>/<feature>-plan.md` handoff (at most 120 words).
3. Fill `outcomes.md` ([proof and lessons](../../learn/proof-and-lessons.md)): each Done when line with its proof level and evidence, each prediction against what happened (minutes and jobs included), what went well, what went wrong with its cause, and the success/failure checks only the user can answer.
4. Write the lessons the outcomes support into `.agents/project-context/lessons/`, one line each, in the format and limits that file gives. For every finding reviewers named as tool-catchable, add one line to What went wrong proposing the check in `config/rules` or `config/biome/plugins/` ([verification guide](../../../../../../methods/verification-and-tools.md#rules-review)).
5. Follow the `project-context` skill with the `learned` and `decided` lines in the brief. Check every sha you record with `git cat-file -t`.
6. Answer the questions in `questions.md` assigned to close.
7. As a separate step after that skill, commit `.agents/` through `commit-changes` (it relies on the last passing `verify`) and push.
8. Remove any task worktree left under `~/worktrees/<repo>/<feature>.tasks/` with `git worktree remove --force`, then stop the delivery's stack with `cd "<delivery worktree>" && scripts/dc stop`.

Report the facts for the final report: PR URL and labels, review and audit findings with their fixes, verify runs with their failing steps and fixes, the `examples` from the final verify, the decisions made during delivery, the scorecard in one line, the lessons written, the success/failure checks, the material for What you learned, and anything blocked or not tested.
