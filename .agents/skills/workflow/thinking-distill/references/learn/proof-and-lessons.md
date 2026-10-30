# Proof and lessons

How the agent shows success and failure, proves which one it was, and turns both into lessons that steer the next plan.

## Proof levels

| Level | Name | Means |
| --- | --- | --- |
| 1 | Claimed | An agent says it did it. Never counts. |
| 2 | Inspected | Someone read it at `path:line`. Enough for wording and structure. |
| 3 | Tool-checked | `scripts/dc bun run verify` passed. Enough for types, rules, and builds. |
| 4 | Shown working | A browser scenario ran a real example and passed. Needed for behavior. |
| 5 | User-confirmed | The user said this is what they wanted. The only proof of the goal itself. |

Every Done when line needs level 4, or level 3 when it has no behavior. A merged PR is a weak signal, never proof: the user may merge and still want it different. Real proof builds up over time from the user's feedback.

## Predict, then compare

`plan.md` writes predictions before any code: the Done when lines, each risk with the sign that would show it happened, the expected step and file counts, the expected verify runs, and the riskiest step. At close, the delivery session fills `outcomes.md`: each prediction against what happened, with its proof level and evidence.

## Signals the agent reads by itself

Verify runs and their failing steps; `decided:` lines (choices the plan missed); files no step owned; unclear steps; surprises not in Risks; stop limits hit; and, later, the user's words about the result.

- **Success:** a prediction met at its proof level, a clean verify run, or user praise. Record what made it work, so it repeats.
- **Failure:** a missed prediction, a stop limit, a finding the plan should have prevented, an unclear step, or a user correction. Record the cause and the rule of thumb that would have prevented it.

## Lessons

Lessons live in `.agents/project-context/lessons/`:

| File | Holds |
| --- | --- |
| `working-with-user.md` | How the user wants to work and be told things |
| `planning.md` | What makes plans right or wrong; create it with its first lesson |
| `delivery.md` | What makes deliveries fast or slow, correct or not; create it with its first lesson |
| `product.md` | What is correct or incorrect in this product; create it with its first lesson |

One line each:

```text
- <YYYY-MM-DD> · When <situation>, <do this>, because <reason>. Proof: <level> (<evidence>).
```

- The user's words outrank everything (level 5). Replace a lesson the user contradicts; never keep both.
- Merge duplicates. At most 25 lessons per file; drop the weakest proof first.
- Lessons at level 1 or 2 are tentative: apply them, and say so in `thinking.md`.
- Never store secrets or personal data.

## The loop

```text
 plan reads lessons ──► plan predicts ──► delivery records signals
        ▲                                         │
        │                                         ▼
 user feedback adds ◄── close scores outcomes.md and writes lessons
 level 5 lessons
```

## Asking the user

Only a planning session asks, and only when the evidence cannot decide: one question labelled **Success/failure check** ([asking](../plan/asking.md#successfailure-check)), saying the answer becomes a lesson. A delivery never asks; it lists the open checks in `outcomes.md` under Ask the user, its final report shows them under "You should do this next", and the next planning session asks them in its first round.
