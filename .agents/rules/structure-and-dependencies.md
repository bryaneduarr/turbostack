# Structure and dependencies

These rules are mandatory for code creation, changes, refactoring, review, and verification.

## Keep responsibilities clear

- Keep files focused on one responsibility, preferably one main function per file.
- Target approximately 150 lines per file. A small overrun is acceptable when splitting would reduce clarity; do not sacrifice correctness to meet the target.
- Split substantially larger implementation files by responsibility into descriptive subfolders.
- Keep schemas and interfaces grouped by feature, operation, or route under `packages/schemas/src/`. Each responsibility must have its own descriptive interface file containing only its related contracts.
- Use operation-specific folders and dedicated domain type locations when appropriate. Do not merge unrelated responsibilities into one type catalog or aggregate interface.
- Name files and folders for their actual responsibility. Avoid vague names such as `utils.ts`, `helpers.ts`, or `common.ts`.
- Preserve established architectural roots under `apps/client/src/`, `apps/server/src/`, and `packages/schemas/src/`. Roots such as `routes/`, `services/`, and `types/` provide an overview of code roles; domain modularization starts inside them, not by replacing them with a domain-first root tree.
- Put hooks, services, handlers, and routes inside their appropriate architectural roots, then organize them by their specific domain ownership. Put reusable schemas and data contract interfaces in their owning schema-package feature or route folder; keep local implementation types under their domain and operation inside the application's type root.
- Do not create folders named `shared/` anywhere.
- Do not create barrel files or re-exporting `index.ts` files. Import directly from actual modules.
- Existing architectural folders named `utils/`, `helpers/`, `services/`, or `types/` are allowed as role overviews, not catch-all owners. Their contents must follow the mandatory nested ownership rule below.

## Mandatory file naming and domain grouping

- Name implementation and contract files `<specific-responsibility>.<singular-role>.ts`, using kebab-case for the descriptive responsibility name. Use `.tsx` when JSX is required.
- Filenames must describe their concrete responsibility independently. Include domain or operation qualifiers when needed to distinguish responsibilities, but do not mechanically repeat every ancestor folder.
- Put the role last, immediately before the extension: `sign-in.interface.ts`, `sign-in.handler.ts`, `sign-in.router.ts`, `sign-in.module.ts`, or `sign-in.schema.ts`.
- The role suffix must remain singular even when a file defines multiple related interfaces, handlers, or other declarations. It identifies the file's responsibility, not its declaration count.
- Each file owns the actual implementation or declarations for that feature and role. Multiple directly exported declarations are allowed when they belong to that same responsibility; gathering exports from other files into a barrel is not allowed.
- A `.module.ts` file must define meaningful module behavior or composition, not merely forward exports or collect unrelated responsibilities.
- Keep files focused and apply the size guidance by splitting responsibilities into their specific owning folders, not by creating a global aggregate file.
- Do not create every example role file by default. Add only files required by the task.
- Preserve filenames required by frameworks or tools, such as Next.js `page.tsx`, `layout.tsx`, `loading.tsx`, or configuration files.
- Apply this naming to new files and existing files reorganized for the task. Do not rename unrelated existing files during another task.

## Mandatory deep ownership inside architectural roots

This is an acceptance condition for all project-owned frontend, backend, schema, and infrastructure source code, including existing code. It is not an optional preference for new files.

### Choose the deepest meaningful owner

- Within each established architectural root, organize by domain, feature, operation, and sub-operation as the actual responsibilities require. Use descriptive kebab-case folder names that identify what each grouping owns.
- Place feature-owned files under their most specific meaningful owner. Do not stop at a broad domain or feature folder when a real, more specific responsibility provides a clearer home.
- Each folder level must identify an actual ownership boundary or useful grouping. There is no fixed minimum or maximum depth, and no requirement to use every hierarchy level.
- Technical subfolders such as `handlers/`, `components/`, or `schemas/` are allowed beneath a specific owner when they clarify role grouping. They must not replace domain ownership or become dumping grounds. Put files directly in the operation folder when another level adds no meaning.
- Separate independent responsibilities into focused files in their owning folders. Tightly connected simple steps may remain together when splitting would obscure the operation. Do not create a file or folder for every statement, function, or procedural step.
- Keep orchestration and execution order understandable. Do not introduce empty scaffolding, speculative folder trees, forwarding wrappers, or artificial layers merely to increase depth.
- Preserve workspace boundaries, schema-package ownership, server/client runtime separation, framework-required routing structures and names, generated code, and external conventions. Root-wide entrypoints, configuration, and meaningful composition may remain at their actual root-wide owner.

### Give reusable capabilities explicit ownership

- When multiple features use the same implementation, place it under the narrowest truthful reusable capability owner within its appropriate architectural root. Use a specifically named cross-domain capability when no single feature owns it.
- Choose ownership by the capability's responsibility, not by its first consumer or consumer count alone. Do not move code upward merely because it is shared, duplicate equivalent implementations, or introduce generic `shared/`, `common/`, or catch-all folders.

### Evolve related existing structure with the task

