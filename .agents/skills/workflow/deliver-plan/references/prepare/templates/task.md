# <task-id>: <task title>

Branch: `<feature>`. Needs: <task ids, or none>. Plan steps: <numbers>. Review slice: <slice id>.

## Scope

<What a reviewer sees, in one line.> Not here: <nearby work and the task that owns it>.

## Code files

Written in the code stage.

| Path | Action |
| --- | --- |
| `<path>` | add |

Shared files owned: <routers, catalogs, migrations, `bun.lock`, or none>.

## Test files

Written in the test stage, after the PR is open.

| Path | Action | Proves |
| --- | --- | --- |
| `<path>.test.ts` | add | <behavior or Done when line> |

## Agreed interfaces

- Uses `<path>` from <task id>: exports `<names>`.
- Provides `<path>` to <task id>: exports `<names>`.

## Brief

- Read: `<file to mirror>` for <the shape>; <skill paths, or none>.
- Code: <per code file, the exact behavior>.
- Tests: <per test file, the cases and assertions>.
- Done when: <checkable conditions; test file, case, and assertion>.
- Run: <only commands that generate files, such as `drizzle:generate`, or none>.
