# Isolated stacks

## Request

> "Can you add the new commits and planification that we did in the project of [the source project] in this project. What we did in the main branch is to make more efficient the process of how to start the containers and how the isolation needed to work, that is what I want but in this project instead."

- Date (UTC): 2026-10-28. Git revision: `74262ad` (`main`, clean tree). Work branch: `template/06-isolated-stacks`.
- Source: the source project's `isolated-delivery` plan and its ten commits `06ff1215` to `7e383a06` (the project this template came from).

## Goal

Everything that builds, tests, or runs the project, for people and for agents, runs inside devcontainer stacks. One stack (workspace and PostgreSQL) per work tree, created automatically by `scripts/dc`, so branches never share a database, ports, or files and nothing is installed on the host.

Stacks stay cheap on a machine with little memory: one shared image and package cache, at most 2 running at once, idle stacks stopped by whichever branch notices them, heavy jobs queued one at a time, and every container limited.

The template differs from the source in one way: it has no Mailpit, RustFS, admin app, or worker, so those ports, services, and checks are not ported.

## Done when

1. `scripts/dc` called from the primary checkout or a linked work tree starts that tree's own stack with no variables and no manual mounts; `scripts/dc git rev-parse --show-toplevel` prints `/workspace`.
2. Two stacks run side by side with separate databases, ports, and `node_modules`; `scripts/dc list` shows state, last use, busy flag, ports, and work tree.
3. A second stack reuses the image and the package cache.
4. At most 2 stacks run; an idle one is stopped to make room; a stack with a running command or extra process is never stopped; waiting ends with exit 75 after 45 minutes.
5. Heavy commands run one at a time across stacks, database commands one at a time per stack, and killing a host command leaves no process in the container.
6. `scripts/dc bun run test:e2e` passes in the container on api, chromium, and firefox (WebKit is skipped there).
7. `scripts/dc-test` and `scripts/dc-smoke-test` pass, and shellcheck is clean.
8. `thinking-distill`, `deliver-plan`, `run-in-container`, `verify-e2e`, the rules, `AGENTS.md`, the methods guide, and the docs agree on the container-only workflow.
9. `scripts/dc bun run check:rules` and `scripts/dc bunx biome ci .` pass. A search for the source project's name over tracked files, excluding `.agents/plans/template-port/`, finds nothing.

## Decisions

Labels: **user** is a choice the user made in the source project; **default** was proposed there and accepted. All carry over unchanged.

1. **Everything isolated (user).** Building, testing, installing, and running happen only in devcontainer stacks. Docker, git, `gh`, the agent tool, editors, and the browser stay on the host. No host fallback: without Docker, checks are reported as blocked.
2. **One stack per work tree (user).** Created automatically by `scripts/dc` from the folder. Rejected: one shared container that switches branches.
3. **Capacity (user).** At most 2 stacks run; idle ones stop automatically; a delivery stops its stack at the end.
4. **Where agents run (user).** The agent tool stays on the host and edits through the shared folder; every command, install, test, and Playwright browser runs in the container. Interactive browser tools stay on the host.
5. **Sharing (user).** Each stack has its own PostgreSQL. Only the image, the package cache, and the browser download are shared.
6. **Idle (user).** 15 minutes, with a running command or extra process counting as busy. Stopping keeps the data; `scripts/dc prune` deletes stacks whose work tree is gone.
7. **Automatic and silent (user).** Any agent on any branch that notices idle stacks, a full cap, or a busy slot acts through `scripts/dc` without asking.
8. **Defaults (default).** No background daemon (the reaper runs inside `scripts/dc`); no Docker socket in the container; `flock` is the lock tool (Linux and WSL2, not macOS); work trees live in `~/worktrees/<repo>/<feature>`; the primary checkout keeps the project name `app-devcontainer`; WebKit is CI only.
9. **Naming (default, template).** Neutral names: `app-devcontainer`, `app-workspace`, `app-bun-cache`, `app-playwright-browsers`, `DEVCONTAINER` and `DEVCONTAINER_*_PORT`, and `DC_*` settings.

## Scope

### In

- `scripts/dc` as a small entry plus modules in `scripts/dc-lib/`, `scripts/dc-test`, and an extended `scripts/dc-smoke-test`.
- `.devcontainer/` (Dockerfile, compose, start script, `devcontainer.json`) and the WebKit skip in `apps/client/playwright.config.ts`.
- Skills `thinking-distill`, `deliver-plan`, `run-in-container`, `verify-e2e`; `code-quality.md`, `AGENTS.md`, the methods guide; `docs/devcontainer.md`, `docs/run-tests.md`, `docs/requirements.md`; project notes.

### Out

- Pushing, a pull request, macOS, native Windows, WebKit locally, Docker-in-Docker, a shared database, a background daemon, and running the agent inside a container.

### Defaults

| Setting | Default | Variable |
| --- | --- | --- |
| Running stacks | 2 | `DC_MAX_STACKS` |
| Idle before stop | 15 minutes | `DC_IDLE_MINUTES` |
| Heavy slots | 1 | `DC_HEAVY_SLOTS` |
| Longest wait for a stack or slot | 45 minutes, then exit 75 | `DC_WAIT_MINUTES` |
| Age before an orphaned stack is deleted | 7 days | `DC_PRUNE_DAYS` |
| State directory | `${XDG_STATE_HOME:-$HOME/.local/state}/app-dc` | `DC_STATE_DIR` |
| Workspace memory and CPUs | 6 GB and 8 | `DEVCONTAINER_WORKSPACE_MEMORY`, `DEVCONTAINER_WORKSPACE_CPUS` |

Heavy commands are build, check, verify, e2e, and Playwright. Database commands are tests, `db:*`, `drizzle:*`, `seed:dev`, and `dev:start`. `DC_LOCK=none|stack|heavy` overrides the choice for one call.

## Risks

- **Two tools share Docker labels, not state.** Stacks are found by Compose labels, so a stack started by another project's `scripts/dc` counts toward the cap and can be stopped as idle, because this tool keeps its own last-use records. Fix: set both projects' state directory to one folder, or keep the cap and idle settings high while both are in use.
- **Memory overload.** Fix: heavy slot, cap, and container limits from [measurements](measurements.md).
- **The reaper stops something in use.** Fix: the use lock and the process check; `down` keeps data, so the worst case is a short resume.
- **First use downloads about 1.5 GB (image layers, browsers).** Accepted: one time, shared by every stack.
- **`flock` is missing on macOS.** Accepted.

## Steps

1. Port the tool: `scripts/dc`, `scripts/dc-lib/`, `scripts/dc-test`, `scripts/dc-smoke-test`, with the neutral names and without Mailpit, RustFS, and admin. Verify: `scripts/dc-test`, shellcheck.
2. Port `.devcontainer/` and the Playwright config. Verify: `docker compose config --quiet`; the stack starts; e2e passes in the container.
3. Port the skills, rules, `AGENTS.md`, and the methods guide; update the docs.
4. Record the project notes through the project-context skill.
5. Commit through commit-changes in dependency order (tooling, client config, then `.agents` and `docs`), with no push.
6. Check a second work tree on the committed code, then stop every stack this work started.
