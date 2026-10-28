#!/usr/bin/env bash
# shellcheck disable=SC2034
# Work tree root, stack name, and the git mount a linked work tree needs.

PRIMARY_PROJECT=app-devcontainer

resolve_root() {
  local top
  top=$(git rev-parse --show-toplevel 2>/dev/null || true)
  if [ -n "$top" ] && [ -f "$top/.devcontainer/docker-compose.yml" ]; then
    ROOT=$top
  else
    ROOT=$(CDPATH='' cd -- "$(dirname -- "$SCRIPT")/.." && pwd)
  fi
}

git_common_dir() {
  git -C "$1" rev-parse --path-format=absolute --git-common-dir
}

is_primary_tree() {
  [ "$(git -C "$1" rev-parse --path-format=absolute --git-dir)" = "$(git_common_dir "$1")" ]
}

slugify() {
  printf '%s' "$1" | tr '[:upper:]' '[:lower:]' | tr -c 'a-z0-9' '-' | sed -e 's/--*/-/g' -e 's/^-//' -e 's/-$//' | cut -c1-30
}

stack_name_for() {
  local root=$1 primary=$2
  if [ "$primary" = 1 ]; then
    echo "$PRIMARY_PROJECT"
  else
    echo "app-$(slugify "$(basename "$root")")-$(printf '%s' "$root" | sha256sum | cut -c1-6)"
  fi
}

# Reads "project|working_dir" lines and prints the project already made for this root, preferring the canonical name.
legacy_project_for() {
  local root=$1 canonical=$2 project directory first=''
  while IFS='|' read -r project directory; do
    if [ "$directory" = "$root/.devcontainer" ]; then
      [ "$project" = "$canonical" ] && { echo "$project"; return 0; }
      [ -n "$first" ] || first=$project
    fi
  done
  [ -n "$first" ] && echo "$first"
  return 0
}

workspace_labels() {
  docker ps -a --filter label=com.docker.compose.service=workspace \
    --format '{{.Label "com.docker.compose.project"}}|{{.Label "com.docker.compose.project.working_dir"}}|{{.Label "com.docker.compose.project.config_files"}}|{{.State}}|{{.ID}}' 2>/dev/null |
    grep -E '\|[^|]*\.devcontainer/docker-compose\.yml[^|]*\|' || true
}

resolve_stack() {
  local primary=0 canonical existing
  resolve_root
  is_primary_tree "$ROOT" && primary=1
  canonical=$(stack_name_for "$ROOT" "$primary")
  existing=$(workspace_labels | cut -d'|' -f1,2 | legacy_project_for "$ROOT" "$canonical")
  PROJECT=${existing:-$canonical}
  IS_PRIMARY=$primary
  echo "$ROOT" >"$STATE/stacks/$PROJECT.root"
}
