#!/usr/bin/env bash
# shellcheck disable=SC2153
# Starting a stack, and running one command in it under the use, heavy, and stack locks.

start_stack() {
  local lock waited=0
  is_ready && return 0
  wait_for_lock lock "$STATE/start.lock" -x "the stack start lock"
  if is_ready; then
    lock_release "$lock"
    return 0
  fi
  make_room
  ensure_shared_volumes
  ensure_image
  pick_ports
  compose up -d
  lock_release "$lock"
  echo "Waiting for the workspace to install dependencies and create the env files..." >&2
  until is_ready; do
    if [ -z "$(compose ps --status running --services workspace)" ] || [ "$waited" -ge 900 ]; then
      compose logs --no-color --tail 40 workspace >&2
      echo "The workspace did not become ready." >&2
      exit 1
    fi
    sleep 2
    waited=$((waited + 2))
  done
  print_urls >&2
}

# Kills the command's process group inside the container, escalating from TERM to KILL after three seconds.
kill_remote_command() {
  # shellcheck disable=SC2016
  compose exec -T workspace sh -c '
    for _ in 1 2 3 4 5 6; do [ -s "/tmp/dc-$1.pid" ] && break; sleep 0.5; done
    pid=$(cat "/tmp/dc-$1.pid" 2>/dev/null) || exit 0
    kill -TERM "-$pid" 2>/dev/null || exit 0
    for _ in 1 2 3 4 5 6; do kill -0 "-$pid" 2>/dev/null || exit 0; sleep 0.5; done
    kill -KILL "-$pid" 2>/dev/null
    rm -f "/tmp/dc-$1.pid"
  ' sh "$1" </dev/null >/dev/null 2>&1 || true
}

run_interactive() {
  compose exec -w "$1" workspace "${@:2}"
}

# Runs the command in its own process group so a signal to this script ends it inside the container too.
run_grouped() {
  local directory=$1 id="$$-$RANDOM" child status=0 signalled=0
  shift
  # shellcheck disable=SC2016
  compose exec -T -w "$directory" workspace setsid -w sh -c '
    id=$1
    shift
    echo $$ >"/tmp/dc-$id.pid"
    exec "$@"
  ' sh "$id" "$@" <&0 &
  child=$!
  # shellcheck disable=SC2329
  stop_on_signal() {
    signalled=1
    kill_remote_command "$id"
    kill "$child" 2>/dev/null || true
  }
  trap stop_on_signal INT TERM HUP
  wait "$child" || status=$?
  if [ "$signalled" = 1 ]; then
    wait "$child" 2>/dev/null || true
    status=143
  fi
  trap - INT TERM HUP
  return "$status"
}

# shellcheck disable=SC2034
run_command() {
  # The use and stack lock descriptors stay open until this script exits.
  local use stack_lock classes status=0 directory
  wait_for_lock use "$STATE/stacks/$PROJECT.use" -s "the use lock of $PROJECT"
  touch_last_use "$PROJECT"
  reap_idle
  start_stack
  classes=$(command_classes "$@")
  if [[ "$classes" == *heavy* ]]; then
    wait_for "a free heavy-command slot" take_heavy_slot
  fi
  if [[ "$classes" == *stack* ]]; then
    wait_for_lock stack_lock "$STATE/stacks/$PROJECT.stack" -x "the database lock of $PROJECT"
  fi
  directory=$(container_directory)
  if [ -t 0 ]; then
    run_interactive "$directory" "$@" || status=$?
  else
    run_grouped "$directory" "$@" || status=$?
  fi
  touch_last_use "$PROJECT"
  return "$status"
}

# Takes the first free heavy slot; the descriptor stays open for the life of this script.
take_heavy_slot() {
  local slot
  for slot in $(seq 1 "$(setting HEAVY_SLOTS 1)"); do
    lock_try HEAVY_LOCK "$STATE/heavy.$slot" -x && return 0
  done
  return 1
}
