# implement

Code stage. Write the Code files in your `task.md`, all the logic your piece needs to work, plus its browser scenario when `task.md` lists one, and nothing else.

1. In one read call: the files the subagent rules list for you, your `task.md`, `testing.md`, the files it tells you to mirror, and the Reuse files. Then read the chat for posts that mention you.
2. Write each Code file right the first time, following every applicable rule and the Rules that bite, because reviewers read every line later. Import every Reuse item; never copy a helper, type, class string, or constant that exists.
3. Honor the Agreed interfaces exactly, even when the other task's file does not exist in your worktree. When you must change an export others use, post an `announce` before changing it. When you see a problem in another task's area, post a `finding`; never edit its files.
4. Self-check: run `git status --short` in your worktree (in the delivery worktree, read only your own paths); every path you changed must be in your Code files or Browser scenario table. Reread each file against your Done when lines and the Agreed interfaces, and fix what does not match.
5. In a task worktree only, copy your files into the delivery worktree and remove your task worktree:

```sh
task="<task worktree>"; delivery="<delivery worktree>"
git -C "$task" add -A
git -C "$task" diff --cached --name-status
git -C "$task" diff --cached --binary -- <the paths listed in task.md> | git -C "$delivery" apply
git -C "$delivery" worktree remove --force "$task"
```

   Copy only listed paths; report any other staged path under `needs`. `git apply` writes only the delivery worktree's files; nothing is committed. If it fails, keep the task worktree and report the error lines and paths as `blocked`.
6. Check your files once, in the delivery worktree, in one shell call: `scripts/dc bunx biome check --write <your files>` and `scripts/dc bunx turbo run check-types --filter=<the owning packages in task.md>`. Fix errors in your own files there and run the failing command once more. Errors in another task's files are not yours: report them under `needs` with the task id that owns the file.
7. Append `<task id> done` to `board-log.md`.

Run no browser test and no full verify; scenarios run in the full verify at the end. Run only the generating commands your `task.md` lists, and only in the delivery worktree. Do not commit.
