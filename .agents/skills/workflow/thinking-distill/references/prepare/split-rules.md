# Split rules

## One branch, one PR

The whole feature lives on branch `<feature>` and opens one PR against `main`. No phases, stacked PRs, or integration branches.

## Tasks

- **One piece each:** one focused purpose, at most 6 code files, sized for one subagent run. Id `t<nn>`. A task places a brick, never the house; prefer fewer focused tasks over many tiny ones, and never split a purpose only to make more tasks.
- **A clear brief:** every `task.md` fills Vision, Your piece, Done when, Not yours, Inputs, and If unclear. An agent reading only its `task.md` and the files it names can finish without asking.
- **Code first:** tasks write logic, constants, schemas, route definitions, components, generated migrations, and the browser scenario their behavior needs (`apps/client/src/e2e/**/*.e2e.ts`), with no checks. No unit test files.
- **Disjoint files:** two tasks without a `needs` link never edit the same file. One task owns each shared file (routers, catalogs, grants, migrations, `bun.lock`).
- **Needs:** a task needs another only when it must read or run that task's output, such as `drizzle:generate` needing the table file. Importing a file another task creates is not a need when both `task.md` files name its path and exports under Agreed interfaces.
- **Generators:** one task runs `drizzle:generate`, after the table tasks; one task changes `bun.lock`, the earliest that needs the package.
- **Scenarios:** a browser scenario goes in the task that completes its flow, or in its own task when no single task does.

## Worktrees

A worktree is a second folder of the same repository: only files, no stack and no installed packages, so it costs a little disk and no memory or CPU. The stack is what costs, so only one folder ever gets one.

| Worktree | Path | Who works there | Stack |
| --- | --- | --- | --- |
| Delivery | `~/worktrees/<repo>/<feature>` on branch `<feature>` | Tasks with needs, generator tasks, merge, publish, review, fix, verify, record | Yes, the only one |
| Task | `~/worktrees/<repo>/<feature>.tasks/<task-id>`, detached | One task without needs | Never |

- Every task without needs that runs no generator gets its own task worktree. Its agent sees only its own half-written files, its `git status` shows exactly its work, and a bad attempt is thrown away without touching anyone else.
- A merge job copies a finished task's files into the delivery worktree and removes the task worktree ([merge](../run/jobs/merge.md)). Nothing is committed until the draft PR, so commits stay purposeful.
- Tasks with needs and generator tasks run in the delivery worktree after their needs are merged.

## Waves

Wave 1 is every task without needs. Wave `n` is every task whose needs are all in earlier waves. A task starts as soon as its own needs are merged, without waiting for the rest of its wave.

## Agents at once

Write one number N in `board.md` and the prompt: how many subagents may run at the same time, of any kind. N is at most 8, because many jobs at once caused provider outages before; choose fewer when the team uses one provider or the tasks are large, and write why. Worktrees add no limit; the delivery stack is shared by every job that needs one.

## Review slices

Group the tasks' files (code and scenarios) into disjoint slices of at most about 15 files, by owning package or feature folder. Every task file sits in exactly one slice. One rules reviewer owns one slice. The plan, reliability, and security auditors each read the whole change.
