# Capability map

Evidence: 2026-10-26 UTC; `31c5212` plus all 5 steps of the [template port](../plans/template-port/plan.md). Paths source-inspected; no runtime checks for this map.

Planner use: reuse what Features lists, build what Known gaps names, then open the linked topic notes. Owners are the paths to recheck when a line looks stale.

## Features

- **Health probes**: live/ready endpoints with draining shutdown. Owners: `apps/server/src/routes/health/`, `packages/schemas/src/server/routes/health/`. Note: [health](features/health.md).
- **User profiles** (reference feature): list, create, get, rename. Owners: `apps/server/src/routes/users/profiles/`, `apps/server/src/services/users/profiles/`, `apps/client/src/app/profiles/`. Note: [user profiles](features/user-profiles.md).
- **Typed API contracts**: route definitions, `sendApiRequest`, concrete envelopes. Owners: `packages/schemas/src/server/routes/`, `packages/api-client/src/requests/`. Notes: [routes](contracts/route-definitions.md), [responses](contracts/success-responses.md).
- **Status codes**: `packages/utils/src/http/status-codes/http-status-code.constant.ts`.
- **Rule enforcement**: `config/rules/`, `config/biome/plugins/`. Note: [rule enforcement](development/rule-enforcement.md).
- **Design tokens**: neutral light and dark tokens, motion utilities, Lucide icons. Owner: `config/tailwind/globals.css`.
- **Database**: `packages/database` with migrator, runtime, and read-only roles, grant tests, test database, `seed:dev`. Note: [database](packages/database.md).
- **One-command setup and devcontainer**: `config/setup` (env files, `doctor`, `doctor:stack`), `.devcontainer/`, `scripts/dc` (a stack per work tree), `bun run verify`. Note: [devcontainer](development/devcontainer-workflow.md).
- **Support error codes**: `SUPPORT_ERROR_CODE` in `packages/schemas/src/support/errors/codes/`, request IDs on every API error, `describeSupportReference` and `describeFailedMutation` in `packages/api-client/src/results/`, shown by `ErrorReference`, `FailureAlert`, `ApiFailureAlert`, and the error pages.
- **Base UI components**: typography, links, buttons, fields, layout, feedback, toasts, data display, navigation (`AppBar`), dialog, motion in `packages/ui/src/components/`; shared class maps in `packages/ui/src/config/`.
- **Browser form validation**: `useClientFormValidation` and `useActionToast` in `packages/ui/src/hooks/`.
- **Client security headers**: `apps/client/src/proxy.ts`, `packages/utils/src/http/security-headers/`.
- **End-to-end tests**: Playwright on ports 3100-3101. Note: [e2e tests](development/e2e-tests.md).
- **User docs**: `docs/` (get started, requirements, run, tests, production, devcontainer, troubleshooting) and the root `README.md`.
- **Detached dev stack**: `bun run dev:start`, `dev:status`, `dev:stop`. Owner: `scripts/dev-stack.script.ts`.

## Feature slice

User profiles is the example. Add files in each layer, reading only the named example when the exact shape matters.

- **Table, migration, grant**: `packages/database/src/tables/users/profile/user-profile.table.ts`, `packages/database/src/migrations/0002_grant_user_profile_roles.sql`, expectations in `apps/server/src/db/testing/grants/expectations/`.
- **Route definition and schemas**: `packages/schemas/src/server/routes/users/profiles/create/create-user-profile.route.ts` and `user-profile.schema.ts`.
- **Server contract, handler, service**: `apps/server/src/routes/users/profiles/create/`, `apps/server/src/services/users/profiles/create/create-user-profile.service.ts`.
- **Router and tests**: `apps/server/src/routes/users/profiles/user-profiles.router.ts`, `user-profiles.test.ts` beside it.
- **Client page, action, form parser**: `apps/client/src/app/profiles/page.tsx`, `apps/client/src/actions/users/profiles/create/`, `apps/client/src/services/users/profiles/form/parse-user-profile-form.service.ts`.
- **Form and toasts**: `apps/client/src/components/users/profiles/form/user-profile-form.component.tsx`, `describe-user-profile-toast.service.ts` beside the parser.
- **E2E**: `apps/client/src/e2e/api-contracts/users/profiles/`, `apps/client/src/e2e/users/profiles/`.

## Known gaps

- No hosted CI by choice; `bun run verify` is the gate before pushing.
- WebKit is not run on NixOS hosts or in the container.
- Product domain is not chosen: [current scope](product/current-scope.md).
