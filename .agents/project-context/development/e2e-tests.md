# End-to-end tests

Evidence: 2026-10-28; `chore/fast-checks` on `759ac4e`; api + chromium 7/7 at workers 3 to 12, firefox 5/5 ([measurements](../../plans/fast-checks/measurements.md)).

- Browser tests are the only tests (user decision 2026-10-28). [playwright.config.ts](../../../apps/client/playwright.config.ts) starts the built API (3101) and client (3100) on `<DB_NAME>_test`, prepared by `api-server#db:test:prepare`.
- `verify` runs api and chromium; Firefox (`test:e2e -- --project=firefox`) and WebKit only on request. WebKit is skipped on NixOS and when `DEVCONTAINER=true`.
- Workers: 10 locally and 4 when `CI` is set, carried from Veyra's 119-test measurement so projects built from the template start fast; with 7 tests the count changes nothing. Chromium runs with `--disable-gpu`, and `actionTimeout` is 5 s so a missing element fails in seconds (a broken test took the run from 12 s to 38 s; 10 s with the limit). Override with `--workers=N`.
- The Tests rules ask for an API session helper when signing in is only setup, no waits on the real clock, and scenarios that filter shared lists by their own records. The template has no sign-in yet, so no helper exists.
- The stack installs the browsers; `test:e2e:install` is for hosts only.
