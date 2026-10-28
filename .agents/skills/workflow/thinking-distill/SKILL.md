---
name: thinking-distill
description: "Find what the user really wants by asking short, direct questions, then save one specific plan to .agents/plans/<slug>/plan.md. Use when the user asks to plan or scope work, and whenever the goal is unclear or there is not enough context to know what to build."
---

# Thinking distill

The request is a starting point, not a final spec. Find the real goal, show what the user may have missed, and agree on a direction before any work starts.

## Rules

- Only ask questions and write the plan. Do not edit code, run migrations, or commit until the plan is saved and the user says yes to start.
- Do not agree just because the user said it. Check each idea against the goal.
- If the request lacks context and guessing could build the wrong thing, say in one line that you are starting this skill.

## Prepare

1. Read `.agents/project-context/capabilities.md` first. Open only the topic notes the goal touches.
2. List what to **reuse**, what to **build**, and what is a **gap**, each with its owner path.
3. If `.agents/plans/<slug>/` exists for this goal, read it and continue from its open points.
4. Never ask what the project already answers. Treat it as an assumption. That includes the environment: read the [run-in-container skill](../run-in-container/SKILL.md); all building, installing, testing, and running happens in the work tree's devcontainer stack through `scripts/dc`, and resources are managed automatically, never asked.

## Ask

Use the harness question tool (`AskUserQuestion` in Claude Code), up to 4 questions per call. Without one, print numbered questions with lettered options in chat, 5 at a time, and wait.

Repeat until you could write the plan without guessing.

Each question:

- Is direct, about 20 words or fewer, in simple words. Explain any hard term.
- Covers one decision, with 2 to 4 options. The best option comes first and ends with `(Recommended)`. Do not add "Other"; the tool adds it.
- Starts with a short line saying how the answer helps reach the goal.
- Gives each option one line: what it brings or what it costs.
- Skips choices with one sensible answer. Use a single yes/no question for assumptions instead.

After every answer, drop questions it settled, follow up on vague answers, and challenge anything that conflicts with the goal or an earlier answer.

## Challenge and extend

Only for areas the request really touches (for example goal, scope, risk, growth, verification, upkeep):

- Ask about each risk that needs a decision, with the likely error and a fix.
- Offer the smallest version that reaches the goal. Include an option the user may not have thought of, such as doing less or using what exists.
- Suggest a few strong additions that serve the goal, one question each: add now, add later, or skip. Recommend "later" if it would delay the core result. Run each accepted addition through these same rules.

## Plan

When nothing is left to guess, summarize the goal, decisions, and risks in a few lines and ask yes/no to save. If no, ask what is wrong and keep going.

Save one file, `.agents/plans/<slug>/plan.md`, where `<slug>` is a short kebab-case name. Update it in place if it exists. Link to source paths instead of copying code. Never include secrets.

The plan must be specific enough to build without questions. It holds, in this order:

1. **Request:** the user's own words, the date (UTC), and the Git revision.
2. **Goal:** what the user finally wants and why, in a few sentences. Say how it differs from the request.
3. **Done when:** conditions anyone can check.
4. **Decisions:** every user choice, with the reason and the rejected options.
5. **Scope:** what is in, what is out, and each addition marked now, later, or skipped.
6. **Risks:** each risk with its fix, or marked accepted by the user.
7. **Steps:** ordered, concrete steps. Each names the files or owner paths it touches and how to verify it, in the `scripts/dc` form.

Every user request, decision, and goal must appear in the plan. Nothing the user said may be missing. A plan that changes code also holds the Environment decision, and its first step creates the work tree and the first `scripts/dc` call: see the [environment note](references/environment.md).

## Finish

Show the Goal and Steps, then ask yes/no: start now? On yes, begin at step 1. On no, stop; the plan stays saved.
