# User profiles reference feature

Evidence: 2026-10-14; base `56951b6` plus uncommitted changes; Bun workflow tests passed; forms submitted without JavaScript against built apps.

- API: list, create, get, and replace names under `/api/v1/users/profiles`; [routes](../../../packages/schemas/src/server/routes/users/profiles/), [server](../../../apps/server/src/routes/users/profiles/user-profiles.router.ts).
- Client: [/profiles](../../../apps/client/src/app/profiles/page.tsx) and [actions](../../../apps/client/src/actions/users/profiles/).
- Migration `0001` requires names and indexes newest-first listing.
