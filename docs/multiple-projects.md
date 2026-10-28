# Work on more than one project

Every project made from this template shares one notes folder, the shared notebook. `scripts/dc` writes in it which stacks exist, when each was last used, and which are busy. Because of it, two or more projects take turns on the same small machine: together they run at most 2 stacks, and one heavy command (build, check, end-to-end tests) at a time. Without it, each project would run its own 2 stacks and the machine could run out of memory.

You only need this page if you keep two or more projects made from this template on one machine. A single project works with no setup.

## What is shared and what is not

| Shared by every project | Separate for each project |
| --- | --- |
| The notes folder `~/.local/state/dc/v1` | Container, image, and volume names (the prefix) |
| The stack limit, the idle timer, and the heavy-command slot | The database and its data |
| The `dc.managed` label that marks stacks the tool manages | `node_modules` and the env files |

Containers of other dev container projects, without the `dc.managed` label, are never listed, stopped, or counted.

## Example: two projects, `shop` and `blog`

Both are cloned from this template. Do the steps once per project, before its first `scripts/dc` call.

### 1. Clone each project

```sh
git clone <repository> shop
git clone <repository> blog
```

### 2. Give each project its own container prefix

In `shop`, open `scripts/rename-workspace-scope.script.ts` and set the two names at the top:

```ts
const NEW_SCOPE = "shop";
const NEW_CONTAINER_PREFIX = "shop";
```

Then run the rename once and remove the packages it installed on your machine, so the container installs its own. The rename needs Bun on your machine (see [requirements](requirements.md)):

```sh
cd shop
bun run rename-scope
bun run clean
```

Commit the rename (`git commit -am "chore: name the project"`). A `git worktree` only sees committed files, so an uncommitted rename would give its stack the old prefix.

Do the same in `blog` with `"blog"` for both names. The prefix is lowercase letters, digits, and dashes. Pick a different prefix for every project, because the containers and volumes of two projects with the same prefix would share one database.

If you already started a stack before renaming, run `scripts/dc down -v` first. That deletes the old local database; the renamed stack starts with a new one.

### 3. Start each project

```sh
cd shop && scripts/dc bun run verify
cd ../blog && scripts/dc bun run verify
```

The first start builds the shared image and downloads the packages; the second project reuses them where it can.

### 4. Verify that both projects share the notebook

Run these from either project:

```sh
scripts/dc list
```

You should see both projects in one list, each with its own name and ports:

```text
PROJECT            STATE    LAST-USE   BUSY  PORTS                     WORK-TREE
shop-devcontainer  running  1m ago     no    api:3004 client:3003      /home/you/shop
blog-devcontainer  running  0s ago     no    api:3006 client:3005      /home/you/blog
```

Check the notebook folder and the label:

```sh
ls ~/.local/state/dc/v1/stacks
docker ps --filter label=dc.managed=true --format '{{.Names}}'
```

The first command lists one set of files per project (`shop-devcontainer.root`, `blog-devcontainer.root`, and so on). The second lists the workspace container of every running project.

Last, check that the limit is shared. Start a third stack, for example from a `git worktree` of `shop`, while both are running. The least recently used idle stack is stopped, and `scripts/dc` prints `dc: stopped idle stack ... to stay within 2 running stacks.`

## Use another notes folder

The default folder works for everyone. To keep it somewhere else, set the same value for every project, once, in your shell profile:

```sh
export DC_STATE_DIR="$HOME/.local/state/dc/v1"
```

Projects with different values do not see each other's stacks. They then each keep their own limit, and the machine can run out of memory.

## Change the limits

| Setting | Default | Meaning |
| --- | --- | --- |
| `DC_MAX_STACKS` | 2 | Stacks running at once, across all projects |
| `DC_IDLE_MINUTES` | 15 | Minutes without use before a stack is stopped |
| `DC_HEAVY_SLOTS` | 1 | Heavy commands at once, across all projects |

Set them in your shell profile so every project reads the same values. On a machine with more memory, a higher `DC_MAX_STACKS` lets more projects run side by side.

## A project with an older copy of the tool

A project that has its own older `scripts/dc` does not write in the shared notebook, and its containers have no `dc.managed` label, so the projects ignore each other. Nothing breaks, but the limit is not shared. To join it, copy `scripts/dc`, `scripts/dc-lib/`, and `.devcontainer/` from this template into it, then run `scripts/dc list` to confirm it appears.

## When something goes wrong

- **`scripts/dc` stops with exit code 78 and names another folder.** Two projects use the same prefix. Set a different `NEW_CONTAINER_PREFIX` in the project you just opened and run `bun run rename-scope`.
- **A project is missing from `scripts/dc list`.** Its containers lack the `dc.managed` label or its `DC_STATE_DIR` differs. Compare `echo "$DC_STATE_DIR"` in both shells.
- **`scripts/dc` stops with exit code 69.** Docker is not running, or `flock` is missing. `scripts/dc` runs on Linux and WSL2; on macOS use the dev container from VS Code.
- **`scripts/dc` stops with exit code 75.** Every allowed stack was busy for 45 minutes. Run `scripts/dc list`, and stop one with `scripts/dc stop --all` once its work is done.

More about stacks and limits: [dev container](devcontainer.md). Other failures: [troubleshooting](troubleshooting.md).
