# TypeScript and Zod validation

These rules are mandatory. Use modern TypeScript 7 and Zod 4 conventions.

## Mandatory responsibility-specific interface files

- Organize reusable application schemas and interfaces under `packages/schemas/src/` by their most specific meaningful domain, feature, operation, or route owner, such as `authentication/sign-in/`, `routes/list-items/`, and `routes/create-item/`. Preserve established architectural roots and apply the mandatory deep ownership rule from `structure-and-dependencies.md` inside them.
- Create descriptively named interface files dedicated to their responsibility, such as `sign-in.interface.ts`, `list-items.interface.ts`, and `create-item.interface.ts`.
- Each interface file must contain all interfaces needed for that responsibility, and no unrelated feature or route contracts. Separate responsibilities into separate files and folders.
- Export descriptive named interfaces representing actual data, such as `ValidatedSignInCredentials` or `ListItemsResponse`. Consumers must import the interface directly from its owning file.
- Do not create a global type catalog, aggregate interface, `shared/` folder, barrel file, or re-exporting `index.ts`. Do not group unrelated contracts into a single interface or retrieve them through a global interface's indexed members.
- Keep reusable runtime Zod schemas in their owning domain or operation folder. Reference them directly from the corresponding interface file using type-only imports.
- Derive validated object contracts from `z.output<typeof schema>` or `z.infer<typeof schema>`. An interface may extend a schema-derived object type; explicitly documented fields must use indexed access to that type rather than copying primitive types by hand.
- Derive distinct pre-transformation input contracts with `z.input<typeof schema>`. Name input and validated output contracts separately when their shapes differ.
- Use schema-derived type aliases in the same responsibility-specific file for unions, primitives, or other shapes that TypeScript interfaces cannot represent faithfully. Do not invent an object wrapper just to use an interface.
- Reuse existing library types and derive related types with indexed access, `Pick`, `Omit`, `Parameters`, or `ReturnType` instead of copying definitions.
- Do not duplicate equivalent contracts across client and server; both must import from the owning schema-package file. Local implementation types belong under their domain and operation inside the application's type root; library-owned types retain their appropriate locations.
- When a task establishes a better owner for related existing contracts, move or adapt their interface files and schemas, including otherwise untouched files, and update affected consumers, exports, configuration references, and documentation. Bring the affected ownership area into compliance without migrating unrelated contracts or authorizing a repository-wide refactor.
- Keep authoritative request and mutation validation, authorization, secrets, and server-only operations on the server. Clients must still validate incoming API responses; that validation does not replace server validation. Type-only imports must not introduce server runtime dependencies into client bundles.

## Mandatory contract documentation

- Use `/** ... */` JSDoc comments immediately above every responsibility-specific interface or type, its explicitly declared members, and every field in a Zod object schema, so editors show them on hover. Do not use plain `/* ... */` or `//` comments for contract documentation.
- Briefly state the interface's main purpose in its JSDoc comment.
- Briefly explain what each member represents, distinguishing raw input from validated output when relevant. Prefer a single-sentence JSDoc comment.
- Briefly explain what each schema field represents or controls. Mention constraints, transformations, defaults, or optionality only when needed to clarify its purpose.
- Do not include file paths, source file inventories, or consumer file inventories in these comments.
- Update comments when the represented data or purpose changes.
- Names must describe the actual responsibility. Do not use vague contract or member names such as `Data`, `Payload`, `value`, or `item` when the purpose can be named explicitly.
- Comments must explain semantics, not merely repeat a field name or its primitive type.

Example for `authentication/sign-in/sign-in.interface.ts` (illustrative; this does not create the file):

```ts
import type { z } from "zod";
import type { signInSchema } from "@workspace/schemas/authentication/sign-in/sign-in.schema";

type ValidatedSignInData = z.output<typeof signInSchema>;

/** Represents validated credentials used to sign in. */
export interface ValidatedSignInCredentials extends ValidatedSignInData {
  /** Identifies the account using its normalized email address. */
  email: ValidatedSignInData["email"];
  /** Contains the nonempty password submitted for authentication. */
  password: ValidatedSignInData["password"];
}
```

Database configuration and individual route contracts must have their own dedicated interface files, not members added to this authentication interface.

The example shows the required brief comment style. Production comments must describe the actual contract's purpose.

## Validate at trust boundaries

- Validate untrusted values before treating them as application data.
- Boundaries include request bodies, query strings, URL parameters, forms, cookies, environment variables, API responses, external service responses, and database input.
- Never trust values merely because they came from the frontend, a Server Action, or a supposedly internal request.
- Use `safeParse` for expected validation failures and handle both success and failure explicitly.
- Use `parse` when invalid data is exceptional and throwing is appropriate, such as invalid startup configuration or a server-generated response that violates its contract.
- Use the parsed result, not the original input, for subsequent application logic.
- Validate incoming API responses on the receiving side; a server-side schema or a TypeScript annotation does not validate network data for a client.
- OpenAPI descriptions and generated documentation do not replace runtime validation.

## Validate user input in the browser first

- Every form or other user-triggered submission must validate all of its values in the browser before sending them to a Server Action or the API: emails, passwords, and every other field. Cancel the submission and show each unmet requirement next to its field when any value is invalid, so invalid data never reaches the server.
- Run the same shared schemas and form parsers the server uses; never write separate client-only rules that can drift from the server's. In the web client, use `useClientFormValidation` with the form's parser and keep server-returned field errors as the fallback.
- Browser validation only reduces server load and gives faster feedback. The server still validates every value as an untrusted boundary, and forms keep working without JavaScript.

## Concrete endpoint contracts

