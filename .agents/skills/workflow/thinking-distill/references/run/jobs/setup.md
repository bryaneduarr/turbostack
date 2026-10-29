# setup

Create the delivery worktree and branch, start its stack, create one task worktree per task marked `own`, and report every absolute path.

```sh
repo="$(dirname "$(git rev-parse --path-format=absolute --git-common-dir)")"
root="$HOME/worktrees/$(basename "$repo")"
mkdir -p "$root/<feature>.tasks"
git -C "$repo" worktree add -b "<feature>" "$root/<feature>" main
(cd "$root/<feature>" && scripts/dc bun --version > "$root/<feature>-setup.log" 2>&1 &)
for task in <task ids marked own>; do
  git -C "$root/<feature>" worktree add --detach "$root/<feature>.tasks/$task" HEAD
done
```

- The first `scripts/dc` call builds or reuses the shared image, starts the stack, and installs packages, which can take minutes. Start it detached as above and poll the log with short checks until the version prints; never block on it.
- Task worktrees are files only: run no `scripts/dc`, install nothing, and copy no `.env` in them.
- Confirm the plan folder exists in the delivery worktree (`.agents/plans/<feature>/plan.md`); if it does not, the plan was not committed on `main`: report `needs` with that fact.
- When resuming, reuse existing worktrees and create only the missing ones. If Docker is missing, report `blocked`.

Append `setup created` to `board-log.md`. Report the delivery worktree path, each task worktree path, and the stack's state.
