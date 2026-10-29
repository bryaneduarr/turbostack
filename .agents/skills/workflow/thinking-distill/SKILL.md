---
name: thinking-distill
description: "Turn a vague or not fully understood request into an approved, visual plan that teaches the user how it works, then prepare its autonomous delivery: parallel tasks in worktrees, a team chat, rules reviewers and auditors on PR lines, the local verify loop, lessons, and a ready-to-paste prompt for a new session. Use when the user asks to plan, scope, or prepare work, when the goal is not 100% clear, or when the user points to a plan to deliver."
---

# Thinking distill

A request is a starting point, not a spec. This skill finds the real goal, attacks its own idea until nothing is guessed, teaches the user how the result will work, and, once the user approves, prepares a delivery that a new session runs with no human help. The plan matters more than the code: it sets the direction for every agent after it. Files: [references index](references/README.md).

## Rules

- Plan and prepare only. Edit no code, run no migration, open no PR. The only commit is the plan folder, through `commit-changes`.
- If the request lacks context and a guess could build the wrong thing, say in one line that you are starting this skill.
- Never ask what the project, the rules, or the lessons already answer. Decide it and log the reason in `thinking.md`.
- Never agree just because the user said it. Check every idea against the goal sentence.
- Prepare the terrain, do not build the house: every part serves the goal sentence ([scope fence](references/plan/self-critique.md#scope-fence)).
- Explain everything for a reader with no background; every new idea is taught ([teaching](references/learn/teaching.md)).
- Write everything in `.agents/plans/<slug>/`, where `<slug>` is a short kebab-case name. Never write secrets.

## Plan

1. **Lessons first.** Read every file in `.agents/project-context/lessons/`, then the startup index, the capability map, the topic notes the goal touches, the five rules, and the [run-in-container skill](../run-in-container/SKILL.md). If `.agents/plans/<slug>/` exists, continue from its `thinking.md`.
2. **Understand.** Create `thinking.md` from its [template](references/plan/templates/thinking.md) before the first question and keep it current all session: what you searched, where to look, what you decide for the user, and the doubts list ([understand](references/plan/understand.md)).
3. **Critique.** Run the [self-critique bank](references/plan/self-critique.md) on the draft flow and on every idea that could add value. Each answer changes the plan, adds a doubt, or is logged with its reason.
4. **Ask.** Clear the doubts list in small rounds printed in chat, never with a question tool ([asking](references/plan/asking.md)). After each answer, rewrite the next questions and their recommendations. No limit on questions or rounds. The last round names the team.
5. **Critic.** Start one fresh read-only subagent with `thinking.md`, the draft plan, and the bank, and ask how the plan fails. Fold its findings in; new doubts go back to step 4. Without a subagent tool, reread the plan as a stranger with the bank.
6. **Summary.** Write `plan.md` from its [template](references/plan/templates/plan.md), then show the [summary](references/plan/summary.md): one place, visual, every choice and edge case on the step it affects. Ask yes or no to approve. On no, ask what is wrong and return to step 4.

## Prepare (starts on approval, without asking again)

7. **Survey.** One read-only subagent per plan step that touches existing code. Each reads the project context first and reports the files the step edits, mirrors, and shares (routers, catalogs, grants, migrations, `bun.lock`).
8. **Split** into tasks, waves, worktrees, review slices, and agents at once with the [split rules](references/prepare/split-rules.md).
9. **Write** the delivery folder from the [templates](references/prepare/templates/):

```text
.agents/plans/<slug>/
├── README.md         start here: reading order and status
├── thinking.md       the planning notebook (doubts, searches, critique, questions)
├── plan.md           the approved plan: how it works, learn, scope, steps
├── summary.html      the visual summary, only when it was rendered
├── prompt.md         the prompt for the new session
├── board.md          central task board: tasks, waves, reviews, stages, decisions
├── board-log.md      append-only status lines from every job
├── chat.md           the team chat
├── testing.md        `scripts/dc bun run verify` commands and browser scenarios
├── questions.md      one acceptance question per Done when line
├── outcomes.md       the scorecard, filled at close
└── tasks/<task-id>/  task.md (one focused piece with its brief); the handoff at close
```

10. **Check** that every plan step sits in one task, every Done when line in `questions.md`, tasks without a `needs` link share no file, every task file sits in exactly one review slice, every task brief is complete, and every Subagents row is named or `not provided`.
11. **Commit** the plan folder on `main` through `commit-changes`, so the delivery worktree contains it. If the checkout is not on `main`, say it must land there first.
12. **Finish.** Say exactly "Planning of the implementation is complete.", then print the block from `prompt.md` in a fenced block for the user to paste into a new session.

After the session, follow the [project-context skill](../project-context/SKILL.md) and turn each correction, rejection, approval with changes, or praise from the user into a lesson ([proof and lessons](references/learn/proof-and-lessons.md)).

## Delivery (the new session)

The [prompt](references/prepare/templates/prompt.md) holds the stages (setup, code, merge, draft PR, review, fix, verify, ready, close) and the orchestrator's rules. Every subagent reads the [subagent rules](references/run/subagent-rules.md) and its [job file](references/run/jobs/). Nobody helps the delivery until it ends; the only allowed blocker is an action only a real person can do.
