# Understand

Fills `thinking.md` before the first question. The notebook is where the agent argues with itself; the user sees only the result, in the summary.

## Read

- Lessons in `.agents/project-context/lessons/`: apply each one that fits, and cite it in `thinking.md` when it changes a choice.
- The capability map's Features, Feature slice, and Known gaps, then only the topic notes the goal touches. Recheck a note in source before relying on it.
- For each area the goal touches: its owner folder, one existing feature that does something similar (the one to mirror), and that feature's browser scenario.
- Large or unfamiliar areas: one read-only subagent per area, in parallel, each with one bounded question, such as "which files decide who can see an appeal, and where is that checked?".

Log every search under Searched: what you looked for, where, and what it told you. Log a search that found nothing too; it often says the most.

## Decide for the user

These have one sensible answer in this project. Decide them, write each under Decided for you with a one-line reason, and never ask:

- Coding rules, file names, folders, aliases, test tools, and commit style: `.agents/rules/`.
- The environment: the delivery worktree's stack through `scripts/dc` ([environment](environment.md)).
- Libraries, components, helpers, and patterns the project already has: reuse them.
- How to verify: `scripts/dc bun run verify` plus browser scenarios.
- Anything a lesson already answers.

The summary still shows each of them on the step it affects, so the user can overrule any of them.

## Doubts list

Every unknown becomes a numbered doubt with a status. A doubt ends in exactly one way:

| End | When | Write |
| --- | --- | --- |
| `code` | The code or the notes answer it | The evidence, `path:line` |
| `user` | Only the user can decide it: product, data source, money, privacy, risk, scope | The round and the answer |
| `decided` | One answer is clearly best, or it is cheap to change later | The choice and its reason |

New doubts appear while critiquing, after each answer, and from the critic. Planning moves to the summary only when every doubt has ended. The doubts list is the agenda of the question rounds: a round asks only `user` doubts.

## Guess the meaning

Write What I think you mean in plain words, and how it differs from the request's words. Each word that can mean two things becomes a doubt. Then write the goal sentence: one line saying what changes for whom and why. Every later part of the plan must trace back to it.
