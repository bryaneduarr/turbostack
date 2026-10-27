# Capability map

Evidence: 2026-10-26 UTC; `31c5212` plus steps 1 to 3 of the [template port](../plans/template-port/plan.md) (instructions, rule enforcement, tokens, database, Docker, devcontainer, setup). Paths source-inspected; no runtime checks for this map.

Planner use: reuse what Features lists, build what Known gaps names, then open the linked topic notes. Owners are the paths to recheck when a line looks stale.

## Features

- **Health probes**: live/ready endpoints with draining shutdown. Owners: `apps/server/src/routes/health/`, `packages/schemas/src/server/routes/health/`. Note: [health](features/health.md).
- **User profiles** (reference feature): list, create, get, rename. Owners: `apps/server/src/routes/users/profiles/`, `apps/server/src/services/users/profiles/`, `apps/client/src/app/profiles/`. Note: [user profiles](features/user-profiles.md).
- **Typed API contracts**: route definitions, `sendApiRequest`, concrete envelopes. Owners: `packages/schemas/src/server/routes/`, `packages/api-client/src/requests/`. Notes: [routes](contracts/route-definitions.md), [responses](contracts/success-responses.md).
- **Status codes**: `packages/utils/src/http/status-codes/http-status-code.constant.ts`.
- **Rule enforcement**: `config/rules/`, `config/biome/plugins/`. Note: [rule enforcement](development/rule-enforcement.md).
- **Design tokens**: neutral light and dark tokens, motion utilities, Lucide icons. Owner: `config/tailwind/globals.css`.
- **Database**: `packages/database` with migrator, runtime, and read-only roles, grant tests, test database, `seed:dev`. Note: [database](packages/database.md).
- **One-command setup and devcontainer**: `config/setup` (env files, `doctor`, `doctor:stack`), `.devcontainer/`, `scripts/dc`, `bun run verify`. Note: [devcontainer](development/devcontainer-workflow.md).
- **Detached dev stack**: `bun run dev:start`, `dev:status`, `dev:stop`. Owner: `scripts/dev-stack.script.ts`.

## Feature slice

User profiles is the example. Add files in each layer, reading only the named example when the exact shape matters.

- **Table, migration, grant**: `packages/database/src/tables/users/profile/user-profile.table.ts`, `packages/database/src/migrations/0002_grant_user_profile_roles.sql`, expectations in `apps/server/src/db/testing/grants/expectations/`.
- **Route definition and schemas**: `packages/schemas/src/server/routes/users/profiles/create/create-user-profile.route.ts` and `user-profile.schema.ts`.
- **Server contract, handler, service**: `apps/server/src/routes/users/profiles/create/`, `apps/server/src/services/users/profiles/create/create-user-profile.service.ts`.
- **Router and tests**: `apps/server/src/routes/users/profiles/user-profiles.router.ts`, `user-profiles.test.ts` beside it.
- **Client page, action, form parser**: `apps/client/src/app/profiles/page.tsx`, `apps/client/src/actions/users/profiles/create/`, `apps/client/src/services/users/profiles/form/parse-user-profile-form.service.ts`.
- **UI**: base components in `packages/ui/src/components/` (only `Button` today).

## Known gaps

- Rules and skills now describe tooling that steps 4 and 5 of the [template port](../plans/template-port/plan.md) still add: Playwright, `useClientFormValidation`, base components, support error codes, and `docs/`.
- Product domain is not chosen: [current scope](product/current-scope.md).
