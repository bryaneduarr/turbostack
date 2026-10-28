#!/usr/bin/env bash
# shellcheck disable=SC2153
# The scripts/dc subcommands other than running a command.

human_age() {
  local seconds=$1
  if [ "$seconds" -ge 86400 ]; then echo "$((seconds / 86400))d ago"
  elif [ "$seconds" -ge 3600 ]; then echo "$((seconds / 3600))h ago"
  elif [ "$seconds" -ge 60 ]; then echo "$((seconds / 60))m ago"
  else echo "${seconds}s ago"; fi
}

stack_ports() {
  docker port "$(stack_container "$1")" 2>/dev/null |
    sed -e 's|^3000/tcp -> .*:|client:|' -e 's|^3001/tcp -> .*:|api:|' |
    grep -E '^(client|api):' | sort -u | tr '\n' ' '
}

list_stacks() {
  local project root state busy ports last note
  printf '%-34s %-8s %-10s %-5s %-44s %s\n' PROJECT STATE LAST-USE BUSY PORTS WORK-TREE
  for project in $(all_projects); do
    root=$(stack_root "$project")
    state=stopped
    busy=-
    ports=-
    if stack_is_running "$project"; then
      state=running
      busy=no
      stack_is_busy "$project" && busy=yes
      ports=$(stack_ports "$project")
    fi
    last=$(stack_last_activity "$project")
    note=''
    [ -n "$root" ] && [ ! -d "$root" ] && note=' (work tree missing)'
    should_prune "$project" "$root" "$last" "$(now)" && note=' (prune removes it)'
    printf '%-34s %-8s %-10s %-5s %-44s %s%s\n' "$project" "$state" "$(human_age $(($(now) - last)))" "$busy" "$ports" "${root:--}" "$note"
  done
}

stop_stack_named() {
  local project=$1 lock
  if [ "$project" = "$PROJECT" ]; then
    wait_for_lock lock "$STATE/stacks/$project.use" -x "the use lock of $project"
    remove_stack_containers "$project"
    lock_release "$lock"
  elif ! stop_if_unused "$project" --force; then
    echo "dc: $project is busy and was left running." >&2
    return 0
  fi
  echo "dc: stopped $project (data kept)." >&2
}

stop_stacks() {
  local project
  if [ "${1:-}" = --all ]; then
    for project in $(running_stacks | cut -d'|' -f1); do
      stop_stack_named "$project"
    done
  else
    stop_stack_named "$PROJECT"
  fi
}

stop_idle_stacks() {
  PROJECT=''
  reap_idle --force
}

down_stack() {
  local lock
  wait_for_lock lock "$STATE/stacks/$PROJECT.use" -x "the use lock of $PROJECT"
  compose down "$@"
  lock_release "$lock"
}

usage() {
  cat >&2 <<'USAGE'
Usage: scripts/dc <command> [args...]   run a command in this work tree's stack
       scripts/dc up [--build]          start the stack (--build rebuilds the shared image)
       scripts/dc list                  every stack: state, last use, busy, ports, work tree
       scripts/dc ports                 URLs of this stack's services
       scripts/dc stop [--all]          stop this stack (or every stack), keeping data
       scripts/dc stop-idle             stop stacks idle past the idle limit
       scripts/dc down [-v]             remove this stack's containers (-v also deletes its data)
       scripts/dc prune [--dry-run]     remove stacks whose work tree is gone, and unused old images
       scripts/dc status                list this stack's services
       scripts/dc shell                 open a shell in the workspace
USAGE
  exit 2
}
