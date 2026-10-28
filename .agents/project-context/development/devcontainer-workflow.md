# Devcontainer workflow

Evidence: 2026-10-28; `9336cc7`; `dc-test`, shellcheck, `check:rules`, `biome ci`, and e2e (12 passed) ran in the stack.

- Decided (user, [plan](../../plans/isolated-stacks/plan.md)): all work runs through `scripts/dc` in one stack per work tree, never on the host; idle, full, and busy stacks are handled without asking.
- Built: `scripts/dc-lib/`, shared image and cache, cap 2, idle stop 15 minutes. [Numbers](../../plans/isolated-stacks/measurements.md).
- Not run: `dc-smoke-test`, VS Code, macOS.
- Guide: [skill](../../skills/workflow/run-in-container/SKILL.md).
