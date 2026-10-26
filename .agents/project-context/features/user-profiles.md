# User profiles reference feature

Evidence: 2026-10-26; step 4 on `template/04-apps`; server tests and `test:e2e` (api, chromium, firefox) passed.

- API: list, create, get, and replace names under `/api/v1/users/profiles`; [routes](../../../packages/schemas/src/server/routes/users/profiles/), [server](../../../apps/server/src/routes/users/profiles/user-profiles.router.ts).
- Client: [/profiles](../../../apps/client/src/app/profiles/page.tsx), [actions](../../../apps/client/src/actions/users/profiles/); browser validation, toasts, and `FailureAlert` with support codes.
- Table and grants live in `packages/database`; `app_runtime` may update only the name columns.
