# Finish-feature skill

- UTC: 2026-10-14; inspected Git: `0ebf76b4a7c22c96148dec0b81c9fa4ab6433cab`.
- Owner: coordinating assistant. Status: implemented, not executed.
- User-confirmed: `<type>/<feature>` branches; one approval for commits/push/ready PR/main cleanup; no merge; preserve remote branches/ignored files.
- Source-inspected: [skill](../../../skills/finish-feature/SKILL.md) composes current commit-done/pr; [cleanup](../../../skills/finish-feature/references/local-cleanup.md) protects host cwd/artifact writers and requires restart when relocation is unavailable.
- Relevant uncommitted: new skill/reference, index/handoff; preexisting PR/AGENTS/context edits preserved.
- Checked: inline documentation checks passed frontmatter, links, fences, and `git diff --no-index --check`.
- Limits: no workflow/runtime execution; follow-up verifier timed out after source review.
- Blocker: none for implementation.
- Next: `/reload`, then explicitly invoke `/skill:finish-feature` when ready.
