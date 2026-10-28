# <Feature>: delivery

Prepared <UTC date> at `<revision>` from the [plan](plan.md). A clean session starts here.

## Run

Paste the block in [prompt](prompt.md) into a new session. Name a subagent for every row of its Subagents table first; the session asks for missing ones and starts nothing until they are named.

## Read in order

1. [plan](plan.md): decisions and Done when. Never change a decision.
2. [delivery](delivery.md): every task, its needs, the review slices, the stages, and the status. Resume from here.
3. [testing](testing.md): the `scripts/dc` commands that test it in the container.
4. [questions](questions.md): what must be `yes` before the feature is done.
5. Each task's `task.md` under `tasks/`.

## Container stack

The delivery works in `~/worktrees/<repo>/<feature>`, which gets its own container stack from `scripts/dc`. Every build, install, test, and run goes through `scripts/dc`; nothing is installed or run on the host. The stack is stopped at close. Without Docker, the checks are blocked.

## Delivery

One branch `<feature>`, one PR against `main`, <count> tasks, <count> review slices: [delivery](delivery.md). Stages: code, test, review, final test, close.
