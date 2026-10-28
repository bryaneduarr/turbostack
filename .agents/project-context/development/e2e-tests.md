# End-to-end tests

Evidence: 2026-10-28; `9336cc7`; `scripts/dc bun run test:e2e` passed 12/12 (api, chromium, firefox).

- [playwright.config.ts](../../../apps/client/playwright.config.ts) starts the built API (3101) and client (3100) on `<DB_NAME>_test`.
- `test:e2e:changed` and `verify` run api and chromium; `test:e2e` adds firefox. WebKit is skipped on NixOS and when `DEVCONTAINER=true`.
- The stack installs the browsers; `test:e2e:install` is for hosts only.
- On NixOS, [load-nixos-browser-libraries](../../../apps/client/src/e2e/config/browsers/load-nixos-browser-libraries.config.ts) builds the libraries with Nix.
- The test database is recreated each run.
