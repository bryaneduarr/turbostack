# Agent harnesses

Evidence: 2026-10-14; `018c6c1`; uncommitted harness files below; source-inspected, Claude Code discovery not runtime-verified.

- Pi reads [AGENTS.md](../../../AGENTS.md) and `.agents/skills/` directly.
- Claude Code reads [CLAUDE.md](../../../CLAUDE.md), which imports `AGENTS.md` and maps skill usage.
- `.claude/skills` symlinks to `.agents/skills`; edit skills only there.
- `.gitignore` excludes `.pi/` and `.claude/settings.local.json`.
