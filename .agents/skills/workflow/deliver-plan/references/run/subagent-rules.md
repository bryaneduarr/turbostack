# Subagent rules

You are one subagent in a plan delivery. The orchestrator started you and cannot read, write, or run anything itself, so everything it knows comes from your report. Do your job once, report, and stop.

- Work only in the worktree and on the branch your brief names.
- Read your kind's section in [job kinds](job-kinds.md), then only what your kind needs. Reading more costs time and adds nothing:
  - `implement`, `review`, `fix`: the five rules in `.agents/rules/`, followed strictly, then `.agents/project-context/start-here.md`, `capabilities.md`, and the linked topic notes for the code your job touches, and only those. An implement job also reads `tasks/<task-id>/task.md` and `testing.md` in the plan folder. Recheck a note's claim in source before relying on it, and report a stale note under `learned`.
  - `setup`, `verify`: the [run-in-container skill](../../../run-in-container/SKILL.md) only.
  - `publish`: the `commit-changes` and `pr` skills.
  - `record`: the `project-context` skill, plus the README rules in `.agents/rules/code-quality.md` when it edits docs.
- Facts in your brief are established. Do not re-derive them.
- Other subagents work in this same worktree at the same time. Edit only files your job lists, re-read a file right before editing it, and never run a repo-wide formatter or fixer.
- Run no git command that changes state (`add`, `commit`, `stash`, `reset`, `checkout`, `rebase`, `push`) unless your kind is `publish` or `record`; those commit through the `commit-changes` skill.
- Install dependencies or run `drizzle:generate` only when your job lists it, and only through `scripts/dc`.
- Use no browser tools; Playwright, run in the container, is the only browser test.
- Run every build, install, test, and app command through `scripts/dc` in your worktree. Install and run nothing on the host (no host `bun`, `bunx`, `turbo`, `node`, PostgreSQL, Playwright, locks, or `.env` copies), never fall back to the host when Docker is missing (report `blocked`), and never run `docker compose` on a stack by hand.
- Never ask the user or another agent about resources. When `scripts/dc list` shows idle stacks, a full cap, or a busy slot, act on it through `scripts/dc` at once (`stop-idle`, wait, or `prune`). The delivery's own stack is stopped only by the `record` job in `close` mode. Never stop or delete another work tree's stack unless `list` shows it idle.
- Edit `.agents/` only in a `record` job.
- The delivery is autonomous. Never ask the user anything, and never ask whether something is okay or correct: writing a scenario, fixing a failure, adding a file, or continuing. A failing check is work to do, not a question.
- When the plan leaves a logic choice open, such as how data flows or how something looks, choose what best fits the plan, the rules, and the project context, do it, and report it under `decided`.
- Never ask another subagent anything. When you need a fact or a file another job has, stop and report it under `needs`; the orchestrator gets it and passes it back.
- Do not rerun a failing command without a change. Make one fix attempt, then report.

## Report (under 200 words, plus the lists your kind asks for)

```text
status: done | needs | blocked
context: <project-context notes read>
changed: <paths>
checks: <command> -> pass | fail: <cause>
needs: <the fact or file you need, and which job likely has it, or none>
decided: <each open logic choice you made and why, or none>
learned: <facts worth a context note, or none>
blocker: <what and its evidence, or none>
```
