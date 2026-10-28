#!/usr/bin/env bash
# State directory, settings, clocks, and file locks shared by every stack of every project; the v1 folder keeps incompatible versions apart.

setting() {
  local variable="DC_$1"
  printf '%s\n' "${!variable:-$2}"
}

to_seconds() {
  awk -v minutes="$1" 'BEGIN { printf "%d\n", minutes * 60 }'
}

now() {
  date +%s
}

state_init() {
  STATE=${DC_STATE_DIR:-${XDG_STATE_HOME:-$HOME/.local/state}/dc/v1}
  mkdir -p "$STATE/stacks"
}

touch_last_use() {
  now >"$STATE/stacks/$1.last"
}

last_use() {
  cat "$STATE/stacks/$1.last" 2>/dev/null || echo 0
}

# Opens a lock file on a new descriptor and stores the descriptor in the named variable.
lock_try() {
  local variable=$1 file=$2 mode=$3 descriptor
  exec {descriptor}>>"$file"
  if flock "$mode" -n "$descriptor"; then
    printf -v "$variable" %s "$descriptor"
    return 0
  fi
  exec {descriptor}>&-
  return 1
}

lock_release() {
  local descriptor=$1
  exec {descriptor}>&-
}

# Runs the command until it succeeds. Prints progress every minute and exits 75 after the wait limit.
wait_for() {
  local what=$1
  shift
  local deadline next
  deadline=$(($(now) + $(to_seconds "$(setting WAIT_MINUTES 45)")))
  next=$(($(now) + 60))
  until "$@"; do
    if [ "$(now)" -ge "$deadline" ]; then
      echo "dc: gave up waiting for $what after $(setting WAIT_MINUTES 45) minutes. Busy stacks: $(busy_stack_names)" >&2
      exit 75
    fi
    if [ "$(now)" -ge "$next" ]; then
      echo "dc: still waiting for $what. Busy stacks: $(busy_stack_names)" >&2
      next=$((next + 60))
    fi
    sleep 1
  done
}

wait_for_lock() {
  local variable=$1 file=$2 mode=$3 what=$4
  wait_for "$what" lock_try "$variable" "$file" "$mode"
}
