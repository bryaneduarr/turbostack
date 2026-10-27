# Devcontainer workflow

Evidence: 2026-10-26; `9800020` plus uncommitted step 3; `scripts/dc-smoke-test` passed all 18 checks.

- [scripts/dc](../../../scripts/dc) runs commands in the `workspace` container; ports move to the next free one, `scripts/dc ports` prints them.
- The container sets `DEVCONTAINER=true` and runs PostgreSQL only.
- `bun run dev` runs [dev-entry](../../../config/setup/src/dev/dev.script.ts): install if needed, write env files, `doctor`, then `turbo dev` (db up, provision, migrate, seed, `doctor:stack`).
- Guide: [run-in-container skill](../../skills/workflow/run-in-container/SKILL.md).
