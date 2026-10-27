#!/bin/sh
set -eu

rm -f /tmp/workspace-ready
bun install
bun run setup:env
touch /tmp/workspace-ready
exec sleep infinity
