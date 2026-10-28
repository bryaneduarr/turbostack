#!/usr/bin/env bash
# shellcheck disable=SC2153
# Finding stacks by Compose labels and registry files, and telling whether one is busy or idle.

# Lines of "project|work tree|container id" for every running workspace container.
running_stacks() {
  workspace_labels | awk -F'|' '$4 == "running" { sub(/\/\.devcontainer$/, "", $2); print $1 "|" $2 "|" $5 }'
}

# Names of every stack: running ones found by label and stopped ones kept in the registry.
all_projects() {
  {
    running_stacks | cut -d'|' -f1
    local file
    for file in "$STATE"/stacks/*.root; do
      [ -e "$file" ] && basename "$file" .root
    done
  } | sort -u
}

stack_root() {
  local project=$1 found
  found=$(running_stacks | awk -F'|' -v p="$project" '$1 == p { print $2; exit }')
  if [ -n "$found" ]; then echo "$found"; else cat "$STATE/stacks/$project.root" 2>/dev/null || true; fi
}

stack_container() {
  running_stacks | awk -F'|' -v p="$1" '$1 == p { print $3; exit }'
}

stack_is_running() {
  [ -n "$(stack_container "$1")" ]
}

# Reads "docker top" output and keeps only processes beyond the idle workspace and its health probe.
extra_processes() {
  tail -n +2 | grep -vE 'docker-init|sleep infinity|test -f /tmp/workspace-ready' || true
}

stack_has_extra_processes() {
  local container
  container=$(stack_container "$1")
  [ -n "$container" ] && [ -n "$(docker top "$container" -eo pid,args 2>/dev/null | extra_processes)" ]
}

stack_lock_is_held() {
  local probe
  if lock_try probe "$STATE/stacks/$1.use" -x; then
    lock_release "$probe"
    return 1
  fi
  return 0
}

stack_is_busy() {
  stack_lock_is_held "$1" || stack_has_extra_processes "$1"
}

stack_last_activity() {
  local project=$1 recorded started
  recorded=$(last_use "$project")
  if [ "$recorded" -gt 0 ]; then
    echo "$recorded"
    return
  fi
  started=$(docker inspect -f '{{.State.StartedAt}}' "$(stack_container "$project")" 2>/dev/null || true)
  if [ -n "$started" ]; then date -d "$started" +%s; else echo 0; fi
}

# Succeeds when nothing is busy and the last activity is at least the given number of seconds old.
decide_idle() {
  local busy=$1 last=$2 current=$3 seconds=$4
  [ "$busy" = no ] && [ $((current - last)) -ge "$seconds" ]
}

stack_is_idle() {
  local busy=no
  stack_is_busy "$1" && busy=yes
  decide_idle "$busy" "$(stack_last_activity "$1")" "$(now)" "$2"
}

busy_stack_names() {
  local project names=''
  for project in $(running_stacks | cut -d'|' -f1); do
    stack_is_busy "$project" && names="$names $project"
  done
  echo "${names:- none}"
}

# Reads "last project" lines and prints the least recently used project.
pick_least_recently_used() {
  sort -n | head -1 | cut -d' ' -f2-
}

running_other_count() {
  running_stacks | cut -d'|' -f1 | grep -vxc "$PROJECT" || true
}

lru_idle_victim() {
  local project
  for project in $(running_stacks | cut -d'|' -f1); do
    [ "$project" = "$PROJECT" ] && continue
    stack_is_busy "$project" || echo "$(stack_last_activity "$project") $project"
  done | pick_least_recently_used
}
