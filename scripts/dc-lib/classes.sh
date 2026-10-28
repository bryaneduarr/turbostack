#!/usr/bin/env bash
# Which locks a command needs: the global heavy slot, the per-stack lock, both, or none.

HEAVY_WORDS='build|check|verify|playwright|test:e2e[^ ]*'
DATABASE_WORDS='test|check|verify|dev:start|db:[^ ]+|drizzle:[^ ]+|seed:dev|test:e2e[^ ]*'

command_has_word() {
  printf ' %s ' "$2" | grep -qE " ($1) "
}

# Prints "heavy" and "stack" for the words of a command line; only bun, bunx, turbo, and node commands are classified.
command_classes() {
  local line="$*" lock=${DC_LOCK:-}
  case "$lock" in
    none) return ;;
    stack) echo stack; return ;;
    heavy) echo heavy; echo stack; return ;;
  esac
  case "${1:-}" in bun | bunx | turbo | node) ;; *) return ;; esac
  command_has_word "$HEAVY_WORDS" "$line" && echo heavy
  command_has_word "$DATABASE_WORDS" "$line" && echo stack
  return 0
}
