---
name: context-review
description: "Review the freshness, brevity, and usefulness of autonomously maintained project context. Propose at most one small, evidence-backed process improvement; do not build a complete system."
disable-model-invocation: true
---

# Context review

Review how agents maintain and retrieve concise evidence, not every factual update. Routine upkeep follows AGENTS.md automatically during authorized work.

## Invocation and authority

- Run only when the user explicitly invokes this skill or requests a context-engineering review. There is no cadence, scheduler, background execution, or automatic session-start review.
- Use `/skill:context-review`; other hosts can read this file directly on request. Resolve Markdown links from this skill's directory; other project paths are repository-root-relative.
- Start the process review read-only, including factual notes and the review checkpoint. A review request does not authorize edits, implementation, commits, or pushes; this does not revoke ordinary upkeep authorized by `./AGENTS.md`.
- The user controls priorities, product scope, architecture, and rules. Preserve their edits and follow all applicable repository instructions. Tool examples and skill metadata do not grant permissions.

## Recover the baseline

1. Read the [repository instructions](../../../AGENTS.md) and all mandatory rules completely. Read the [startup index](../../project-context/start-here.md), then the [process-review checkpoint](../../project-context/review-checkpoint.md). Load only topics needed for the review; neither notes nor checkpoint replace rules or act as a global task queue.
2. Record the UTC review date, current Git revision, branch, and working-tree state. Distinguish committed evidence from local changes. Never checkout, stash, reset, stage, or commit just to obtain a clean baseline.
3. Reconcile the checkpoint with current files and Git. If its revision is unavailable or not an ancestor of the current revision, disclose the comparison limit; do not claim to have reviewed all intervening changes.
4. Check the pending improvement before proposing another. If it is approved but unfinished, recommend the smallest remaining action or identify its blocker. If completed, inspect the completion evidence. Do not revive deferred or rejected ideas without new evidence that addresses their recorded reason.

## Gather only relevant evidence

Use bounded filename searches, Git history/diffs, and precise file reads. Begin with existing instructions, READMEs, and any task or feature records; inspect implementation only when needed to check a claim. Load matching project skills when their subject is involved.

Review changes since the checkpoint when that comparison is valid, then inspect the relevant current context. Without a usable checkpoint, take a small baseline snapshot rather than auditing the entire project. Use current conversation evidence and user-supplied records without assuming missing logs or remote services are accessible.

Check whether an incoming agent can:

- Find the user-approved project purpose, current scope, priority, and relevant feature owner.
- Find mandatory rules, actual development/verification commands, and runtime boundaries without re-deriving them.
- Distinguish implemented work, specifically verified work, planned work, blockers, and decisions that still need approval.
- Resume an unfinished task from explicit ownership, repository references, and a concrete next action.
- Recover necessary knowledge from the synchronized repository instead of relying on ignored directories, personal settings, or untransferred local changes.
- Stay within AGENTS.md's index/topic/handoff word budgets and load only relevant notes, rather than duplicate rules, stale instructions, exhaustive inventories, or session logs.
- Have discoveries and handoffs maintained at meaningful milestones without user prompts, with source evidence and accurate verification limits.
- Identify ownership and overlapping changes when parallel tasks actually exist, without treating the review checkpoint as their coordination mechanism.

Use exact paths and line references or Git revisions for findings. A missing search result is not proof of absence: check tracking, ignore rules, and working-tree changes as appropriate. Label unknowns and unreviewed areas. Do not invent product requirements, decisions, implementation status, or verification results.

## Choose one next increment

Recommend at most one independently useful improvement, small enough for a focused working session. Prefer correcting, simplifying, linking, or removing existing material over adding files. Choose an observed continuity failure or an evidenced risk to the next session, not a generic maturity checklist.

A missing document alone does not justify creating it. Explain what an incoming agent cannot reliably recover and why the proposed change resolves that gap. Avoid maturity scores, speculative scaffolding, full-system roadmaps, and recommendations for new infrastructure when a simpler change suffices.

If evidence supports no useful change, say **No change needed**. If a crucial input is unavailable, state the limitation and the one decision or access grant needed; do not fill the gap with assumptions. Ask the user about intent, not facts that can be inspected.

## Present the review in the conversation

Keep the report to roughly one page:

- **Snapshot:** review date, revision/branch, relevant local changes, inspected area, and limits.
- **What works:** a brief evidence-backed description of the useful existing context.
- **Next increment:** one small change, the remaining action on an approved improvement, or no change needed.
- **Evidence and benefit:** precise sources, the continuity gap, and what the change would let the next agent recover.
- **Scope and completion criterion:** exact affected paths, the necessary decision if any, and an observable way to establish completion using permitted checks. Static checks are not a guarantee of runtime correctness.
- **Deliberately deferred:** only significant alternatives and why they are premature; do not expand these into a roadmap.
- **Approval:** ask whether to accept the recommendation and save the checkpoint. Do not implement the recommendation unless the user also explicitly requests implementation.

Keep raw tool output, full reports, and transcripts out of tracked context. Do not automatically create ADRs or glossary entries. Use domain-modeling guidance only when actual domain terms or qualifying architectural trade-offs need to be recorded within the approved scope.

## Save the checkpoint only after approval

When the user approves saving the review or accepting its recommendation, update the existing checkpoint in place. Acceptance permits recording the decision, not automatically implementing it. A rejected recommendation or a no-change review can also be recorded when the user authorizes saving it.

Re-read it before editing; if it changed during the review, reconcile with its current owner instead of silently overwriting concurrent work. Do not alter unrelated task records or previously accepted direction without authorization.

Keep the process checkpoint at most 160 words, using Git for history. Preserve these fields:

- Last saved review date, evidence-base revision/branch, reviewed local changes, and verification limits. Use the revision actually inspected, not an invented future commit containing the checkpoint.
- Accepted direction and constraints that remain relevant, linking to existing authoritative sources rather than duplicating rules.
- One pending improvement with explicit status: awaiting approval, approved but not implemented, implemented with verification limits, or completed with stated evidence; use none when appropriate.
- Significant deferrals or rejections with their reason and the condition for reconsideration.

Replace superseded snapshot details rather than appending a journal. Preserve live commitments, keep secrets and personal environment details out, and do not record guesses as accepted facts. If the checkpoint is missing, propose the smallest replacement and wait for approval before creating it.

After an explicitly authorized implementation, update completion evidence only within the authorized scope. Never mark an improvement complete solely because a note or a commit says so. Mention that another machine receives these changes only after the user commits and synchronizes them; uncommitted code needs separate deliberate transfer.
