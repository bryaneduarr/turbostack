---
name: pr
description: "Write a short pull request body from a fixed What / How / Why template, then open the PR with labels, the author as assignee, and review requests to the other collaborators. Use when writing, opening, or revising a pull request."
---

# Pull request

A reader should understand the PR in under a minute: what it does, how, and why. Fill the template below every time. Do not add, rename, or reorder sections.

## Before writing

- Read the diff of the PR's own commits against the base (`git diff <base>...HEAD`). The base is `main`, or the branch of the PR below it in a stack. Ignore unrelated working-tree edits.
- State only what the diff and the commits show. Ask when the reason for the change is unclear; never invent one.
- Writing the body does not authorize pushing or opening the PR. Do those only when asked.

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

## Checked

<Commands actually run and their result, or "Not run: <reason>".>
```

Rules:

- Keep the whole body under 150 words. Cut anything that is not needed to review the change.
- Plain, third-person sentences. Define project-specific terms once. No file inventories, diagrams, or commit logs.
- `How` names behavior and decisions, not files. Link a file only when it is the one place a reviewer must look.
- `Checked` lists only what ran, such as `bun run check`, `bun run verify`, or a CI link. Never write a check as done when it was not. Say what was not checked when it matters.
- Never add AI or tool attribution or a "Generated with" line.

## Open the PR

1. Run `bun run check`, then `bun run verify`. Push only when both pass.
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
