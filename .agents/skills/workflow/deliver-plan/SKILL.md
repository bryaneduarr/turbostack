---
name: deliver-plan
description: "Turn an approved plan at .agents/plans/<feature>/plan.md into a delivery folder beside it (code-only parallel tasks, a review by reading the diff, one verify run with a fix loop, then one PR) and a ready-to-paste prompt for an autonomous, delegate-only orchestrator session. Use when the user points to a plan to prepare its delivery."
---

# Prepare a plan delivery

This skill writes only the plan folder. It never edits code, creates branches, or opens PRs; the prompt it produces authorizes that work in a new session. Files: [references index](references/README.md).

The delivery has one branch (`<feature>`), one worktree at `~/worktrees/<repo>/<feature>` with its own container stack, and one PR, in these stages, always in this order:

1. **Code**: every task writes its logic and any browser scenario in parallel, with no checks.
2. **Review**: one reviewer per slice, started as soon as that slice's tasks are done, judges its changed lines against the rules no tool checks, fixes what it finds, rereads its fixes, and formats its files. One round; no checks.
3. **Verify**: run `scripts/dc bun run verify` once on the work tree.
4. **Fix loop**: after a failure, fix the cause and run `scripts/dc bun run verify --failed` until it passes.
5. **Publish**: after a passing verify, commit through `commit-changes`, push the branch, and open the PR; its Checked section lists the passing run.
6. **Close**: record notes and handoffs, then stop the stack (`scripts/dc stop`).

Steps:

1. Read the five rules, the [run-in-container skill](../run-in-container/SKILL.md), the startup index, the capability map, the topic notes the plan touches, and the plan. Stop if the plan lacks Done when, Decisions, or Steps, or contradicts itself, and suggest `thinking-distill`. Never invent a logic decision.
2. Survey in parallel: one read-only subagent per plan step that touches existing code, each reading the project context first. Each asks which files the step edits, which it mirrors, and which shared files it touches (routers, catalogs, grants, migrations, `bun.lock`).
3. Cut tasks with the [split rules](references/prepare/split-rules.md): few, focused, and parallel, each with its code files and, when its behavior needs verification, its browser scenario.
4. Write this tree from the [templates](references/prepare/templates/):

```text
.agents/plans/<feature>/
├── plan.md                 original, never edited
├── README.md               start here: reading order
├── prompt.md               the prompt for the new session
├── delivery.md             every task with its needs, the review slices, the stages, and status
├── testing.md              `scripts/dc bun run verify` commands, e2e scenarios, skips
├── questions.md            one acceptance question per Done when line
└── tasks/<task-id>/
    └── task.md             scope, code files, browser scenario, agreed interfaces, and the brief
```

5. Check that every plan step sits in one task, that every Done when line sits in `questions.md`, that tasks without a `needs` link between them share no file, and that every task file sits in exactly one review slice.
6. Fill the prompt's Subagents table only with the subagents the user named for each job kind. Leave a row `not provided` when the user named none; the orchestrator then asks for them before starting anything.
7. Report the tree, which tasks start at once, and any `not provided` subagent rows, then print the prompt from `prompt.md` in a fenced block so the user can copy it into a new session.

The new session's orchestrator never reads, writes, or runs anything itself. It starts subagents, passes information between them, and watches them. Each subagent reads the [subagent rules](references/run/subagent-rules.md) and its section of the [job kinds](references/run/job-kinds.md).

Standing rules that bind this skill and every agent it starts:

- **Run in the container.** Every build, install, test, and run goes through `scripts/dc` in the delivery's work tree stack. Nothing is installed or run on the host: no host `bun`, `bunx`, `turbo`, `node`, PostgreSQL, Playwright, locks, or copied `.env`. Without Docker, report the checks as blocked, never run them on the host. Any agent that notices idle stacks, a full cap, or a busy slot acts on it through `scripts/dc` at once, without asking the user.
- **Name the subagents first.** No delivery job starts until the user has named the subagent (type or model) for every job kind. The orchestrator asks for missing ones once, before the setup job, and waits.
- **Run autonomously after that.** Never ask the user anything during delivery: not about logic, scenarios, fixes, files, or continuing. Decide by the plan, the rules, and the project context, record each decision the plan did not make, and keep going until the close stage ends or a stop limit is reached.
- **Code first, one check.** Code stages write logic and browser scenarios with no checks. The one `verify` run and its fix loop are the only checks, and they run after the review.
- **Review against the rules.** Reviewers judge only lines changed in the local Git diff, against the rules in `.agents/rules/` and the project-context notes that no tool checks, and fix only those lines. The verify run checks the rest in seconds.
- **Use the project context.** Before any agent surveys, implements, reviews, or fixes code, it reads `.agents/project-context/start-here.md` and `capabilities.md`, then the linked topic notes for the code it touches.
