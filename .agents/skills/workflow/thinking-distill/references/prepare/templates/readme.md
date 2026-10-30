# <Feature>: plan and delivery

Approved <UTC date> at `<revision>`. A clean session starts here.

Vision: <goal sentence and why it matters, in two sentences>.

## Run

Paste the block in [prompt](prompt.md) into a new session started in the primary checkout. The session runs with no human help until the close stage ends.

## Read in order

1. [plan](plan.md): how it works, learn, scope, choices, rules, Done when. Never change a choice.
2. [steps](steps.md): every step in order, with files, reuse, rules that bite, and Done when.
3. [testing](testing.md): the `scripts/dc` commands and browser scenarios.
4. [questions](questions.md): what must be `yes` before the feature is done.
5. [outcomes](outcomes.md): the scorecard, after close.
6. [thinking](thinking.md): how the plan was reached, only when a choice needs its background.

## Environment

All building, installing, testing, and running goes through `scripts/dc` in the work tree's stack; nothing runs on the host. The stack stops at close. Without Docker, the checks are blocked.

## Delivery

One branch `<feature>`, one PR against `main`, <count> steps. Stages: setup, code, verify, pull request, close.

## Status

<Stage and step reached, updated by the delivery session after each step.>
