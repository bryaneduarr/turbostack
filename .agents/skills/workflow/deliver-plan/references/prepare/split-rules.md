# Split rules

- **One branch, one PR**: the whole feature lives on branch `<feature>` in one worktree and opens one PR against `main`. No phases, no stacked or sibling PRs, no integration branches.
- **Task**: one focused purpose, at most 6 code files, sized for one subagent run. Id `t<nn>`. Prefer fewer, more focused tasks over many small ones; never split a purpose only to make more tasks.
- **Code first, tests later**: the code stage writes logic, constants, schemas, route definitions, components, and generated migrations, with no test files. Each task lists its test files separately (unit, route, and e2e); a test job for that task writes them in the test stage, after the PR is open.
- **Parallel by default**: a task has a `needs` link to another only when it must read or run that task's output, such as `drizzle:generate` needing the table file. Importing a file another task creates is not a dependency when `task.md` names that file's path and exports under Agreed interfaces. Every task without `needs` starts at once, with no cap. Test jobs have no `needs`: every code file exists when they start.
- **Disjoint files**: two tasks without a `needs` link never edit the same file, code or test. One task owns each shared file (routers, catalogs, grants, migrations, `bun.lock`).
- **Migrations**: one task runs `drizzle:generate`, after the table tasks it needs.
- **Dependencies**: one task changes `bun.lock`, the earliest that needs the package; tasks that import it need that task.
- **Tests stay with their task**: each task names its unit and route tests next to its code. An e2e scenario goes in the task that completes its flow, or in its own test-only task when no single task does.
- **Agreed interfaces**: when a task uses another task's output, write the path and exported names of what it uses in both `task.md` files, so each can be written without the other present.
- **Review slices**: group the tasks' files (code and tests) into disjoint slices of at most about 15 files, by owning package or feature folder. Every task file sits in exactly one slice. One reviewer owns one slice.
- **No checks while writing**: code tasks write only. The test and final stages run every command, so a task lists no run commands unless it must generate files.
