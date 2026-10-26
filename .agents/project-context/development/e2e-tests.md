# End-to-end tests

Evidence: 2026-10-26; step 4 on `template/04-apps`; `test:e2e` passed 12/12 (api, chromium, firefox) without library exports.

- [playwright.config.ts](../../../apps/client/playwright.config.ts) starts the built API (3101) and client (3100) on `<DB_NAME>_test`.
- `bun run test:e2e:changed` and `verify` run api and chromium only; firefox runs with `test:e2e`; webkit is skipped on NixOS.
- On NixOS, [load-nixos-browser-libraries](../../../apps/client/src/e2e/config/browsers/load-nixos-browser-libraries.config.ts) builds the browser libraries with Nix and caches the path; no export needed.
- Browsers: `bun run test:e2e:install` once.
- Unique names per test; the test database is recreated each run.
