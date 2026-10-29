# merge

Copy one finished task's files from its task worktree into the delivery worktree, then remove the task worktree. Modes: `task` (one task) and `last` (after every task is merged). Merge jobs run one at a time.

## task mode

```sh
task="<task worktree>"; delivery="<delivery worktree>"
git -C "$task" add -A
git -C "$task" diff --cached --name-status
git -C "$task" diff --cached --binary -- <the paths listed in task.md> | git -C "$delivery" apply
git -C "$delivery" worktree remove --force "$task"
```

- Compare the staged list with the task's Code files and Browser scenario tables. Merge only listed paths. Post a `finding` for each unlisted path (a stray edit) addressed to the task, and report it under `needs`.
- `git apply` writes only the working tree of the delivery worktree; nothing is committed. If it fails, keep the task worktree, report the error lines and the paths, and post a `finding` to `@all`.
- Append `<task id> merged` to `board-log.md`.

## last mode

1. List the changed code files, one per path: `git -C "<delivery worktree>" status --porcelain -uall -- . ':!.agents'`, keeping only the path column.
2. Format them once: `cd "<delivery worktree>" && scripts/dc bunx biome check --write <those files>`, so formatting and import order never fail the verify run.
3. Compare them with the review slices in `board.md`; report every file that sits in no slice.
4. Confirm `~/worktrees/<repo>/<feature>.tasks/` holds no worktree; report any left.

Report the merged or formatted paths and any unlisted or unsliced file.
