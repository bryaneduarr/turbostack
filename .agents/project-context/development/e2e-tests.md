# End-to-end tests

Evidence: 2026-10-26; step 4 on `template/04-apps`; `test:e2e` passed 7/7 (api, chromium) and 5/5 (firefox).

- [playwright.config.ts](../../../apps/client/playwright.config.ts) starts the built API (3101) and client (3100) on `<DB_NAME>_test`.
- `bun run test:e2e:changed` and `verify` run api and chromium only; firefox runs with `test:e2e`; webkit is skipped on NixOS.
- On NixOS, a browser missing `libglib` needs `NIX_LD_LIBRARY_PATH` and `LD_LIBRARY_PATH` pointing at its libraries.
- Unique names per test; the test database is recreated each run.
