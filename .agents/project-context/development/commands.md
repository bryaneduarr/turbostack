# Development commands

Evidence: 2026-10-28; `chore/fast-checks` on `759ac4e`; `scripts/dc bun run verify` passed 8/8 (about 12 s warm) and `verify --failed` passed. `start:docker` not rerun since 2026-10-14.

- Toolchain: Git, Bun (`packageManager`), Docker. `update:toolchain` pins Bun/Turbo.
- First run: `bun run dev`. Agents use `dev:start`/`dev:status`/`dev:stop` ([dev-server skill](../../skills/workflow/dev-server/SKILL.md)). Root scripts forward into the stack on the host (`scripts/in-stack`).
- One check: [verify](../../../scripts/verify-workspace.script.ts) runs lockfile, Biome, boundaries, rules, compose, migrations, types and builds, then e2e (api, chromium); it stops at the first failure and records `.turbo/verify/last-result.json`. `verify --failed` is the fix loop. Types and builds run two at a time. The browser step installs the browsers, prepares the test database, then runs `bun scripts/run-browser-tests.script.ts`: one Playwright run from `apps/client` without Turbo (`--failed` reruns only failed tests; `bun run test:e2e:only [folders]` runs a subset). `apps/client/turbo.json` leaves `src/e2e` and the Playwright config out of the build inputs.
- User decided 2026-10-28: no unit tests; code first, then review, then one `verify`. Rejected: `check`, `test`, `test:e2e:changed`.
- Database: `db:up`, `db:provision`, `drizzle:*`, `seed:dev`.
