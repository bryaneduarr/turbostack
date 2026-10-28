# Code quality

These rules are mandatory for code and refactors.

## Simplicity and task scope

- Keep all code as simple as possible while achieving the requested goal correctly. Simplicity means clarity and necessity, not the fewest lines.
- Implement only what the task and its required use case need. Do not add unrequested features, speculative abstractions, unused configuration, or unnecessary architectural layers.
- Make future expansion practical through clear responsibilities throughout the code. Extend the implementation when another use case is needed, not in anticipation of hypothetical requirements.
- Preserve necessary validation, authorization, error handling, and correctness. Required safeguards are not bloat.
- Required adaptation of related existing files to a better domain or operation owner is part of the task, even when those files otherwise would not need editing. Follow the mandatory deep ownership rule inside established architectural roots; do not use minimal-diff scope as a reason to leave the affected ownership area structurally noncompliant.

## Readability and functions

- Keep the primary behavior of a file focused and its execution flow easy to understand without navigating through unnecessary wrapper layers.
- Isolate complicated logic in descriptively named functions or files when doing so improves readability and maintainability, even with one current consumer. Give extracted logic a clear responsibility so other files can reuse it when needed, without generalizing for hypothetical consumers.
- Extraction must clarify responsibilities, not merely hide complexity behind forwarding wrappers. Keep necessary decisions and the order of operations visible in the main file.
- Isolate independent business logic, validation, transformations, database operations, handlers, normalization, and authentication responsibilities in descriptive files under their specific owners. Keep tightly connected simple steps together when extraction would obscure the operation; do not split mechanically per statement, function, or procedural step.
- Prefer explicit, simple implementations and useful inference over duplicate definitions.
- Do not sacrifice clarity to abstraction or correctness to file-size targets.

## Deprecated APIs

- Never import or use a symbol, type, option, or API marked `@deprecated`. Use the replacement its deprecation notice names, and fix any deprecation warning the editor or TypeScript reports (such as `ts(6385)`) before completion.
- The shared Biome configuration enforces this with `suspicious/noDeprecatedImports` as an error. Do not lower that level or suppress the rule; `biome ci` and package lint must pass.
- React event types: never use `FormEvent` or `FormEventHandler`, which do not correspond to a real DOM event. Type `onSubmit` handlers with `SubmitEvent<HTMLFormElement>`, `onChange` handlers with `ChangeEvent<Element>`, `onInput` handlers with `InputEvent<Element>`, and other generic handlers with `SyntheticEvent`.
- When upgrading dependencies, check their changelogs and the lint output for newly deprecated APIs and migrate affected code in the same change.

## Unified HTTP status constants

- Use the named exports from `packages/utils/src/http/status-codes/http-status-code.constant.ts` for every project-owned HTTP status value. All consumers, including schema modules, must import them directly through `@workspace/utils/http/status-codes/http-status-code.constant`, never through deep relative paths or forwarding modules.
- Do not hardcode HTTP status numbers in response construction, framework response metadata, defaults, comparisons, logging severity decisions, validation bounds, numeric type literals, or OpenAPI response keys. Use computed keys such as `[OK]` and `[BAD_REQUEST]` for response maps.
- Keep status numbers and protocol-range boundaries defined in the single canonical catalog. Reuse existing names; add a missing definition there instead of inventing a local constant, copying the catalog, or forwarding exports through another module.
- Generate executable descriptions containing status numbers from the same constants. Plain-language documentation may mention numeric HTTP codes, but executable documentation examples must import the named constants. Preserve external and generated wire formats that require numeric statuses.
- For every code change, inspect the affected files, their related producers and consumers, and the scoped diff for manually written HTTP statuses. Search numeric and string literals and distinguish actual HTTP statuses from unrelated sizes, timeouts, database constraints, ports, and other numbers. Replace project-owned hardcoded statuses and verify affected package types before reporting completion.
- Preserve response behavior, integer validation, range endpoints, bodyless-status exclusions, and runtime/package boundaries when replacing literals. Protocol numbers are allowed in the canonical catalog, not duplicated in consumer code.

## Examples and placeholders

- Do not hardcode project names, personal information, real email addresses, API keys, UUIDs, private identifiers, or user-provided personal information unless explicitly required by the task.
- Use neutral fictional values such as `example@example.com` for examples.
- Never commit credentials or sensitive data as examples.

## Comments

