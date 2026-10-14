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

- Document each responsibility-specific interface, its explicitly declared members, and schema fields as required by `types-and-validation.md`, using brief `/* ... */` comments that explain purpose without file paths.
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

## Required delivery behavior

- Before implementation, inspect ownership and required related relocations; before completion, review the affected ownership area as well as the scoped diff.
- Do not describe a change as complete while a known applicable rule violation or required related relocation remains unresolved.
- Report the actual changes, verification performed, and any blockers or limitations.
- Do not claim compilation proves runtime correctness.
- Consult `.agents/methods/verification-and-tools.md` for scenario-based help choosing a verification approach. The guide does not impose additional coding requirements.
