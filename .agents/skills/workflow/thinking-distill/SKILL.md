---
name: thinking-distill
description: "Turn a vague or not fully understood request into an approved, visual plan that teaches the user how it works, then write the plan folder a new session follows to deliver it: the plan, every step in detail, the rules, the `scripts/dc` checks, acceptance questions, lessons, and a ready-to-paste prompt. Use when the user asks to plan, scope, or prepare work, when the goal is not 100% clear, or when the user points to a plan to deliver."
---

# Thinking distill

A request is a starting point, not a spec. This skill finds the real goal, attacks its own idea until nothing is guessed, teaches the user how the result will work, and, once the user approves, writes a plan folder detailed enough for a new session to start from it and produce the best result. The plan matters more than the code: it sets the direction for everything after it. Files: [references index](references/README.md).

## Rules

- Plan and prepare only. Edit no code, run no migration, open no PR. The only commit is the plan folder, through `commit-changes`.
- If the request lacks context and a guess could build the wrong thing, say in one line that you are starting this skill.
- Never ask what the project, the rules, or the lessons already answer. Decide it and log the reason in `thinking.md`.
- Never agree just because the user said it. Check every idea against the goal sentence.
- Prepare the terrain, do not build the house: every part serves the goal sentence ([scope fence](references/plan/self-critique.md#scope-fence)).
- Explain everything for a reader with no background; every new idea is taught ([teaching](references/learn/teaching.md)).
- The plan states everything the delivery needs: the rules to follow, the choices already made, the files, the reuse, the checks, and what done means. The user sets the details while planning; write them down exactly as decided and add nothing the user did not choose.
- Write everything in `.agents/plans/<slug>/`, where `<slug>` is a short kebab-case name. Never write secrets.

## Plan

1. **Lessons first.** In one batched read: every file in `.agents/project-context/lessons/`, the startup index, the capability map, the five rules, and the [run-in-container skill](../run-in-container/SKILL.md). Then read the notes and source for each area the request touches ([understand](references/plan/understand.md#read)). If `.agents/plans/<slug>/` exists, continue from its `thinking.md`.
2. **Understand.** Create `thinking.md` from its [template](references/plan/templates/thinking.md) before the first question and keep it current all session: what you searched, where to look, what you decide for the user, and the doubts list ([understand](references/plan/understand.md)).
3. **Critique.** Run the [self-critique bank](references/plan/self-critique.md) on the draft flow and on every idea that could add value. Each answer changes the plan, adds a doubt, or is logged with its reason.
4. **Ask.** Clear the doubts list in rounds printed in chat, never with a question tool ([asking](references/plan/asking.md)). After each answer, rewrite the next questions and their recommendations. No limit on questions or rounds.
5. **Reread as a stranger.** Read the draft plan as someone who must build it tomorrow, with the bank. New doubts go back to step 4.
6. **Summary.** Write the [steps](references/prepare/steps.md) in `thinking.md`, then write `plan.md` from its [template](references/plan/templates/plan.md), plus `summary.html` when the chat renders HTML. Show the [summary](references/plan/summary.md): one place, visual, every choice and edge case on the step it affects. Ask yes or no to approve. On no, ask what is wrong and return to step 4.

## Prepare (starts on approval, without asking again)

7. **Write the folder:**

```text
.agents/plans/<slug>/
├── README.md         start here: reading order and status
├── thinking.md       the planning notebook (doubts, searches, critique, questions)
├── plan.md           the approved plan: how it works, learn, scope, choices, rules
├── summary.html      the visual summary, only when it was rendered
├── steps.md          every step in detail: files, reuse, behavior, done when
├── testing.md        `scripts/dc bun run verify` commands and browser scenarios
├── questions.md      one acceptance question per Done when line
├── prompt.md         the prompt for the new session
└── outcomes.md       the scorecard, filled at close
```

Fill each file from its [template](references/prepare/templates/). Copy decisions from `plan.md` and `thinking.md`; leave nothing for the new session to guess. A gap becomes a doubt and goes back to step 4.
8. **Check.** Confirm that every plan step appears in `steps.md`, every Done when line has a question in `questions.md`, every step names its files, reuse, and rules that bite, and no file is owned by two steps.
9. **Commit** the plan folder through `commit-changes`. If the checkout is not on `main`, say it must land there first.
10. **Finish.** Say exactly "Planning of the implementation is complete.", then print the block from `prompt.md` in a fenced block for the user to paste into a new session.

After the session, follow the [project-context skill](../project-context/SKILL.md) and turn each correction, rejection, approval with changes, or praise from the user into a lesson ([proof and lessons](references/learn/proof-and-lessons.md)).

## Delivery (the new session)

The [prompt](references/prepare/templates/prompt.md) holds the vision, the rules, and the stages (setup, code, verify, pull request, close). The new session reads the plan folder in the order of its `README.md`, follows `steps.md` in order, and changes no choice in `plan.md`. Nobody helps the delivery until it ends; the only allowed blocker is an action only a real person can do.