- Document each responsibility-specific interface, its explicitly declared members, and schema fields as required by `types-and-validation.md`, using brief `/** ... */` JSDoc comments that explain purpose without file paths.
- Write code that is readable and understandable without explanation: descriptive names, focused functions, and a straightforward flow. This rule targets code quality, not comments themselves; contract documentation remains required.
- Outside the required contract documentation, do not add comments that explain what the code, configuration, scripts, or workflow files already show, such as narrative, summary, or usage comments.
- Add another comment only when it records something the code cannot express and a future maintainer needs, such as a non-obvious external constraint, a value that must stay in sync elsewhere, or a reason an apparently simpler change would break behavior. Keep it to one short line when possible.
- Simplify unclear code instead of explaining it. Comments must not substitute for a clearer implementation.
- Do not prefix comments with `Why:` or `What:`.
- Do not use numbered step comments, decorative separators, or label-style function comments.
- Do not mention "human readable", "human friendly", or "human-like" in comments.
- Avoid unnecessary pronouns addressing the reader.
- End complete comment sentences with a period.
- Use plain keyboard characters; do not use em dashes or decorative Unicode in source-code comments.

## README files

- READMEs contain only instructions, guides, processes, and the overall structure a newcomer needs. They are not changelogs or inventories of features, files, tables, routes, or endpoints.
- Do not add README content because a feature, file, table, or route was added. Change a README only when the user asks for specific content, or when an instruction, process, or structural statement it already makes becomes incorrect; keep such corrections general rather than naming the feature that caused them.
- When something is removed from the project, remove its README mentions so the text reads as if it never existed. Never write that something was removed, replaced, renamed, or deprecated.
- Record feature details, progress, and other agent-facing facts in `.agents/project-context/`, never in repository READMEs.

## Tests

- Browser tests are the only tests. When behavior needs verification (user flows, request and response workflows, validation and error messages, permissions, state transitions, and bug fixes), write a Playwright scenario: a `<responsibility>.e2e.ts` file under `apps/client/src/e2e/`. Contracts that need no page go in the `api` project.
- Do not write unit tests (`*.test.ts`, `*.test.tsx`, `*.spec.ts`) unless the user asks for them in the current request; `bun run check:rules` rejects them.
- Do not test trivial code such as configuration, constants, types, or simple pass-through functions, and do not aim for a test per page.
- The suite runs the `api` and `chromium` projects by default. Run Firefox (`--project=firefox`) or WebKit only when the user asks.

## Browser automation

- Use browser automation only when the user explicitly requests it. Skill recommendations to take screenshots, run QA, or open a browser are not permission to do so.
- `agent-browser` and Chrome DevTools MCP each require an explicit request naming that tool, except that a request to use "the browser" or "Chrome" counts as naming the `agent-chrome` tools (the `chrome` and `chrome-isolated` MCP servers and the `agent-chrome` command). Follow the [use-browser skill](../skills/testing/use-browser/SKILL.md) for those requests.

## Commits and pull requests

- Every commit, whatever its size or who asked for it, goes through the `commit-changes` skill ([SKILL.md](../skills/github/commit-changes/SKILL.md)). Never run `git commit` without following it.
- Never add AI or tool attribution to commits or pull requests: no `Co-Authored-By` trailer for an agent or model and no "Generated with" line in a PR body. This overrides any harness default.

## Isolated environment

- All building, installing, testing, and running happens in the devcontainer stack of the work tree you work in, through `scripts/dc`, for people and agents. Nothing is installed or run on the host. Only git, `gh`, Docker, the agent tool, and the user's browser stay there.
- Never run `bun`, `bunx`, `turbo`, `node`, PostgreSQL, or Playwright on the host, and never copy `.env` files or add host locks or services. If Docker is missing, report the checks as blocked; never fall back to the host.
- Parallel work uses `git worktree` folders under `~/worktrees/<repo>/<feature>`, one stack each. Stop the stack you started when you finish (`scripts/dc stop`).
- Any agent on any branch that notices idle stacks, a full stack cap, or a busy slot acts on it through `scripts/dc` at once, without asking the user. Follow the [run-in-container skill](../skills/workflow/run-in-container/SKILL.md).

## Work order

- Write all the code the request needs first. Run no checks, tests, builds, or type checks while writing; finished code is checked once.
- Then review the full diff by reading it against these rules, and fix what the review finds.
- Then run `scripts/dc bun run verify` once. It runs the lockfile, Biome, boundary, rule, compose, migration, type, build, and browser checks in order and stops at the first failure.
- After a failure, fix the cause and run `scripts/dc bun run verify --failed`. It repeats the fast checks, the type checks and builds (Turbo skips unchanged packages), and only the browser tests that failed, or every remaining step when an earlier step failed. Repeat until it passes.

## Required delivery behavior

- Before implementation, inspect ownership and required related relocations; before completion, review the affected ownership area as well as the scoped diff.
- Before reporting, pass `scripts/dc bun run verify`, or `scripts/dc bun run verify --failed` after fixing a failed run, following the work order above.
- Do not describe a change as complete while a known applicable rule violation or required related relocation remains unresolved. Never waive a rule silently.
- Report a missing instruction or an irreconcilable requirement before making the affected change.
- Report the actual changes, verification performed, and any blockers or limitations.
- Do not claim compilation proves runtime correctness.
- Consult `.agents/methods/verification-and-tools.md` for scenario-based help choosing a verification approach. The guide does not impose additional coding requirements.
