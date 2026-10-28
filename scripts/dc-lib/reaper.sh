#!/usr/bin/env bash
# shellcheck disable=SC2153
# Stops idle stacks, makes room under the stack cap, and prunes stacks whose work tree is gone.

remove_stack_containers() {
  local project=$1
  docker ps -aq --filter "label=com.docker.compose.project=$project" | xargs -r docker rm -f >/dev/null
  docker network ls -q --filter "label=com.docker.compose.project=$project" | xargs -r docker network rm >/dev/null 2>&1 || true
}

# Stops a stack only when no command holds or waits on its use lock; keeps all data.
stop_if_unused() {
  local project=$1 lock
  lock_try lock "$STATE/stacks/$project.use" -x || return 1
  if stack_has_extra_processes "$project" && [ "${2:-}" != --force ]; then
    lock_release "$lock"
    return 1
  fi
  remove_stack_containers "$project"
  lock_release "$lock"
}

reaper_is_due() {
  local stamp="$STATE/reaper.stamp" age
  age=$(($(now) - $(stat -c %Y "$stamp" 2>/dev/null || echo 0)))
  [ "$age" -ge 60 ] || return 1
  touch "$stamp"
}

reap_idle() {
  [ "${1:-}" = --force ] || reaper_is_due || return 0
  local seconds project
  seconds=$(to_seconds "$(setting IDLE_MINUTES 15)")
  for project in $(running_stacks | cut -d'|' -f1); do
    [ "$project" = "$PROJECT" ] && continue
    if stack_is_idle "$project" "$seconds" && stop_if_unused "$project"; then
      echo "dc: stopped idle stack $project." >&2
    fi
  done
}

make_room_step() {
  local victim
  while [ "$(running_other_count)" -ge "$(setting MAX_STACKS 2)" ]; do
    victim=$(lru_idle_victim)
    [ -n "$victim" ] || return 1
    stop_if_unused "$victim" || return 1
    echo "dc: stopped idle stack $victim to stay within $(setting MAX_STACKS 2) running stacks." >&2
  done
}

make_room() {
  wait_for "a free stack slot" make_room_step
}

# Succeeds for a stack whose work tree folder is gone and which has been unused for the prune age.
should_prune() {
  local project=$1 root=$2 last=$3 current=$4
  [ "$project" != "$PRIMARY_PROJECT" ] && [ -n "$root" ] && [ ! -d "$root" ] &&
    [ $((current - last)) -ge $(($(setting PRUNE_DAYS 7) * 86400)) ]
}

remove_stack_data() {
  local project=$1
  remove_stack_containers "$project"
  docker volume ls -q --filter "label=com.docker.compose.project=$project" | xargs -r docker volume rm >/dev/null
  rm -f "$STATE/stacks/$project".*
}

prune_stacks() {
  local dry=${1:-} project root last lock
  for project in $(all_projects); do
    root=$(stack_root "$project")
    last=$(stack_last_activity "$project")
    should_prune "$project" "$root" "$last" "$(now)" || continue
    if [ "$dry" = --dry-run ]; then
      echo "would remove stack $project (work tree $root is gone)"
    elif lock_try lock "$STATE/stacks/$project.use" -x; then
      remove_stack_data "$project"
      lock_release "$lock"
      echo "removed stack $project (work tree $root is gone)"
    fi
  done
  prune_images "$dry"
}
