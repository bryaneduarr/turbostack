# @workspace/utils

Reusable, runtime-neutral functions, constants, and implementation capabilities
for the monorepo. Schemas and schema-derived application contracts remain in
`@workspace/schemas`; feature business logic stays with its owning application.

## Structure

```text
packages/utils/
├── .gitignore
├── biome.json
├── package.json
├── tsconfig.json
└── src/
    └── http/
        └── status-codes/
            └── http-status-code.constant.ts
```

This package follows the schemas package's source-export approach: consumers
transpile the exported TypeScript, so no separate build step is required.
TypeScript and Biome inherit the workspace configuration.

## HTTP Status Constants

The status catalog is the single source of numeric HTTP statuses and validation
range bounds. The existing upstream definitions and `MAX_HTTP_STATUS` are
preserved. Use named constants for response construction, comparisons, logging
thresholds, validation bounds, and computed OpenAPI response keys.

Add `"@workspace/utils": "workspace:*"` to every consumer's dependencies and
import directly from its exported module:

```ts
import {
  BAD_REQUEST,
  OK,
} from "@workspace/utils/http/status-codes/http-status-code.constant";
```

Schema modules use this same package alias, not deep relative filesystem paths.
Do not copy the catalog, add forwarding modules, or hardcode status numbers in
consumer code.

## Adding Utilities

- Organize new capabilities by their specific domain and operation under `src/`.
- Use responsibility-specific filenames with singular role suffixes.
- Add an explicit capability export pattern when another domain is needed.
- Keep modules runtime-neutral and dependencies limited to actual requirements.
- Do not introduce barrel files, `shared/` folders, or dependencies on consumers.
- Do not move schemas, application data contracts, or feature business logic here.

## Checks

Run from the repository root:

```sh
bun run --cwd packages/utils check-types
bun run --cwd packages/utils lint
```

The package also provides the same `format`, `clean`, and `update` scripts as
`@workspace/schemas`. Existing Turborepo tasks discover it through `packages/*`
and the declared workspace dependency graph.
