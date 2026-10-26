# @workspace/rules

Fast, deterministic checks for the project rules in `.agents/rules/` that Biome
cannot express: file and folder naming, role placement, file size, type
placement, contract and schema documentation, route definitions, comment style,
suppressions, example data, test runner use, and dependencies.

## Usage

From the workspace root:

```sh
bun run check:rules
```

It reads every tracked and new, unignored file, prints each violation as
`path:line  [rule-id]  message`, and exits non-zero when any remain. It also runs
in `bun run check`, `bun run verify`, and CI.

## Structure

```text
config/rules/src/
├── check-rules.script.ts   Entry point.
├── checks/                 One file per rule, grouped by area.
├── config/                 Enabled checks, roles, placements, and exceptions.
├── services/               File listing, comment scanning, and the runner.
└── types/                  Check, violation, and file contracts.
```

## Changing the rules

- **Fix before excepting.** When a file truly cannot follow a rule, add an entry
  with its reason to `src/config/exceptions/rule-exceptions.config.ts`.
- **New role suffix.** Adding one to `src/config/naming/file-roles.config.ts` is
  an architecture decision; record it in the structure rules too.
- **New check.** Add `src/checks/<area>/<rule>.check.ts`, register it in
  `src/config/checks/enabled-checks.config.ts`, and cover its matching logic
  with a `bun:test` file next to it.
