# Split rules

- **One branch, one PR**: the whole feature lives on branch `<feature>` in one worktree and opens one PR against `main`. No phases, no stacked or sibling PRs, no integration branches.
- **Task**: one focused purpose, at most 6 code files, sized for one subagent run. Id `t<nn>`. Prefer fewer, more focused tasks over many small ones; never split a purpose only to make more tasks.
- **Code first, one check**: the code stage writes logic, constants, schemas, route definitions, components, generated migrations, and the browser scenario that a task's behavior needs (`apps/client/src/e2e/**/*.e2e.ts`), with no checks. Each task lists its browser scenario separately. No unit test files are written.
- **Parallel by default**: a task has a `needs` link to another only when it must read or run that task's output, such as `drizzle:generate` needing the table file. Importing a file another task creates is not a dependency when `task.md` names that file's path and exports under Agreed interfaces. Every task without `needs` starts at once, with no cap.
- **Disjoint files**: two tasks without a `needs` link never edit the same file, code or scenario. One task owns each shared file (routers, catalogs, grants, migrations, `bun.lock`).
- **Migrations**: one task runs `drizzle:generate`, after the table tasks it needs.
- **Dependencies**: one task changes `bun.lock`, the earliest that needs the package; tasks that import it need that task.
- **Scenarios stay with their task**: an e2e scenario goes in the task that completes its flow, or in its own scenario-only task when no single task does.
- **Agreed interfaces**: when a task uses another task's output, write the path and exported names of what it uses in both `task.md` files, so each can be written without the other present.
- **Review slices**: group the tasks' files (code and scenarios) into disjoint slices of at most about 15 files, by owning package or feature folder. Every task file sits in exactly one slice. One reviewer owns one slice.
- **No checks while writing**: code tasks write only. The one `verify` run after the review runs every check, so a task lists no run commands unless it must generate files.
