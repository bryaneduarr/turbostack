# Agent harnesses

Evidence: 2026-10-26; `31c5212` plus uncommitted step 1 of the template port; source-inspected, Claude Code discovery not runtime-verified.

- Pi reads [AGENTS.md](../../../AGENTS.md) and `.agents/skills/` directly; `CLAUDE.md` is a symlink to it.
- Skills live in `.agents/skills/<group>/<name>/` (`coding`, `github`, `testing`, `workflow`); `.claude/skills/<name>` holds one symlink per skill because Claude Code discovers one level deep.
- `.claude/settings.json` empties commit and PR attribution.
- `.gitignore` excludes `.pi/` and `.claude/settings.local.json`.
