---
name: deliver-feature
description: "Decide whether a change is a small edit or a feature, and for a feature run the full delivery: own work tree and branch, commits, verify, pull request, reviewer subagents, merge, and cleanup so everything ends in main. Use at the start of every implementation task to size it, and again when a feature is coded and ready to ship."
---

# Deliver a feature

Sizes the work, then either just does it or ships it end to end. The user has authorized the whole flow below, including the push, the pull request, and the merge, so never ask before any of it.

## 1. Size the change

| Small change | Feature |
| --- | --- |
| A few files in one area, low risk of breaking a rule: a copy fix, a style tweak, a small bug, a config value. | Many files, a new route, table, package, or screen, work across layers, or anything risky to leave unchecked against the rules. About 8 or more files is the usual line; judge by risk, not only the count. |
| Edit in place, review your own diff against the rules, pass `scripts/dc bun run verify`. **No branch, commit, or pull request.** Leave the change in the working tree and say so in the report. | Do every step below. |

When unsure, treat it as a feature.

## 2. Start a feature in its own work tree

From the primary checkout, with `main` current:

```bash
git fetch origin && git switch main && git pull --ff-only
git worktree add ~/worktrees/<repo>/<feature> -b <type>/<feature> main
```

`<type>` is a commit type (`feat`, `fix`, `refactor`, ...). Work only inside that folder. It has its own stack, ports, database, and dev server ([run-in-container](../run-in-container/SKILL.md), [dev-server](../dev-server/SKILL.md)).

## 3. Build and prove

1. Write the code, review the whole diff against the five rules, then pass `scripts/dc bun run verify` (`--failed` after a fix) until it passes.
2. Commit through [commit-changes](../../github/commit-changes/SKILL.md).
3. When the feature has visible behavior, run it and record screenshots and a video, upload them, and link them in the pull request ([media](../../github/pr/references/media.md)).
4. Push the branch and open the pull request with every commit through the [pr skill](../../github/pr/SKILL.md). Never ask first; opening it is part of the job.

## 4. Reviewer subagents

Launch subagents with the tools you have. Pick the smallest, fastest model available that can read code and follow rules; you decide which.

1. Split the changed files (`git diff --name-only main...HEAD`) into slices a reviewer can read completely, grouped by area. Start one read-only reviewer per slice, all at once.
2. Give each reviewer its file list, the five rule files, and one job: check every file against the rules and report each real violation as rule, `file:line`, and why. No fixing, no style opinions, no repeats of what `verify` already catches.
3. Check every finding yourself against the file. Fix the real ones with new commits through commit-changes, pass `verify --failed`, push, and send only the changed files back to reviewers. Repeat until a round returns nothing.
4. Add the `review: passed` label when the repository defines it (`gh label list`), and a PR comment listing what was reviewed and what was fixed.

Skip this step only for a change that is a feature by size but trivial by risk, such as a rename across files; say that in the report.

## 5. Merge

When `verify` passes, the reviewers return nothing, and the pull request is open:

```bash
gh pr merge <number> --merge --delete-branch
git fetch origin --prune
git merge-base --is-ancestor <pr-head-sha> origin/main
```

The last command must succeed, which proves the head is in `main`. If the merge is refused (conflict, base moved), fix the cause in the work tree, verify again, push, and merge again. Stacked pull requests, several features that build on each other, merge from the bottom up; use `bun run merge-stack` when the repository has it, otherwise retarget each next pull request to `main` with `gh pr edit <number> --base main` after its base merges.

## 6. Clean the desk

Look before deleting. In the feature work tree:

```bash
git status --short        # must print nothing
git log origin/main..HEAD # must print nothing
git stash list            # must print nothing for this branch
```

Anything left is work that is not in `main`: commit it, merge it, or confirm it is junk (build output, a recorded media file outside the repository) before it goes. Then:

```bash
scripts/dc stop                 # in the feature work tree; also stop its dev server
scripts/dc down                 # removes the containers, keeps nothing running
cd <primary checkout>
git worktree remove ~/worktrees/<repo>/<feature>
git branch -d <type>/<feature>  # -d only; it refuses unmerged work
git push origin --delete <type>/<feature>   # only if the remote branch still exists
git worktree prune && git fetch origin --prune
git switch main && git pull --ff-only
scripts/dc prune                # clears stacks whose work tree is gone, when old enough
```

The desk is clean when `git worktree list` shows only the primary checkout, local `git branch` shows only `main` (the remote `pr-media` branch stays; it holds the pull request media), `git status` is clean, and `main` equals `origin/main`. Report that, with the merged pull request number.

## Several features at once

- One feature, one branch, one work tree, one stack. Never edit another feature's folder and never share a branch.
- Check the load first: `scripts/dc list`. Stop idle stacks, and respect the stack cap ([run-in-container](../run-in-container/SKILL.md)).
- Each work tree's servers use their own ports: `scripts/dc ports`; never assume `3000`.
- A feature that needs another unmerged feature branches from that feature's branch and opens its pull request against it (a stack). Independent features branch from `main`.
- Merge when each feature is ready, in dependency order. After each merge, update the others: `git fetch origin && git rebase origin/main` in their work trees, then verify again.
- Finish every feature with step 6 before reporting; a leftover work tree is unfinished work.

## When something goes wrong

Fix it and continue. A failing check, a merge conflict, a stuck stack, or a reviewer finding is work, not a blocker. Stop only for access you cannot obtain yourself, such as a missing GitHub login or no permission to merge, and name it.
