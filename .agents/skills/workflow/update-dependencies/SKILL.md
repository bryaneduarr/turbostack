---
name: update-dependencies
description: "Update every dependency of the project to its latest version, fix the fallout, verify, and make one commit whose message lists each updated dependency per package.json. Use when the user asks to update, upgrade, or bump the project's dependencies."
---

# Update dependencies

Moves every workspace to the latest versions, proves the project still passes its checks, and records the whole upgrade in a single commit.

## Output

- All dependencies, the Bun and Turbo pins, and the lockfile at their latest versions.
- One commit with the message format in [commit message](references/commit-message.md), also shown to the user as copyable Markdown.
- No push.

## Steps

Run every command through `scripts/dc` ([run-in-container](../run-in-container/SKILL.md)), never on the host.

1. Check `git status --short`. Changes unrelated to the upgrade stay out of the commit; report them.
2. List what is behind: `scripts/dc bun run outdated`.
3. Update all workspaces to latest, including major versions: `scripts/dc bun update --latest --recursive`.
4. Re-pin Bun and Turbo in `package.json` and the Dockerfiles: `scripts/dc bun run update:toolchain`.
5. Fix what the new versions break, and nothing more:
   - Run `scripts/dc bunx biome migrate --write` when Biome changed its version.
   - Read the changelog of each major bump and the lint output, and migrate newly deprecated APIs in the same change ([code quality](../../../rules/code-quality.md), Deprecated APIs).
   - Fix a lint or type error the smallest correct way. Never suppress a rule or lower its level.
6. Pass `scripts/dc bun run verify` once the fixes are done, or `scripts/dc bun run verify --failed` after a fix, as the [code quality](../../../rules/code-quality.md) Work order and Required delivery behavior describe. Restore `apps/client/next-env.d.ts` with `git checkout` if the build rewrote it.
7. Commit with [commit message](references/commit-message.md), then run `scripts/dc stop`.

## Stop instead of committing

- A check still fails after the smallest correct fix: report the failing output and what was changed, and leave the work uncommitted.
- A dependency was added or removed rather than updated: the script warns; report it.

## Report

Show the commit message in a Markdown code block so the user can copy it. State the checks that passed and any that were not run, such as the Firefox or WebKit tests.
