---
name: pr
description: "Write a short pull request body from a fixed What / How / Why template, then open the PR with labels, the author as assignee, and review requests to the other collaborators. Use when writing, opening, or revising a pull request."
---

# Pull request

A reader should understand the PR in under a minute: what it does, how, and why. Fill the template below every time. Do not add, rename, or reorder sections; the one optional section is `Preview`, for features with visible behavior.

## Before writing

- Read the diff of the PR's own commits against the base (`git diff <base>...HEAD`). The base is `main`, or the branch of the PR below it in a stack. Ignore unrelated working-tree edits.
- State only what the diff, the commits, and the task show. When the reason is unclear, derive it from the task and the project notes; never invent one.
- Pushing and opening the PR are part of the [deliver-feature skill](../../workflow/deliver-feature/SKILL.md) for a feature. Outside it, push and open a PR only when the user asks.

## Title

`<type>(<scope>): <imperative summary>`, at most 70 characters. Use the types from the [commit-changes skill](../commit-changes/SKILL.md), such as `feat(server): add invitation expiry`.

## Body template

```markdown
## What is this implementing?

<One or two sentences: the feature or fix, from the user's point of view.>

## How is being implemented?

- <Main change, one line.>
- <Main change, one line.>
- <At most four bullets.>

## Why is being implemented?

<One or two sentences: the problem or need this solves.>

## Preview

<Only for a feature with visible behavior: one line per screenshot or video saying what to look at, followed by its link. Leave the whole section out otherwise.>

## Checked

<Commands actually run and their result, or "Not run: <reason>".>
```

Rules:

- Keep the whole body under 150 words, not counting the `Preview` links. Cut anything that is not needed to review the change.
- Plain, third-person sentences. Define project-specific terms once. No file inventories, diagrams, or commit logs.
- `How` names behavior and decisions, not files. Link a file only when it is the one place a reviewer must look.
- `Checked` lists only what ran, such as `scripts/dc bun run verify` or a CI link. Never write a check as done when it was not. Say what was not checked when it matters.
- Never add AI or tool attribution or a "Generated with" line.

## Media

A feature with visible behavior gets screenshots and a video in `Preview`. Record, upload, and link them with [media](references/media.md) before creating the PR.

## Open the PR

1. Pass `scripts/dc bun run verify`, or `scripts/dc bun run verify --failed` after a fix. Push only when it passes.
2. Choose labels from `gh label list`. Always set:
   - one type label: `enhancement`, `bug`, `refactor`, `documentation`, `chore`, or `dependencies`;
   - one `area: ...` label for each area touched (`area: client`, `area: server`, `area: packages`, `area: tooling`).
3. Create the PR against its base, assigned to the author, with every label:

   ```bash
   gh pr create --base <base> --title "<title>" --body-file <body-file> \
     --assignee @me --label "<type>" --label "area: <area>"
   ```

4. Request review from the repository's other collaborators. GitHub refuses review requests to a PR's own author, so never request the author:

   ```bash
   me="$(gh api user --jq .login)"
   gh api "repos/{owner}/{repo}/collaborators" --jq ".[].login | select(. != \"$me\")" |
     while read -r reviewer; do gh pr edit <number> --add-reviewer "$reviewer"; done
   ```

   When the author is the only collaborator, the assignment stands in for the review request; this is expected, not a blocker.
5. Report the PR URL, the labels, the assignee, and who was asked to review, or that no other collaborator exists.

Edit the body afterward only when later changes alter what it states.
