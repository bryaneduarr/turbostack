#!/bin/sh
set -eu

rm -f /tmp/workspace-ready
flock /home/dev/.bun-cache/.install.lock bun install
bun run setup:env
(cd apps/client && flock /home/dev/.playwright-browsers/.install.lock bunx playwright install chromium firefox) \
  || echo "Playwright browser install failed; end-to-end tests cannot run." >&2
touch /tmp/workspace-ready
exec sleep infinity
