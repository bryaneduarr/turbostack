---
name: pr
description: "Write clear pull request bodies with newcomer context, Mermaid flows, GitHub review links, honest verification, and a final tl;dr. Use when writing or revising a PR body."
---

# Pull request body

Write for a tired reviewer who understands programming but knows nothing about the codebase. The PR must explain the change without requiring a tour of the entire repository.

## Preparation

- Identify the requested PR base, head, and scope. Inspect the relevant diff, surrounding implementation, and product documentation; do not treat unrelated working-tree edits as part of the PR.
- Establish what the product does, the behavior before the change, and the intended outcome. Use confirmed intent and inspected sources, not an invented backstory.
- Resolve the GitHub repository and reviewed revisions from local Git or available PR metadata. Ask a focused question only when essential information cannot be established; label remaining unknowns honestly.
- Use existing evidence or checks permitted by repository instructions. Writing a PR body does not authorize code changes, commits, PR publication, tests, or browser automation.

## Writing rules

- Use the six titles below as second-level Markdown headings, in the given order. Keep titles in third person, without first- or second-person pronouns.
- Prefer short paragraphs and useful bullets. Include enough context to judge the change, not an exhaustive architecture lesson or commit log.
- Define project-specific terms and acronyms on first use. Assume programming knowledge, but no familiarity with this project's names or conventions.
- Distinguish previous behavior, new behavior, intended benefits, and verified outcomes. Avoid repeating the same explanation across sections.
- Return only the completed PR body, without a preamble, unfilled placeholders, or commentary after the final summary.

## Body structure

### What's the story so far?

- Introduce the relevant product capability, what it does, and who uses it.
- Explain how it worked before this PR and the concrete problem, missing capability, or limitation that prompted the change.
- Include a brief before-change example when it makes the problem easier to understand.

### Why is this change worth making?

- State the purpose, expected benefit, and who benefits. Explain the value rather than repeating the implementation.
- Explain why this approach fits the problem. Mention meaningful trade-offs or alternatives only when supported by inspected sources or confirmed intent.
- Clarify important non-goals when needed to avoid implying a broader fix.

### How does the new flow work?

- Summarize the new behavior briefly and define the concepts needed to understand the flow.
- Include a fenced `mermaid` diagram in every PR. Show the relevant start, main steps, important decisions or failure branches, and final outcome.
- Use simple Mermaid syntax and descriptive, quoted node labels. Make existing versus changed behavior clear where it matters; do not diagram the entire codebase.
- Follow the diagram with a brief walkthrough explaining its meaningful steps and outcomes in plain language.
- For documentation, configuration, or non-runtime refactors, show a before/change/after relationship or the actual update workflow. Label conceptual diagrams clearly; never invent runtime behavior.
- Give concrete, relevant edge cases as **Situation -> expected outcome**. Distinguish verified outcomes from source-inferred behavior and unresolved cases. If no meaningful edge case applies, explain that briefly rather than inventing one.

### Where should the review start?

- List the most important files in a useful review order, not every changed file.
- For each file, explain its responsibility and the specific behavior, contract, or decision that deserves attention.
- Use GitHub links pinned to the reviewed head commit. Use the base commit for deleted files or before-change references. Add accurate line anchors when useful.
- Link shape: `https://github.com/<owner>/<repo>/blob/<commit>/<path>#L<start>-L<end>`. Replace every placeholder with known values and encode paths correctly.
- If changes are unpublished or a valid link cannot be established, state the limitation instead of fabricating a link or linking to a revision that lacks the change.

### What was checked, and what could go wrong?

- **Checked:** Report actual commands or manual checks, their results, and what those results establish. Attribute existing CI or user-provided evidence rather than implying it was run locally.
- **Not checked:** State relevant unchecked behavior, blocked checks, and remaining uncertainty. Say explicitly when no checks were run.
- **Risks:** Describe relevant failure modes, affected users or consumers, and compatibility concerns. Include deployment, migration, rollout, or rollback considerations only when applicable.
- Never present a proposed check as completed, static inspection as runtime verification, or a passing type check as proof of complete correctness. Avoid unsupported claims that a change is risk-free or safe to merge.

### tl;dr

- Finish with one extremely short sentence, ideally no more than 40 words, stating what changed and why it matters.
- Summarize only information already explained. Introduce no new claims, details, or sections afterward.
