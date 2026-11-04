#!/bin/sh
set -eu

rm -f /tmp/workspace-ready
flock /home/dev/.bun-cache/.install.lock bun install
bun run setup:env
touch /tmp/workspace-ready
exec sleep infinity
