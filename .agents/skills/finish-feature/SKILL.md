---
name: finish-feature
description: "Finish a feature through dependency-ordered Conventional Commits, one explicit plan approval, a GitHub pull request, and safe local cleanup back to main. Use only when explicitly asked to run this complete workflow."
disable-model-invocation: true
---

# Finish a feature

Compose [commit-done](../commit-done/SKILL.md), [pr](../pr/SKILL.md),
and [local cleanup](references/local-cleanup.md) into one supervised process.
Read all three completely, plus mandatory repository instructions and relevant
context, before proceeding. Resolve links relative to this skill directory.

## Invocation and boundaries

- Invoke with `/skill:finish-feature`, optionally supplying a branch such as
  `/skill:finish-feature feat/user-profile`. Otherwise infer a proposed name
  from inspected changes; ask only when intent is unclear.
- Requests to implement, edit, or review this skill do not execute the workflow.
  An explicit request to resume approved cleanup revalidates its evidence and
  runs only that stage, without recreating commits or the PR.
- The default scope is all staged, unstaged, and untracked project changes,
  including user-authored work. Ignored local files are preserved, not committed.
- Plan approval authorizes only the displayed branch action, commits, push,
  ready-for-review PR targeting `main`, and exact local cleanup actions.
  The component skills alone do not authorize pushing or publishing.
- No source fixes, tests, browser automation, installations, history rewriting,
  forced pushes/checkouts, hook bypasses, stashing, hard resets, or `git clean`.
  Applicable static checks remain required; stop on failed checks or hooks.
- Stop on uncertainty or unexpected changes. Preserve successful commits and
  published work; report partial progress instead of rolling it back.

## 1. Establish the complete scope and destination

- Follow commit-done's change-pool inspection and dependency planning. Inspect
  contents, not merely filenames; preserve excluded files and staging states.
  Stop for secrets, unresolved conflicts, detached HEAD, or in-progress Git work.
- Record initial branch, HEAD, index, file inventory, and worktree topology using
  `git worktree list --porcelain`. Identify the primary checkout and any checkout
  of `main`. Read local-cleanup's eligibility rules now, not after publishing.
- Check that Git and `gh` are available and authenticated without displaying
  credentials. Resolve the intended GitHub repository and push remote from Git
  and `gh` metadata; prefer `origin` only when it matches that repository.
  Do not install tools, create forks, or guess an ambiguous destination.
- Fetch the selected remote without pruning. Confirm its live `main` SHA equals
  its local remote-tracking ref and record that base. Inspect existing commits
  and the complete diff against that base, not only uncommitted changes.
  Existing commits remain unchanged but must be disclosed in the PR's scope.
- Propose `<type>/<feature-name>` with a lowercase, descriptive kebab-case slug,
  such as `feat/user-profile`, `fix/session-expiry`, or `docs/setup-guide`.
  Choose the type from the actual purpose and validate with
  `git check-ref-format --branch`. Reuse the current suitable feature branch;
  otherwise propose creating a new branch at the recorded HEAD, without
  renaming or deleting the original branch. Stop for unrelated name collisions.
- Inspect existing PRs for the proposed head and repository. If one exists,
  stop with its URL and request direction rather than duplicating or overwriting
  it. If there are no changes or existing feature differences, report a no-op.
- Perform useful factual context upkeep before finalizing the inventory and
  plan. Include those edits in the plan; do not leave reporting edits for `main`
  after cleanup. Never fabricate future publication or verification results.

## 2. Present one complete plan and wait

Use commit-done's exact numbered format, full messages, file/hunk ownership,
dependency rationale, and verification disclosures. Preserve its package/server/
client ordering and 50-character titles and 72-character body/footer lines.
Do not invent commits for unchanged layers or rewrite existing commits.

Add a workflow envelope containing:

- Initial branch/HEAD, existing feature commits, and exclusions.
- Exact feature branch and whether it is reused or created.
- Remote, GitHub repository, base `main`, and proposed PR title.
- Required checks and their current results or not-yet-run status.
- Exact surviving checkout, branch to delete, and linked worktree to remove,
  if applicable. Disclose ignored-file blockers and any required host relocation
  or restart before linked-worktree removal can finish.
- The fact that cleanup follows PR creation, not merge; the remote feature
  branch remains, and `main` will not contain the feature until it is merged.

Ask: **"Approve this commit plan, branch action, push, PR creation, and local
cleanup?"** Then wait. Invocation or approval of this skill's design is not
approval of a particular execution plan. Before approval, do not change the
local branch, index, or commits, push, publish, or perform cleanup.

After approval, continue without routine additional prompts. Material changes
to scope, messages, order, branch, destination, or cleanup require a revised
plan and fresh approval. Resolve known blockers before execution, except a
restart explicitly disclosed in the approved cleanup handoff. That handoff is
not complete cleanup. If no new commits are needed, still obtain approval.

## 3. Create or reuse the branch and execute commits

- Recheck the recorded HEAD, branch, index, inventory, and worktree destinations.
  Stop on concurrent edits or unexpected state. Create only the approved new
  branch at that HEAD with a non-forced switch using `--no-overwrite-ignore`;
  reusing the current branch needs no switch. Verify the expected branch/HEAD.
- Execute only the approved commit-done plan, including explicit staging,
  complete staged-diff review, message validation, static checks, and hook checks.
  An approved branch switch is expected; no other branch movement is allowed.
- Record ordered commit hashes, final feature tip, and actual check outcomes.
  Require an empty `git status --porcelain --untracked-files=all` before pushing.
  Leftovers are blockers, not permission to discard or silently add another commit.

## 4. Publish the branch and create the PR

Recheck the feature tip and intended remote, then push only that branch:

```sh
git push --set-upstream -- "$remote" "$feature_branch"
```

Never push `main`, tags, all branches, or force. If rejected, stop; do not merge,
rebase, or rewrite history to make the push succeed. Verify the exact live remote
head with `git ls-remote --exit-code --heads` against the recorded feature tip.

Write the PR body following pr's complete preparation and six-section structure,
including Mermaid, revision-pinned review links, and honest verification/risks.
Its body-only output rule applies to the body artifact, not the workflow's final
report. Keep that artifact outside the repository in an agent-owned temporary
file; do not use `--fill` or invent CI, test, issue, reviewer, or merge evidence.

Recheck for an existing PR immediately before creating one. Use resolved values
and a reviewed body file, without browser, draft, or implicit push behavior:

```sh
gh pr create --repo "$repository" --base main --head "$feature_branch" \
  --title "$pr_title" --body-file "$pr_body_file"
```

Read back the PR with `gh pr view --json` and verify its repository, open state,
non-draft status, base, head branch, and head SHA against the approved values.
Record its URL. On failure or an uncertain creation response, query matching PR
metadata before any retry; do not blindly create a duplicate or start cleanup.
Delete only the agent-owned temporary body file when no longer needed.

## 5. Clean locally and report

Only after verified publication, execute [local cleanup](references/local-cleanup.md).
Do not merge, enable auto-merge, close the PR, delete the remote branch, or wait
for review/CI as part of this workflow. Report CI as pending/unknown when applicable.

Finish with the PR URL, ordered commit hashes/titles, checks actually performed,
remaining verification limits, surviving checkout and branch, local branch/
worktree removal results, and any blocker or leftover work. Claim completion
only after all cleanup postconditions pass. No further repository edits may
dirty the final checkout merely to record this report.
