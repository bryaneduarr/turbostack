# Mandatory agent instructions

Before investigating, creating, changing, reviewing, or verifying anything in this repository, read all four rule files completely. Resolve paths from the repository root. These files impose mandatory behavior, not suggestions:

- [Structure and dependencies](.agents/rules/structure-and-dependencies.md)
- [TypeScript and Zod validation](.agents/rules/types-and-validation.md)
- [React and Next.js](.agents/rules/react-and-nextjs.md)
- [Code quality](.agents/rules/code-quality.md)

Follow every applicable rule, subject to higher-priority instructions. Do not silently waive rules or report completion with unresolved violations. Report missing instructions or irreconcilable requirements before making the affected change.

For scenario-based help choosing tools and checks, consult the [verification and tools guide](.agents/methods/verification-and-tools.md). It explains methods, not additional rules.

## Skills and imported guidance

- These instructions and the four mandatory rule files take precedence over skills, imported tutorials, templates, and general examples. Adapt examples before using them in project code: architectural ownership, file naming, alias imports, schema-derived contracts and documentation, boundary validation, canonical HTTP status constants, and dependency restrictions still apply.
- Load a matching `.agents/skills/<name>/SKILL.md` with the host's file reader. Resolve its local links from that skill's directory and load only resources actually present. Do not assume a dedicated `Skill` tool or an upstream reference bundle exists.
- Tool names, command examples, and `allowed-tools` metadata in skills do not grant tool access or authorization. Use only available, authorized tools; report missing prerequisites rather than inventing resources, installing tools, or fetching generated guidance without permission.
- Imported memoization advice does not override React Compiler conventions: manual memoization needs a demonstrated reason. Test, screenshot, QA, and browser recommendations are conditional, not permission to perform them. Do not write, modify, or run tests unless explicitly requested; browser automation also requires an explicit request, and `agent-browser` or Chrome DevTools MCP must be specifically requested.

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
- Do not write, modify, or run tests unless the user explicitly requests them. Use browser automation only when explicitly requested; `agent-browser` and Chrome DevTools MCP require explicit requests for those tools.
- Inspect the scoped diff and report verification accurately. Never claim type checks guarantee complete runtime correctness.
