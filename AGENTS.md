# Mandatory agent instructions

Before investigating, creating, changing, reviewing, or verifying anything in this repository, read all four rule files completely. Resolve paths from the repository root. These files impose mandatory behavior, not suggestions:

- [Structure and dependencies](.agents/rules/structure-and-dependencies.md)
- [TypeScript and Zod validation](.agents/rules/types-and-validation.md)
- [React and Next.js](.agents/rules/react-and-nextjs.md)
- [Code quality](.agents/rules/code-quality.md)

Follow every applicable rule, subject to higher-priority instructions. Do not silently waive rules or report completion with unresolved violations. Report missing instructions or irreconcilable requirements before making the affected change.

For scenario-based help choosing tools and checks, consult the [verification and tools guide](.agents/methods/verification-and-tools.md). It explains methods, not additional rules.

## Working context

After the mandatory rules, read the [startup index](.agents/project-context/start-here.md) and your assigned task's handoff. Load only relevant linked topics, not the entire context folder. The process-review checkpoint is not startup context.

- During authorized project work, autonomously maintain useful factual notes and task handoffs without separate invocation or approval. Explicit read-only requests remain read-only. Capture meaningful discoveries, milestones, and the next action before finishing; skip updates that add no useful knowledge.
- Keep the startup index at most 120 words, topic notes 80 words, task handoffs 120 words, and the manual review checkpoint 160 words, including evidence. Use concise bullets and source links, never copied code, rules, transcripts, raw logs, or speculative inventories.
- Each topic note and handoff records its UTC date, inspected Git revision, relevant uncommitted changes, and evidence paths/symbols or actual command/results. Distinguish source-inspected facts, user-confirmed intent, and specifically checked outcomes; never imply runtime verification from inspection or type checks.
- Reconcile notes with current sources and relevant Git changes before relying on them. Correct, replace, or remove stale facts; retain unresolved questions as unknowns. If the recorded revision cannot be compared, disclose the limit and inspect current evidence. Notes are navigation aids, not authority over rules or code.
- Add notes lazily under `.agents/project-context/<category>/<specific-topic>.md` only when they prevent repeated discovery or preserve task continuity. Task owners maintain `tasks/<task-id>/handoff.md` with objective, owner, status, relevant sources, checks/limits, blocker, and next action. Do not adopt a completed handoff as a new assignment.
- Work in isolated worktrees for parallel tasks. Task owners update their handoffs; the coordinating agent integrates topic/index updates. Re-read before editing and reconcile overlapping ownership or concurrent changes rather than overwriting another agent's work.
- Facts and progress update automatically; priorities, product scope, architecture decisions, and rule changes remain user-controlled. This instruction-driven upkeep adds no background service, automatic commits, or pushes. Portability still requires deliberate Git synchronization.

## Context reviews

Run [context-review](.agents/skills/context-review/SKILL.md) only when explicitly requested (`/skill:context-review` in Pi). It reviews the maintenance process, proposes at most one small improvement, and saves the [review checkpoint](.agents/project-context/review-checkpoint.md) only after approval. Routine factual upkeep is separate; process reviews never run on a schedule or automatically at session start.

## Skills and imported guidance

- These instructions and the four mandatory rule files take precedence over skills, imported tutorials, templates, and general examples. Adapt examples before using them in project code: architectural ownership, file naming, alias imports, schema-derived contracts and documentation, boundary validation, canonical HTTP status constants, and dependency restrictions still apply.
- Load a matching `.agents/skills/<name>/SKILL.md` with the host's file reader. Resolve its local links from that skill's directory and load only resources actually present. Do not assume a dedicated `Skill` tool or an upstream reference bundle exists.
- Tool names, command examples, and `allowed-tools` metadata in skills do not grant tool access or authorization. Use only available, authorized tools; report missing prerequisites rather than inventing resources, installing tools, or fetching generated guidance without permission.
- Imported memoization advice does not override React Compiler conventions: manual memoization needs a demonstrated reason. Screenshot, QA, and browser recommendations are conditional, not permission to perform them; browser automation requires an explicit request, and `agent-browser` or Chrome DevTools MCP must be specifically requested.

## Always enforce

- Make the smallest correct change; preserve unrelated behavior and user edits. Required reorganization of related existing files is part of that change, not an unrelated refactor.
- Mandatory deep modularization: preserve established architectural roots such as `routes/`, `services/`, and `types/`, then organize inside them by domain, feature, operation, and sub-operation using descriptive kebab-case folders and the deepest meaningful owner. Do not create artificial nesting, empty scaffolding, or catch-all folders.
- Apply ownership rules to new and existing code. When a feature establishes a better owner, move or adapt related existing files, even otherwise untouched files, and complete affected import, export, configuration, and documentation updates. Unrelated repository-wide migration requires separate authorization.
- Inspect ownership before implementation and affected structural compliance before completion. Ask about consequential ownership ambiguity; do not report affected work complete with known applicable violations or incomplete relocations.
- Keep files focused and imports direct. Name files `<specific-responsibility>.<singular-role>.ts` (or `.tsx`), such as `sign-in.interface.ts` or `sign-in.handler.ts`, without mechanically repeating every ancestor; preserve framework/tool-required names and runtime boundaries. Use specifically owned reusable capabilities, never `shared/` folders or barrels.
- Use extensionless aliases for project-owned module imports: `@workspace/<package>/...` within and across packages, and `@/...` for app-local modules. Never use relative filesystem imports or JavaScript/TypeScript extensions; preserve framework-generated imports and required non-code extensions. Keep aliases, package exports, and runtime resolution consistent and enforce the shared Biome rule.
- Organize schemas and interfaces in `packages/schemas/src/` by feature, operation, or route. Each dedicated interface file contains only that responsibility's contracts, derived from Zod. No global type catalog or aggregate interface.
- Validate untrusted data at boundaries and use the parsed result. No `any` or unsafe casts; retain `unknown` only where values are genuinely unvalidated or must be narrowed.
- Keep server-only operations on the server and client boundaries minimal. Let React Compiler handle ordinary memoization.
- Use the canonical HTTP status constants in `packages/utils/src/http/status-codes/http-status-code.constant.ts`; never hardcode HTTP statuses in consumer code. For every code change, audit affected code and its scoped diff for manually written statuses.
- Respect root dependency restrictions and verify affected TypeScript packages.
- Write tests when behavior needs verification: request and response workflows, validation and error handling, data transformations, integrations, state transitions, and bug fixes. Do not test trivial code such as configuration, constants, types, or simple pass-through functions, and do not aim for a test per function. Use Bun's test runner (`bun:test`) with `<responsibility>.test.ts` files next to the code, and run the affected packages' tests before reporting completion.
- Use browser automation only when explicitly requested; `agent-browser` and Chrome DevTools MCP require explicit requests for those tools.
- Inspect the scoped diff and report verification accurately. Never claim type checks guarantee complete runtime correctness.
