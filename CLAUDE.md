## Claude Code

`AGENTS.md` above is the single source of instructions for every harness. This file only maps it to Claude Code; do not duplicate rules here.

- Project skills live in `.agents/skills/`. `.claude/skills` is a symlink to that folder, so Claude Code lists them as skills; add or edit skills only in `.agents/skills/`.
- Use the `Skill` tool or `/<skill-name>` to load a skill. Run context reviews with `/context-review` (the Pi equivalent is `/skill:context-review`) and only when explicitly requested.
- Skill `allowed-tools` frontmatter can pre-approve tools in Claude Code. It still does not authorize tests, browser automation, commits, pushes, or other actions that `AGENTS.md` restricts.
- Keep personal Claude Code settings in the ignored `.claude/settings.local.json`.
