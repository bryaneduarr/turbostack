# <task-id>: <task title>

Branch: `<feature>`. Wave: <n>. Needs: <task ids, or none>. Plan steps: <numbers>. Review slice: <slice id>. Size: <S, M, or L>. Risk: <normal or high>.
Worktree: <`~/worktrees/<repo>/<feature>.tasks/<task-id>` (own), or the delivery worktree>.

## Vision

<The feature's goal sentence and why it matters, the same two sentences in every task.>

## Your piece

<What this task adds, in one line, and how it serves the vision.>

## Not yours

- <Nearby work>: <task id that owns it>.

## Code files

| Path | Action |
| --- | --- |
| `<path>` | add |

Shared files owned: <routers, catalogs, migrations, `bun.lock`, or none>.

## Browser scenario

Omit the table when the task has none.

| Path | Action | Proves |
| --- | --- | --- |
| `apps/client/src/e2e/<area>/<name>.e2e.ts` | add | <behavior or Done when line> |

## Agreed interfaces

- Uses `<path>` from <task id>: exports `<names>`.
- Provides `<path>` to <task id>: exports `<names>`.

## Reuse

Import these; never copy them:

- `<path>`: `<export>` for <what>.

## Rules that bite

- `<rule file>`, <section>: <what it means for this piece>.

## Brief

- Read: `<file to mirror>` for <the shape>; <skill paths, or none>.
- Code: <per code file, the exact behavior>.
- Scenario: <per browser scenario, the steps and assertions, or none>.
- Done when: <checkable conditions for this piece only: file and behavior>.
- Run: <only commands that generate files, such as `drizzle:generate`, in the delivery worktree, or none>.
- Check: Biome on <your files> and the type check of <owning package names>, in the delivery worktree, once your files are complete.
- If unclear: post an `ask` in the chat, continue with the plan's best reading, and report it under `decided`.