- New features and operations must trigger an ownership review of both new files and related existing files. If the work establishes a more specific or reusable owner, move or adapt the related existing files into that owner, including files that otherwise would not need editing.
- Existing code is not grandfathered in. Bring the task's affected ownership area into compliance; do not limit the review to newly created or directly edited files.
- Related structural adaptation is part of the smallest correct change. A whole-repository migration or reorganization of unrelated ownership areas requires separate authorization.
- Complete each relocation by normalizing applicable filenames and updating affected imports, package exports, configuration references, and documentation. Remove obsolete empty folders. Preserve behavior, required tool paths and names, and unrelated user changes, including deletions.
- Do not treat relocation as permission for unrelated behavior changes, speculative abstraction, or test changes. If a required adaptation conflicts with user edits or cannot safely be completed, report the blocker rather than silently omitting it.

### Enforce ownership before implementation and completion

- Before implementation, inspect the existing architectural roots, related files, consumers, and ownership boundaries. Determine where new responsibilities belong and which existing files must move or adapt.
- Make straightforward placements using established ownership. Ask the user before proceeding when plausible alternatives imply materially different domain boundaries or architectural changes; do not guess or ask for permission for every folder.
- Before completion, review the scoped diff and affected ownership area for meaningful depth, specific naming, complete relocations, and preserved runtime boundaries. Use the appropriate static checks for affected packages; instruction-only changes require documentation checks rather than TypeScript compilation.
- Do not declare affected work complete while a known applicable structural violation or required relocation remains unresolved. Report blockers and verification limits explicitly. Correctness and type safety take precedence over cosmetic nesting.

## Keep changes scoped

- Preserve existing behavior unless the user requests a behavior change.
- Make the smallest clean change that fully solves the requested problem.
- Avoid unrelated refactors, unnecessary abstractions, boilerplate, and generated comments.
- Do not introduce forwarding wrappers without validation, transformation, authorization, error handling, business logic, or another concrete responsibility.
- Reuse code when it genuinely reduces duplication, not merely to add architectural layers.
- Inspect the working tree before editing and preserve unrelated user changes, including deletions.

## Monorepo utility ownership

- Put genuinely reusable, runtime-neutral functions, constants, and implementation capabilities under `packages/utils/src/`, organized by their deepest meaningful domain or capability owner, such as `http/status-codes/`. The package is an architectural role overview, not a flat catch-all.
- Keep Zod schemas and schema-derived application data contracts in `packages/schemas/src/`. Keep feature-owned business logic and server-only operations in their owning applications; do not relocate them merely because another consumer exists.
- Import cross-package utilities directly from exported `@workspace/utils/...` modules. Declare `@workspace/utils: workspace:*` in every importing package's dependencies; do not bypass workspace boundaries with relative filesystem imports or consumer-side path mappings.
- Do not add utility barrels, forwarding modules, aggregate registries, speculative scaffolding, or dependencies on consuming applications or schemas that create a dependency cycle. Add new capabilities only for actual use cases.

## Mandatory module import aliases

- Use aliases for every project-owned module import, including type-only imports, side-effect imports, dynamic imports, and `require` calls. Do not use relative or absolute filesystem paths such as `./file`, `../file`, or paths into another workspace's source directory.
- Inside a package, import its own modules through its owning `@workspace/<package>/...` alias, even for sibling files. Import modules from other packages through their exported `@workspace/<package>/...` subpaths. For example, use `@workspace/utils/http/status-codes/http-status-code.constant`.
- Inside an application, use `@/...` for application-local modules and `@workspace/<package>/...` for workspace dependencies. Keep bare external dependency imports such as `zod` and `cn` direct; do not create forwarding modules to disguise them as workspace code.
- Omit JavaScript and TypeScript file extensions from project module specifiers: never append `.js`, `.jsx`, `.mjs`, `.cjs`, `.ts`, `.tsx`, `.mts`, or `.cts`. Keep responsibility suffixes such as `.schema`, `.interface`, `.service`, and `.constant`.
- Define extensionless package subpaths in the owning package's `exports`, pointing directly to the actual implementation files. Keep self-alias mappings consistent with those exports, declare cross-package dependencies, and resolve other workspaces through their exports rather than consumer-side source path mappings. Preserve runtime boundaries and verify build-time and runtime alias resolution.
- Non-code imports such as stylesheets and JSON retain their required extensions but still use aliases. Configuration filesystem values, migration paths, Markdown links, and framework-generated imports are not source module imports to rewrite. Preserve generated files such as Next.js `next-env.d.ts` and emitted build output.
- Enforce the source import policy through the shared Biome `noRestrictedImports` rule. Do not enable `useImportExtensions`, weaken the restrictions, or add source-level suppressions to permit forbidden imports. Before completion, audit affected imports and run the owning packages' type checks and lint; verify affected builds when aliases or exports change.

## Dependencies

The root `package.json` dependencies and devDependencies must be limited to `@workspace/biome`, `@workspace/typescript`, and `turbo`.

- Keep the workspace configuration dependencies at `workspace:*`.
- Use the Turbo version available when dependencies are updated; these rules do not require a fixed version.
- Do not add any other root dependency or devDependency.
- Add dependencies to the workspace package that owns the code or configuration.
- Do not change unrelated dependency versions during another task.

## Decision priority

When valid approaches conflict, prefer, in order:

1. Correct behavior.
2. Type safety.
3. Clear responsibility boundaries.
4. Readability.
5. Maintainability.
6. Simple implementation.
7. Reuse that genuinely reduces duplication.
8. Performance optimization supported by a demonstrated need.
