# implement

Code stage. Write the Code files in your `task.md`, all the logic your piece needs to work, plus its browser scenario when `task.md` lists one, and nothing else.

1. Read the chat for posts that mention you or announce something you use.
2. Read the files `task.md` tells you to mirror. Write each Code file right the first time, following every applicable rule, because reviewers read every line later.
3. Honor the Agreed interfaces exactly, even when the other task's file does not exist in your worktree. When you must change an export others use, post an `announce` before changing it.
4. After each file, read the chat again. When you see a problem in another task's area, post a `finding`; never edit its files.
5. Self-check: run `git status --short` in your worktree (in the delivery worktree, read only your own paths); every path you changed must be in your Code files or Browser scenario table. Reread each file against your Done when lines and the Agreed interfaces, and fix what does not match.
6. Post a `done` post that says what your piece provides, and append `<task id> done` to `board-log.md`.

Run no check, formatter, or test. Run only the generating commands your `task.md` lists, and only in the delivery worktree. Do not commit.
