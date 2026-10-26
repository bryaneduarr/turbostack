# <Feature>: delivery

Prepared <UTC date> at `<revision>` from the [plan](plan.md). A clean session starts here.

## Run

Paste the block in [prompt](prompt.md) into a new session. Name a subagent for every row of its Subagents table first; the session asks for missing ones and starts nothing until they are named.

## Read in order

1. [plan](plan.md): decisions and Done when. Never change a decision.
2. [delivery](delivery.md): every task, its needs, the review slices, the stages, and the status. Resume from here.
3. [testing](testing.md): how to test locally.
4. [questions](questions.md): what must be `yes` before the feature is done.
5. Each task's `task.md` under `tasks/`.

## Delivery

One branch `<feature>`, one PR against `main`, <count> tasks, <count> review slices: [delivery](delivery.md). Stages: code, test, review, final test, close.
