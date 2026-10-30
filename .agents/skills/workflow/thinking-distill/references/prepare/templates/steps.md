# <Feature>: steps

Branch: `<feature>`. Build the steps in order. Each step is finished when its Done when lines are true and its own files pass Biome and the type check.

## Vision

<The goal sentence and why it matters, in two sentences.>

## Agreed interfaces

The words, names, and shapes that more than one step uses. Fixed here so no step has to wait for another.

- `<path>`: exports `<names>`; used by <step ids>.
- Screen: labels `<text>`, routes `<path>`, test ids `<id>`, seeded data `<values>`.

## Order

| Step | Purpose | Plan steps | Needs | Risk |
| --- | --- | --- | --- | --- |
| s01 | <one line> | <numbers> | none | normal |

## s01: <step title>

Plan steps: <numbers>. Needs: <step ids, or none>. Risk: <normal or high>.

### Piece

<What this step adds, in one line, and how it serves the vision.>

### Not this step

- <Nearby work>: <step id that owns it>.

### Code files

| Path | Action |
| --- | --- |
| `<path>` | add |

Shared files owned: <routers, catalogs, migrations, `bun.lock`, or none>.

### Browser scenario

Omit the table when the step has none.

| Path | Action | Proves |
| --- | --- | --- |
| `apps/client/src/e2e/<area>/<name>.e2e.ts` | add | <behavior or Done when line> |

### Reuse

Import these; never copy them:

- `<path>`: `<export>` for <what>.

### Rules that bite

- `<rule file>`, <section>: <what it means for this piece>.

### Brief

- Read: `<file to mirror>` for <the shape>; <skill paths, or none>.
- Code: <per code file, the exact behavior>.
- Scenario: <per browser scenario, the steps and assertions, or none>.
- Done when: <checkable conditions for this piece only: file and behavior>.
- Run: <only commands that generate files, such as `scripts/dc bun run drizzle:generate`, or none>.
- Check: Biome on <your files> and the type check of <owning package names>, once your files are complete.
- If unclear: use the plan's best reading, and note it for the close report under `decided`.
