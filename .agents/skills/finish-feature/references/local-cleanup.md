# Local cleanup after PR publication

This is the cleanup stage of finish-feature, not independent authorization to
remove work. It starts only after approval of the exact workflow plan and
verified publication. Read it during preflight to detect blockers early.

## Eligibility and invariants

- Preserve the remote feature branch and open PR. Cleanup does not mean merge;
  `main` may still lack the feature. Never delete other local branches/worktrees.
- Clean means no staged, unstaged, or untracked files. Check each affected
  checkout with `git status --porcelain --untracked-files=all`. Preserve ignored
  dependencies, caches, environment files, and other local-only contents.
- Never use `git clean`, resets, stashing, forced checkout/worktree removal,
  recursive directory deletion, or blanket pruning to obtain a clean state.
- Resolve paths and exact branch refs from `git worktree list --porcelain`.
  Never remove the primary checkout, locked worktrees, or a checkout involved
  in another task. Do not guess that a directory is disposable from its name.
- If the invocation is in the primary checkout, keep that directory and switch
  it to `main`. If `main` is checked out elsewhere, stop rather than overriding
  Git's worktree protection or deleting that other checkout.
- If the invocation is in a linked feature worktree, identify an existing,
  surviving `main` checkout in the same repository. If none exists, stop before
  execution; do not repurpose another task's checkout or create an unplanned one.
- An affected surviving checkout must have no conflicts, in-progress Git
  operation, concurrent task ownership, or leftover changes. Excluded changes
  block cleanup even when commits and publication could otherwise succeed.
- Local `main` must equal or be an ancestor of the freshly fetched remote
  `main`. Local-only commits, divergence, unavailable remote state, or an ignored
  file collision block cleanup; do not reset, rebase, or make a merge commit.

## Ignored files and linked worktree removal

Inspect ignored contents during preflight and again immediately before removal,
using `git ls-files --others --ignored --exclude-standard --directory` or
`git status --ignored`. Do not print secret file contents. An empty ordinary
Git status alone does not prove that directory removal preserves local files.

Removing a worktree also deletes ignored contents within it. If any remain,
including tool/session artifacts created during this workflow, keep the worktree
and report the blocker. Do not silently delete, relocate, or copy them into
`main`; preservation or relocation needs a separately agreed destination/action.
Worktrees containing submodules or other repositories also require direction,
not a forced removal. Never report this blocked cleanup as complete.

## 1. Recheck publication and local state

Immediately before cleanup, verify all of the following:

- The approved feature branch still points to the recorded final feature tip.
- Fresh `git ls-remote --exit-code --heads` evidence shows the exact approved
  remote `refs/heads/<feature-branch>` points to that same full SHA. Do not rely
  only on a possibly stale remote-tracking ref or successful push output.
- The open, non-draft PR has the approved repository, base `main`, head branch,
  and head SHA. A missing/moved branch or changed/closed PR is a blocker.
- The feature checkout is clean, no other worktree checks out this feature
  branch, and the surviving checkout still matches the approved destination.

Fetch the selected remote without pruning. Verify its live `refs/heads/main`
SHA equals `refs/remotes/<remote>/main` locally and record that tip; a missing or
stale tracking ref is a blocker. Recheck ancestry before touching `main`. Stop
if any check fails; keep recovery refs and report the incomplete cleanup.

## 2. Restore and fast-forward main

For the primary-checkout case, use the approved directory and a safe switch:

```sh
git -C "$main_checkout" switch --no-overwrite-ignore main
```

For a linked-worktree invocation, the surviving checkout must already be on
`main`; do not switch some other branch there. Recheck that checkout is clean.

Fast-forward from the verified selected remote's tracking ref:

```sh
git -C "$main_checkout" merge --ff-only --no-autostash \
  --no-overwrite-ignore -- "refs/remotes/$remote/main"
```

Confirm that `main` equals the recorded remote `main` tip and that Git status
remains empty. If switching, updating, or validation fails, stop without deleting
any branch or worktree. Keep ignored files intact, including on path collisions.

## 3. Remove only the approved local feature resources

A shell `cd` or `git -C` does not relocate the running agent's persistent working
directory or its artifact writers. Before removing an active linked worktree,
require a supported host-level relocation and verify that both the persistent
cwd and all tool/session artifact destinations are outside the target directory.
Save the PR/commit/check evidence before relocation. Never invent a host API.

If safe host relocation is unavailable or cannot be verified, keep the worktree
and local branch, report cleanup incomplete, and give the surviving `main` path.
The user must restart Pi there before removal can finish. Resume only with the
original approval/evidence available and all invariants rechecked; otherwise
present a fresh cleanup plan. Never claim that shell commands moved the session
or that an attached worktree was safely removed.

For a linked worktree, recheck its clean status, ignored-file inventory,
submodule/nested-repository absence, and unlocked state immediately before
removing it from outside that directory, without `--force`:

```sh
git -C "$main_checkout" worktree remove "$feature_worktree"
```

For either case, confirm no worktree now checks out the feature branch. Recheck
its local tip, exact live remote tip, and PR metadata before deleting the ref.
Its upstream must be the approved remote feature branch, set by the verified
push. Delete only the approved local branch, using Git's upstream merge check:

```sh
git -C "$main_checkout" branch -d -- "$feature_branch"
```

The feature need not be merged into `main`: its commits must be preserved on its
upstream. If Git refuses deletion, stop and preserve the branch; do not escalate
to `-D`. Never delete the original branch when a different branch was created.

## 4. Verify postconditions

From the surviving checkout, verify the current branch is `main`, its HEAD
matches the fetched remote `main` tip, and status has no staged, unstaged, or
untracked files. Verify the approved local feature ref is absent and, if removed,
its worktree is absent from both disk and `git worktree list`. Reconfirm that the
remote feature ref still preserves the recorded tip and the intended PR remains
open with that head. Preserve ignored files in the surviving checkout.

Return the evidence to the final report. Report any incomplete deletion or
verification precisely, including where work is preserved and the next action.
Do not perform additional repository/context writes after this clean checkpoint.
