# Devcontainer workflow

Evidence: 2026-10-28; `932c1ea`; `dc-test`, `dc-smoke-test` (39/39), a fresh clone with `check` and e2e, shellcheck, and `biome ci` ran.

- Decided (user, plan): all work runs through `scripts/dc` in one stack per work tree, never on the host; Linux and WSL2 only.
- Built: `scripts/dc-lib/`, shared image and cache, cap 2, idle stop 15 minutes, `dc.managed` label, notes in `dc/v1`, prefix rename. Numbers.
- Workspace limits (2026-10-28): memory 8 GiB by default; `scripts/dc` sets `DEVCONTAINER_WORKSPACE_CPUS` to the host's cores minus two unless it is already set.
- Not run: VS Code, macOS, Docker missing.
- Guide: [skill](../../skills/workflow/run-in-container/SKILL.md).