- Every new or changed JSON endpoint must use a concrete request schema for each input it consumes and a concrete response schema for its payload.
- Compose route-specific success schemas with `createSuccessResponseSchema` rather than duplicating envelope fields.
- Reuse the same response schema for runtime validation and route documentation.
- Do not use `successResponseSchema`, `responseEnvelopeSchema`, `z.any()`, or `z.unknown()` as a substitute for a concrete domain payload contract.
- Broad envelope schemas may serve as composition bases or generic documentation, not final validation of domain data.
- `z.json()` verifies JSON compatibility, not a domain object's shape. It does not replace a concrete payload schema.
- Model success and failure with literal discriminants and explicit payloads. Do not represent unrelated variants as optional-field bags.
- Validate server-generated JSON responses before serialization and keep payloads JSON-compatible.
- Do not use passthrough schemas for sensitive response objects. Deliberately strip or reject undeclared fields.
- Do not add placeholder request contracts to endpoints that consume no request input.

## End-to-end route definitions

- Every API endpoint has exactly one route definition, `<operation>.route.ts`, in its owning `packages/schemas/src/server/routes/` domain and operation folder. Declare it `as const satisfies RouteDefinition`.
- Declare every `RouteDefinition` member: `method`, `path`, `params`, `query`, `body`, and `response`. Use `null` for an input the route does not consume. Never omit members, make them optional, or substitute placeholder schemas.
- `path` is the full request path the client calls, including any version prefix from `api-version-prefix.constant.ts` and `:name` path parameters. `params`, `query`, and `body` are concrete Zod schemas when the route consumes them.
- Register server routes only with `.route(route.method, route.path, handler, contract)`. The contract `satisfies RouteContract<typeof route>`, which requires each non-null input schema so Elysia validates it, and forbids null ones. Handlers build responses with `route.response`.
- Clients call the API only through `sendApiRequest` with the route definition and explicit `params`, `query`, and `body` values, passing `null` for inputs the route does not consume. Never hand-write API paths or methods, or choose response schemas separately from the route.
- Handle every `ApiResult` variant: `success`, `failure`, `unexpected-response`, and `unreachable`.
- Clients and servers deploy independently, so change published routes additively: new response fields (older clients strip unknown keys), new routes, or new versioned paths. Removing or renaming fields, tightening inputs, or adding error codes that older clients must understand requires a new versioned route.

## Required values and explicit absence

- Make validated domain values and internal function parameters required and non-nullable by default. Allow `null`, `undefined`, optional properties, `.optional()`, `.nullable()`, or `.nullish()` only when absence has a concrete domain, persistence, protocol, framework, or library meaning. Document that meaning in the owning contract only when the name and type do not already make it obvious; never add clauses such as "or null when none", "an empty list means valid", or a default already visible in code.
- Do not make a field optional merely to simplify callers or provide a hidden fallback. Require callers to supply known values. Normalize genuinely optional boundary input once with a meaningful schema default or transformation, then use its required parsed output internally.
- Model mutually exclusive states with literal-discriminated unions and required fields for each variant, not bags of optional or nullable members. Narrow the state before accessing variant-specific fields and handle every variant explicitly.
- Never use non-null assertions (`!`). Outside tests, use optional chaining (`?.`) only directly after a regex result (`.exec(...)`, `.match(...)`), a `Map` lookup (`.get(...)`), or an index access (`[...]`). Everywhere else, correct the source contract when presence is guaranteed, or narrow the value with an explicit check and define the missing-value behavior before access.
- Handle edge cases deliberately: missing versus explicit null input, empty strings, empty collections, failed array/map lookups, unmatched routes, missing request context, invalid status codes, nullable database columns, and framework lifecycle states. Use tuples for fixed-size results when required elements are known structurally.
- Do not replace meaningful absence with arbitrary empty objects, empty strings, zero, random identifiers, or other fabricated domain values. Defaults must preserve the intended semantics; reject invalid data, return a documented absent-state variant, or omit a genuinely optional external field after narrowing.
- Preserve intentional wire-level nulls and bodyless HTTP responses when the published protocol requires them. Do not silently change API or database contracts just to remove nullability.
- Keep genuine boundary `unknown`, including arbitrary thrown values that may themselves be null or undefined, until it is validated or narrowed. Do not assert it into a required domain value.
- Before completing nullable-contract changes, inspect producers and consumers, review each retained absence case, and run affected package type checks.

## No unsafe typing

- Do not introduce explicit `any`, `z.any()`, or implicit `any` in application code.
- Keep strict TypeScript checking, `noUncheckedIndexedAccess`, and `exactOptionalPropertyTypes` enabled, and enforce Biome's `noNonNullAssertion` rule. Optional keys must not accept explicit undefined unless the contract deliberately permits it. Compilation alone does not prove the absence of explicit or dependency-provided `any`.
- Use `unknown` for genuinely unvalidated external values, arbitrary thrown errors, or generic boundary inputs. Narrow or validate them before accessing properties or passing them to domain logic.
- Do not replace legitimate boundary `unknown` with an assertion or a guessed domain type just to remove the word.
- Do not let validated domain payloads remain `unknown` when their schema can define a concrete shape.
- Do not claim every value is known before validation or that Zod guarantees complete runtime correctness.
- Never use assertions, non-null assertions, `@ts-ignore`, or `@ts-expect-error` merely to suppress a type error.
- Assertions are allowed only for a genuine runtime guarantee that TypeScript cannot represent. Correct the source type, function signature, or schema whenever possible.
- Narrow with discriminants, `in`, `typeof`, or `instanceof`; any custom type guard must actually verify its claim.
- Handle `null`, `undefined`, optional properties, absent keys, empty arrays, array lookups, map lookups, and database nullable fields explicitly.
- Use typed parameter objects when several related parameters represent one logical input.
- Prefer `satisfies` over an assertion when checking a known value against a type.
