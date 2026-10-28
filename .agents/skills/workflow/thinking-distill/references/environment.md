# Environment in a plan

Every plan that builds, changes, or tests code carries this decision, worded for the feature, under Decisions:

> **Environment.** All building, installing, testing, and running happens in the devcontainer stack of the work tree, through `scripts/dc`. Nothing is installed or run on the host; only git, `gh`, Docker, the agent tool, and the user's browser stay there. If Docker is missing, the checks are reported as blocked and never run on the host. Stacks are managed automatically through `scripts/dc` (stop idle ones, respect the cap, wait for a busy slot) and the user is never asked about resources.

Rules for the rest of the plan:

- The first step of a plan that delivers code creates the work tree under `~/worktrees/<repo>/<feature>` with `git worktree add`, then makes the first `scripts/dc` call there (it builds the stack and can take minutes: run it detached and poll).
- Write every verify line as `scripts/dc bun run ...`, never a bare `bun`, `bunx`, `turbo`, or `node`, and never a host service or lock.
- A delivery ends by stopping the work tree's stack with `scripts/dc stop`; its data stays until `scripts/dc prune` removes it.
- Do not ask the user how many stacks, how much memory, or when to stop idle ones. The limits are defaults in `scripts/dc`.
- A plan with no code (research, wording only) omits the decision.
