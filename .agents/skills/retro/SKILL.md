---
name: retro
description: "Conduct a retrospective on a coding session."
disable-model-invocation: true
---

The user has asked for a **retrospective**. You are suggesting improvements to the coding agent's **environment** to improve future runs. Present recommendations, not unrequested implementation. Mandatory repository rules remain in force; suggestions about tests, browser evidence, hooks, or CI do not authorize running tools or changing those resources.

## Steps

1. Use concise, actionable agent-facing prose: state the observed issue, session evidence, precise existing paths, and the smallest proposed improvement. Avoid redundant instructions, speculative documents, and claims unsupported by the session. No separate writing skill or dedicated `Skill` tool is required.

2. Read the primary sources for the session the user specifies. This may mean searching through session logs on this machine. If the user doesn't specify a session, default to the current one.

3. Look for candidates for improvement in these categories.

- **Navigation**: how easy was it for the agent to find the right files? Are there hidden dependencies between files? Would a **navigation pointer** make it easier? _Use when_ the session took a long time to find a piece of information.
- **Automated checks**: are there automated checks that could catch errors the agent made? Linting, typing, tests, filesystem linters? Read the repo's own check command first (its `package.json`/build-tool `lint`/`check` scripts, its CI workflow), so a check that already exists but sits unwired or silently broken is the finding, not a reinvention. A repo with no **guardrail** (no pre-commit hook and no CI job running its lint/typecheck/test command) is itself a finding: an un-linted repo is a standing missed opportunity, not a neutral default. _Use when_ the agent made a mistake an automated check could have caught, or the repo has no guardrail at all.
- **Coding standards**: should implementation and review guidance be clarified? Classify the violation first: a **mechanical** one (a fixed syntactic pattern, a banned API, an import shape, a file-location rule) is a candidate for a deterministic check in the repo's own linter, pre-commit hook, or CI. Recommend the smallest suitable check rather than duplicating prose; reserve additional written guidance for genuine **judgement calls** such as cross-file consistency. Checks complement mandatory rules, never remove or weaken them. _Use when_ the reviewer agent failed to catch a mistake.
- **Global AGENTS.md**: would clearer navigation to existing rules or complementary automated checks reduce context pressure without removing mandatory obligations? _Use when_ the AGENTS.md file is particularly large - in the repo OR the user's global scope.
- **Tool economy**: did the agent make expensive tool calls that could be streamlined? Is there any custom tooling (CLI's, MCP's) that is particularly token-inefficient? _Use when_ the agent made an expensive tool call.
- **No-ops**: look for instructions in steering files that don't modify the agent's behavior. _Use when_ the steering files are large and unwieldy.
- **Information access**: look for opportunities to increase the agent's access to information. Teeing dev server logs, readonly access to third-party services. _Use when_ a crucial piece of information was not available to the agent.

4. Present these candidates to the user, in order of severity.

## Reference

### Implementation vs Review

Remember that all work goes through two stages: implementation and review. The implementation agent has the most **context pressure**. They are responsible for exploration, writing code, and debugging failures.

The review agent often has less context pressure and starts from a diff, but must still inspect the instructions and affected sources needed for a reliable review.

Both implementation and review must enforce mandatory repository rules. Context pressure is not an exemption; review adds independent verification rather than taking compliance away from implementation.

### Files

Inspect existing files rather than assuming a particular steering-file layout:

- `AGENTS.md` and `.agents/rules/`: this repository's mandatory instructions apply during both implementation and review. Keep navigation clear without weakening their requirements.
- Docs: use existing documentation as reference material before recommending new documents.
- Skills: use file-loaded guides for task-specific reference material or user-invoked workflows. Keep instructions concise, specific, and supported by observed needs.
