---
name: run-in-container
description: "Run every build, install, test, and app command in the work tree's own devcontainer stack through scripts/dc, never on the host, and manage stacks (list, stop idle, prune) without asking the user. Use before the first project command of a session, whenever a command fails with a missing tool or database, when stacks are idle, full, or busy, and when the user mentions the container, Docker, or the devcontainer."
---

# Run in the container

Everything that builds, installs, tests, or runs the project runs in a devcontainer stack: workspace and PostgreSQL. Each work tree (the primary checkout or a linked `git worktree`) has its own stack, created by `scripts/dc` from the folder you call it in. Nothing is installed or run on the host. Only git, `gh`, Docker, the agent tool, and the user's browser stay there. Details: [references](references/README.md).

## Output

The right command form for the place you run in, no host-built files, and no idle or leftover stack.

## Detect where you are

Run once per session, from the work tree you work in:

```sh
test "${DEVCONTAINER:-}" = true && echo inside || { docker info >/dev/null 2>&1 && test -x scripts/dc && echo host-with-docker || echo blocked; }
```

| Result | Meaning | Run project commands |
| --- | --- | --- |
| `inside` | You are in a `workspace` container (`/workspace`) | Directly: `bun run verify` |
| `host-with-docker` | Host, Docker works | Through `scripts/dc`, always |
| `blocked` | Docker is missing or stopped | Nowhere. Report every check as blocked and name the missing Docker. Never fall back to the host: no host `bun install`, `bun run`, `turbo`, `node`, PostgreSQL, or Playwright |

## On the host with Docker

- Prefix every `bun`, `bunx`, `turbo`, and `node` command with `scripts/dc`: `scripts/dc bun run verify`, `scripts/dc bun run verify --failed`, `scripts/dc bun run test:e2e -- --project=firefox`.
- `scripts/dc` starts this work tree's stack when it is down. The first call builds the shared image and installs packages (minutes); later calls and second work trees reuse them. Run long commands detached with output in a log file, and poll the file.
- `scripts/dc` keeps your subdirectory, forwards standard input, and returns the command's exit code. Killing it kills the command inside.
- Work trees live under `~/worktrees/<repo>/<feature>`. Create one with `git worktree add`, then call `scripts/dc` inside it. No `.env` copying and no host install.
- Playwright (Chromium and Firefox; WebKit is CI only) runs in the container.

## Standing rule: resources

Any agent on any branch that notices idle stacks, a full stack cap, or a busy slot acts on it through `scripts/dc` at once, without asking the user: `scripts/dc list`, then `stop-idle`, `stop` for a stack you started and finished with, or `prune`. A call that must wait prints progress and exits 75 after 45 minutes; report that, never ask.

- Stop what you start (`scripts/dc stop` in your work tree) when you finish. Leave stacks you did not start alone unless `list` shows them idle.
- Never run `docker compose` on a stack by hand, never touch the primary stack's data, and never use `down -v` unless the database password is stale.

## Files, search, edits, git

- Read, search, and edit on the host with the normal tools. The container sees every edit at once.
- Run git on the host, including commits through the `commit-changes` skill.
- Type lookups read `node_modules` on the host; they work without running anything.

## Browser

- The container has no screen. Interactive browser work (only when the user asks) stays on the host with the `agent-chrome` tools from the [use-browser skill](../../testing/use-browser/SKILL.md), pointed at the URLs from `scripts/dc ports`.
- Inside the container, tell the user that interactive browser work must run from the host.

## When something fails

See [stack commands and failures](references/stack-commands.md). If `scripts/dc list` is not a command, the stack tool is older than these instructions: still run everything through `scripts/dc`, skip `list`, `stop`, and `prune`, and report that.
