#!/usr/bin/env bash
# shellcheck disable=SC2153
# Host ports for one stack: kept when its containers exist, otherwise the first free port from the wanted one.

is_listening() {
  (exec 3<>"/dev/tcp/127.0.0.1/$1") 2>/dev/null
}

published_port() {
  compose port "$1" "$2" 2>/dev/null | sed 's/.*://' || true
}

chosen_ports=" "

pick_port() {
  local variable=$1 service=$2 container_port=$3 wanted=$4 port
  port=$(published_port "$service" "$container_port")
  if [ -z "$port" ]; then
    port=${!variable:-$wanted}
    while is_listening "$port" || [[ "$chosen_ports" == *" $port "* ]]; do
      port=$((port + 1))
    done
  fi
  chosen_ports="$chosen_ports$port "
  printf -v "$variable" %s "$port"
  export "${variable?}"
}

pick_ports() {
  chosen_ports=" "
  pick_port DEVCONTAINER_CLIENT_PORT workspace 3000 3000
  pick_port DEVCONTAINER_API_PORT workspace 3001 3001
}

print_urls() {
  local client
  client=$(published_port workspace 3000)
  if [ -z "$client" ]; then
    echo "The stack is not running." >&2
    return 1
  fi
  echo "client http://localhost:$client"
  echo "api http://localhost:$(published_port workspace 3001)"
}
