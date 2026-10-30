# <Feature>: plan and delivery

Approved <UTC date> at `<revision>`. A clean session starts here.

Vision: <goal sentence and why it matters, in two sentences>.

## Run

Paste the block in [prompt](prompt.md) into a new session started in the primary checkout. The session runs with no human help until the close stage ends.

## Read in order

1. [plan](plan.md): how it works, learn, scope, choices, Done when. Never change a choice.
2. [board](board.md): every task, wave, worktree, review, and stage; [board log](board-log.md) holds the newest status lines. Resume from here.
3. [chat](chat.md): the team chat.
4. [testing](testing.md): the `scripts/dc` commands and browser scenarios.
5. [questions](questions.md): what must be `yes` before the feature is done.
6. Each task's `task.md` under `tasks/`.
7. [outcomes](outcomes.md): the scorecard, after close.
8. [thinking](thinking.md): how the plan was reached, only when a choice needs its background.

## Worktrees and stack

The delivery worktree `~/worktrees/<repo>/<feature>` gets the only container stack from `scripts/dc`. Task worktrees under `~/worktrees/<repo>/<feature>.tasks/` hold files only. Every build, install, test, and run goes through `scripts/dc` in the delivery worktree; nothing runs on the host. The stack stops at close. Without Docker, the checks are blocked.

## Delivery

One branch `<feature>`, one PR against `main`, <count> tasks in <count> waves (longest needs chain <count>), <count> review slices, 3 auditors, at most <N> agents at once, about <minutes> minutes. Stages: setup, code, draft PR, review, fix, verify, ready, close.
