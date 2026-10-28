#!/usr/bin/env bash
# shellcheck disable=SC2153
# Compose wrapper for one stack, plus the git mount a linked work tree needs.

prepare_compose() {
  HOST_UID=$(id -u)
  HOST_GID=$(id -g)
  export HOST_UID HOST_GID
  # Only one heavy command runs at a time, so a stack may use every core but two.
  local cores
  cores=$(nproc)
  DEVCONTAINER_WORKSPACE_CPUS=${DEVCONTAINER_WORKSPACE_CPUS:-$((cores > 4 ? cores - 2 : cores))}
  export DEVCONTAINER_WORKSPACE_CPUS
  ENV_FILE="$ROOT/apps/server/.env"
  [ -f "$ENV_FILE" ] || ENV_FILE="$ROOT/apps/server/.env.example"
  COMPOSE_FILES=(-f "$ROOT/.devcontainer/docker-compose.yml")
  if [ "$IS_PRIMARY" != 1 ]; then
    write_git_override
    COMPOSE_FILES+=(-f "$STATE/stacks/$PROJECT.git.yml")
  fi
  export DEVCONTAINER_IMAGE_TAG PLAYWRIGHT_VERSION
}

write_git_override() {
  local common
  common=$(git_common_dir "$ROOT")
  printf 'services:\n  workspace:\n    volumes:\n      - "%s:%s:ro"\n' "$common" "$common" >"$STATE/stacks/$PROJECT.git.yml"
}

compose() {
  docker compose -p "$PROJECT" --env-file "$ENV_FILE" "${COMPOSE_FILES[@]}" "$@"
}

is_ready() {
  compose exec -T workspace test -f /tmp/workspace-ready </dev/null >/dev/null 2>&1
}

# Maps the caller's directory inside the work tree to the same directory under /workspace.
container_directory() {
  case "$PWD" in
    "$ROOT" | "$ROOT"/*) echo "/workspace${PWD#"$ROOT"}" ;;
    *) echo /workspace ;;
  esac
}
