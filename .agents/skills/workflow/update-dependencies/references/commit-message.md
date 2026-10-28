# Commit message

The user chose this format for dependency upgrades. For this commit it replaces the Conventional Commit title and body rules of the [commit-changes skill](../../../github/commit-changes/SKILL.md). Its other rules still apply: stage explicit paths, never push, amend, or bypass hooks, and never add AI attribution.

## Generate it

Never type versions by hand. After the upgrade and the checks, with the changes still uncommitted:

```sh
scripts/dc bun scripts/dependency-commit-message.script.ts > "$(git rev-parse --git-dir)/DEPENDENCY_COMMIT_MESSAGE"
```

The script compares each changed `package.json` with `HEAD` and prints only `dependencies`, `devDependencies`, `peerDependencies`, and `optionalDependencies` whose version range changed. Docker progress goes to stderr, so the file holds only the message. Read it before committing.

## Commit it

1. Stage explicit paths of the upgrade: every changed `package.json`, `bun.lock`, the Dockerfiles, and the files changed by the fixes in step 5. Never `git add .`.
2. Inspect `git diff --cached --check` and the staged path list.
3. Create exactly one commit: `git commit -F "$(git rev-parse --git-dir)/DEPENDENCY_COMMIT_MESSAGE"`.
4. Print the message in a Markdown code block for the user.

The message lists only dependency changes in `package.json` files. The lockfile, Dockerfile pins, and fixes travel in the same commit without being listed.

## Format

```markdown
updated dependencies to latest version

**client/package.json**

- updated next from `^16.4.2` to `^16.4.3`.
- updated @types/bun from `^1.4.3` to `^1.4.4`.

**config/biome/package.json**

- updated @biomejs/biome from `^2.5.15` to `^2.6.3`.

**package.json**

- updated turbo from `^2.10.12` to `^2.11.10`.
```

- The title is exactly `updated dependencies to latest version`.
- Each `package.json` gets a bold title and one blank line before its list.
- Each updated dependency is one `-` item: `updated <name> from \`<previous>\` to \`<new>\`.`, past tense, versions in backticks, ending with a period.
- A `package.json` with no version change is left out.

## Titles

- Use the folder of the file plus `/package.json`, one level only: `apps/client/package.json` is `client/package.json`, `packages/ui/package.json` is `ui/package.json`.
- Folders under `config/` keep it: `config/biome/package.json`.
- The root file is `package.json` and comes last, after `apps/`, `config/`, and `packages/`.
