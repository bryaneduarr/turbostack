# Split rules

## One branch, one PR

The whole feature lives on branch `<feature>` and opens one PR against `main`. No phases, stacked PRs, or integration branches.

## Survey

Step 5 starts one read-only hands scout per plan step that touches existing code, in one message with the critic. Each reads the project context first, searches only inside the repository, and reports in at most 300 words: the files the step edits, the file to mirror, the helpers, components, class maps, and constants to import instead of copying, the shared files (routers, catalogs, grants, migrations, `bun.lock`), folders near 10 files, and files near 200 lines.

## Tasks

- **One piece each:** one focused purpose, at most 8 code files, sized for one subagent run. Id `t<nn>`. A task places a brick, never the house. Prefer fewer, larger focused tasks: every job pays a fixed start-up cost (reading the rules, the task, and the files to mirror), and in a measured 22-task delivery that was about 2 minutes per job across 22 tasks. Aim at 8 to 12 tasks per delivery; when the plan needs more than 14, split it into deliveries.
- **A clear brief:** every `task.md` fills Vision, Your piece, Done when, Not yours, Inputs, and If unclear. An agent reading only its `task.md` and the files it names can finish without asking.
- **Code first:** tasks write logic, constants, schemas, route definitions, components, generated migrations, and the browser scenario their behavior needs (`apps/client/src/e2e/**/*.e2e.ts`). Each task checks only its own files, with Biome and the type check, once they are complete; browser scenarios run only in the full verify at the end. No unit test files.
- **Disjoint files:** two tasks without a `needs` link never edit the same file. One task owns each shared file (routers, catalogs, grants, migrations, `bun.lock`).
- **Needs:** a task needs another only when it must read or run that task's output, such as `drizzle:generate` needing the table file. Importing a file another task creates is not a need when both `task.md` files name its path and exports under Agreed interfaces.
- **Short chains:** keep the longest chain of needs at 3 tasks or fewer. The chain is the floor of the code stage: in a measured 22-task delivery, a 7-task chain took 37 minutes however many agents ran. Break a chain by agreeing the interface in both `task.md` files instead of waiting for the code.
- **Scenarios:** a browser scenario goes in the task that completes its flow, or in its own task when no single task does. The plan fixes the words a person sees, the labels, routes, test ids, and seeded data under Agreed interfaces, so a scenario task is written against them and needs no screen task. Scenario tasks join wave 1 or 2, never the end of the chain.
- **Generators:** one task runs `drizzle:generate`, after the table tasks; one task changes `bun.lock`, the earliest that needs the package.

## Task specs

The brain writes one terse spec block per task in `board.md`; a hands writer turns it into `task.md` and adds nothing it does not say. Every task is implemented by the hands.

- **Size:** `S`, `M`, or `L` ([scheduling](../team/scheduling.md#sizes)), used to order and batch the jobs.
- **Risk:** `high` where one wrong line leaks access or data, otherwise `normal`. A `high` spec gives the logic step by step ([brain and hands](../team/brain-and-hands.md#hands-get-briefs-with-nothing-left-to-decide)).
- **Reuse:** the helpers, components, class maps, and constants to import, from the survey. Copied helpers and types in the wrong folder were most of the 37 must-fix comments in a measured 22-task delivery.
- **Rules that bite:** two to five rule sections this task is most likely to break, such as "types-and-validation: derive the window fields from the schema", so the reader knows where to look after reading the five rules.
- **Per code file:** its exact behavior and the exports others use.

## Worktrees

A worktree is a second folder of the same repository: only files, no stack and no installed packages, so it costs a little disk and no memory or CPU. The stack is what costs, so only one folder ever gets one.

| Worktree | Path | Who works there | Stack |
| --- | --- | --- | --- |
| Delivery | `~/worktrees/<repo>/<feature>` on branch `<feature>` | Tasks with needs, generator tasks, every task's own checks, publish, review, fix, verify, record | Yes, the only one |
| Task | `~/worktrees/<repo>/<feature>.tasks/<task-id>`, detached | One task without needs | Never |

- Every task without needs that runs no generator gets its own task worktree. Its agent sees only its own half-written files, its `git status` shows exactly its work, and a bad attempt is thrown away without touching anyone else.
- When the task is written, its own implement job copies its listed files into the delivery worktree, removes the task worktree, and runs its own checks there ([implement](../run/jobs/implement.md)). No separate merge job runs. Nothing is committed until the draft PR, so commits stay purposeful.
- Tasks with needs and generator tasks run in the delivery worktree after their needs report done.

## Waves

Wave 1 is every task without needs. Wave `n` is every task whose needs are all in earlier waves. A task starts as soon as its own needs are done, without waiting for the rest of its wave.

## Agents at once

Write one number N in `board.md` and the prompt: how many subagents may run at the same time, of any kind. N is at most 8, because many jobs at once caused provider outages before; choose fewer when the team uses one provider or the tasks are large, and write why. Worktrees add no limit; the delivery stack is shared by every job that needs one.

## Review slices

Group the tasks' files (code and scenarios) into at most 4 disjoint slices of about 30 files or fewer, by owning package or feature folder. Every task file sits in exactly one slice. One rules reviewer owns one slice. The plan, reliability, and security auditors each read the whole change. In a measured 22-task delivery, 11 slices of up to 15 files made 14 reviewers wait in three batches.
