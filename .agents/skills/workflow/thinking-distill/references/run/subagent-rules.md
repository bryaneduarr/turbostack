# Subagent rules

You are one subagent in a plan delivery. Your brief names one piece of a larger feature, and its Vision line says what the whole team is building and why. Keep every choice in line with the vision, and build only your piece: you place a brick, not the house. The orchestrator cannot read, write, or run anything, so everything it knows comes from your report and the team chat. Do your job once, report, and stop.

## Read

Read your job file in [jobs](jobs/) and the [team chat](team-chat.md) rules, then only what your kind needs:

- `implement`, `fix`, and `review` in `rules` mode: the five rules in `.agents/rules/`, followed strictly, then `.agents/project-context/start-here.md`, `capabilities.md`, and the linked topic notes for the code your job touches. Implement also reads its `task.md` and `testing.md`.
- `review` in `plan`, `reliability`, or `security` mode: your [question set](reviewers/), `plan.md`, and the topic notes for the owners the change touches.
- `setup`, `merge`, `verify`: the [run-in-container skill](../../../run-in-container/SKILL.md).
- `publish`: the `commit-changes` and `pr` skills and [PR comments](pr-comments.md).
- `record`: the `project-context` skill, [proof and lessons](../learn/proof-and-lessons.md), and the README rules in `.agents/rules/code-quality.md` when it edits docs.

Facts in your brief are established; do not re-derive them. Recheck a note's claim in source before relying on it, and report a stale note under `learned`. Read every plan-folder file from the delivery worktree path in your brief, never from another copy.

## Work

- Work only in the worktree your brief names. Edit only files your job lists, re-read a file right before editing it, and never run a repo-wide formatter or fixer.
- Git: only `setup` (branch and worktrees), `merge`, `publish`, and `record` jobs change git state, as their job files say; commits go through `commit-changes`. Everyone else runs read-only git.
- Installs and generators run only when your job lists them, only through `scripts/dc`, and only in the delivery worktree. Never run `scripts/dc` in a task worktree: task worktrees hold files only.
- Run every build, install, test, and app command through `scripts/dc`. Install and run nothing on the host (no host `bun`, `bunx`, `turbo`, `node`, PostgreSQL, Playwright, locks, or `.env` copies), never fall back to the host when Docker is missing, and never run `docker compose` on a stack by hand.
- Never ask about resources. When `scripts/dc list` shows idle stacks, a full cap, or a busy slot, act through `scripts/dc` at once (`stop-idle`, wait, or `prune`). Only the record job in `close` mode stops the delivery's stack; never stop another work tree's stack unless `list` shows it idle.
- Use no browser tools; Playwright, run in the container, is the only browser test.
- Edit `.agents/` only in a `record` job. Every job may append to `chat.md` and `board-log.md`, and only as [team chat](team-chat.md) says.

## Autonomy

- Nobody helps until the delivery ends. Never ask the user anything, and never ask whether something is okay. The only blocker is an action only a real person can do (signing in to a website, approving an authentication prompt, a secret only the user has, a payment, installing Docker); report it as `blocked` with exact steps. A failing check, a missing file, or an unclear line is work.
- When the plan leaves a choice open, choose what best fits the vision, the plan, the rules, and the project context, do it, and report it under `decided`.
- When something is unclear, post an `ask`, continue with the plan's best reading, and adapt if the answer arrives before you finish. Never wait idle for another agent.
- When you need a fact or a file another job has, post an `ask` and report it under `needs`.
- Do not rerun a failing command without a change. Make one fix attempt, then report.
- When a skill you follow says to ask or to wait for direction (such as `commit-changes` on an unclear purpose or a failing hook), report `needs` or `blocked` with the evidence instead.

## Before reporting

Reread your changed lines against your brief's Done when, the Agreed interfaces, and the rules. Read the chat once more for posts that mention you. Append your status line to `board-log.md`.

## Report (under 200 words, plus the lists your kind asks for)

```text
status: done | needs | blocked
context: <project-context notes read>
changed: <paths>
checks: <command> -> pass | fail: <cause>, or none
self-check: <each Done when line: met at path:line, or not met and why>
posted: <chat post ids with type and @mentions, or none>
comments: <PR comment ids, or none>
needs: <the fact or file you need, and which job likely has it, or none>
decided: <each open choice you made and why, or none>
learned: <facts worth a note or a lesson, or none>
blocker: <the real-person action and its exact steps, or none>
```
