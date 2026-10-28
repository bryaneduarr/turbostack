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

## Browser scenario

Written in the code stage when the task's behavior needs verification; omit the table when none.

| Path | Action | Proves |
| --- | --- | --- |
| `apps/client/src/e2e/<area>/<name>.e2e.ts` | add | <behavior or Done when line> |

## Agreed interfaces

- Uses `<path>` from <task id>: exports `<names>`.
- Provides `<path>` to <task id>: exports `<names>`.

## Brief

- Read: `<file to mirror>` for <the shape>; <skill paths, or none>.
- Code: <per code file, the exact behavior>.
- Scenario: <per browser scenario, the steps and assertions, or none>.
- Done when: <checkable conditions; file and behavior>.
- Run: <only commands that generate files, such as `drizzle:generate`, or none>.
