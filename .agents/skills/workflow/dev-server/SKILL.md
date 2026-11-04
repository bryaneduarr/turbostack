---
name: dev-server
description: "Start, check, read the logs of, restart, and stop the development server (client and API) in a work tree or branch, find its URLs, sign in, and look at it with agent-browser, while other work trees run their own servers at the same time. Use when a task needs the running app, a page, an email, or a live reload, and when creating or finishing a work tree that runs one."
---

# Dev server

Each work tree runs its own dev server in its own stack: database, ports, host name, and log. Servers in different work trees never share data, ports, cookies, or processes. Run everything from the work tree root. Never use `bun run dev`: its screen locks the terminal.

## Output

A running server whose URLs you read from `scripts/dc ports`, checked in a browser or with `curl`, and stopped when you finish.

## Is it running?

`scripts/dc list` shows every stack and starts nothing. Find the row whose work tree is yours:

| STATE | BUSY | Meaning |
| --- | --- | --- |
| `stopped` | | Nothing runs |
| `running` | `yes` | The dev server is running |
| `running` | `no` | The stack is up, the server is stopped |

When the stack is `running`, `bun run dev:status` confirms it (exit 0 means healthy). A `LAST-USE` of `never` means the stack was never used.

## Commands

| Task | Command | Notes |
| --- | --- | --- |
| Start | `bun run dev:start` | Starts the stack first when it is down (under a minute, longer for the first work tree ever). Applies migrations, seeds the database, then returns when API and client answer (a few seconds when the stack is up). Exit 1 `already running` means it is up. Its last line prints in-container ports (`:3000`); ignore them |
| URLs | `scripts/dc ports` | `client` and `api` as `http://<stack>.localhost:<port>`. Ports differ per work tree; never assume `3000` |
| Check | `bun run dev:status` | Healthy: exit 0 and `200` lines. Stopped: `Not running.`, `0` lines (not answering), exit 1. Prints in-container URLs too; ignore them. It **starts the stack** when the stack is down, so check with `scripts/dc list` first |
| Logs | `tail -n 50 .turbo/dev-stack/dev-stack.log` | Plain text on the host; `grep -iE "error\|failed"` for problems, `grep server.started` for the API |
| Restart | `bun run dev:stop` then `bun run dev:start` | Needed after changes to `.env` files or configuration. Page code reloads by itself |
| Stop server | `bun run dev:stop` | Safe to repeat (`Not running.`). Leaves the stack up |
| Stop stack | `scripts/dc stop` | Frees memory, keeps data |
| Wipe data | `bun run dev:stop && scripts/dc down -v`, then `bun run dev:start` | Deletes this work tree's database; the next start recreates and reseeds them. Browser logins stop working |

`dev:start` prints its result first and the container progress lines after it; both are normal.

## Use it

- **Edit code**: edit files on the host. Client pages reload without a restart. To prove it, open the page first, edit, then poll the page every 3 s for up to 15 s.
- **Database commands**: `bun run seed:dev` and `bun run drizzle:migrate` act on this work tree's database.
- **Browser** (see the [agent-browser skill](../../testing/agent-browser/SKILL.md)): `S=$(agent-browser session id --scope worktree --prefix task)` prints the session name (the prefix gets a suffix). Each bash call is a new shell, so pass `--session <that name>` on every command.
  - `open "<client url>"`, then `snapshot -i`, then `fill`, `click` using the `@refs` of the latest snapshot (they change after a reload), and `close` at the end.
  - Read the page title: `eval "document.title"`.
  - `curl <url>` works too, since `*.localhost` resolves to your machine.
- **Checks while it runs**: `bun run verify` uses its own ports (3100 and 3101) and runs beside the dev server; together they use more memory.

## Branches and work trees

- **Create**: `git worktree add ~/worktrees/<repo>/<feature> -b <branch>`, then `bun run dev:start` inside it. No `.env` copying, no install on the host.
- **Isolation**: one agent per work tree. Two agents in one work tree share one stack, one log, and one `dev:stop`.
- **Simultaneous servers**: the machine runs about three stacks at once. A start past the cap stops the least recently used idle stack (another work tree's stack can go down while you work), or waits while all are busy (exit 75 after 45 minutes). A stack with a running dev server counts as busy, so stop yours when you finish.
- **Switch branches** inside a work tree with `git switch` (or `git switch -c <new>`), then `bun run dev:stop` and `bun run dev:start` in that order, so the new branch's migrations apply. Open pages reload. Uncommitted edits travel with you; a switch that conflicts with them fails. Git refuses a branch another work tree holds.
- **Never** use another work tree's URL, log, or database to learn about your own.

## Finish

1. `bun run dev:stop`, then `scripts/dc stop`, then `scripts/dc list` to see your stack `stopped`.
2. Remove a throwaway work tree: `scripts/dc down -v`, then `git worktree remove <path>` and `git branch -D <branch>`.
3. Restore only the files you changed.

## When it fails

| Symptom | Cause and action |
| --- | --- |
| `dev:start` exits 1, `already running` | Up already. Use `scripts/dc ports` |
| `dev:start` exits 1, `exited early` or `Not ready after 240s` | Read the log named in the message, fix the cause, run `dev:start` again |
| `dc: still waiting for a free stack slot` | Every stack is busy. Wait, or `scripts/dc list` and stop yours |
| Page shows another work tree's content | You used a remembered URL. Run `scripts/dc ports` |
| `password authentication failed` | Stale database volume: wipe data, then start again |
| Exit 69 | Docker is not running. Report the check as blocked |
