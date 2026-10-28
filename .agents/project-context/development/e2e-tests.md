# End-to-end tests

Evidence: 2026-10-28; `chore/fast-checks` on `759ac4e`; api + chromium 7/7 at workers 3 to 12, firefox 5/5 ([measurements](../../plans/fast-checks/measurements.md)).

- Browser tests are the only tests (user decision 2026-10-28). [playwright.config.ts](../../../apps/client/playwright.config.ts) starts the built API (3101) and client (3100) on `<DB_NAME>_test`, prepared by `api-server#db:test:prepare`.
- `verify` runs api and chromium; Firefox (`test:e2e -- --project=firefox`) and WebKit only on request. WebKit is skipped on NixOS and when `DEVCONTAINER=true`.
- Workers stay 3: with 7 tests, more workers gave no gain. Override with `--workers=N`.
- The stack installs the browsers; `test:e2e:install` is for hosts only.
