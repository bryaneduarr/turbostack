#!/usr/bin/env bash
# shellcheck disable=SC2153
# One workspace image per Dockerfile, start script, and Playwright version, built once under a lock.

SHARED_VOLUMES=(app-bun-cache app-playwright-browsers)

playwright_version() {
  sed -n 's/.*"@playwright\/test": \["@playwright\/test@\([0-9][0-9.]*\)".*/\1/p' "$ROOT/bun.lock" | head -1
}

compute_image_tag() {
  {
    cat "$ROOT/.devcontainer/Dockerfile" "$ROOT/.devcontainer/start-workspace.sh"
    echo "$PLAYWRIGHT_VERSION"
  } | sha256sum | cut -c1-12
}

prepare_image() {
  PLAYWRIGHT_VERSION=$(playwright_version)
  PLAYWRIGHT_VERSION=${PLAYWRIGHT_VERSION:-latest}
  DEVCONTAINER_IMAGE_TAG=$(compute_image_tag)
}

image_exists() {
  docker image inspect "app-workspace:$DEVCONTAINER_IMAGE_TAG" >/dev/null 2>&1
}

ensure_shared_volumes() {
  local volume
  for volume in "${SHARED_VOLUMES[@]}"; do
    docker volume create "$volume" >/dev/null
  done
}

ensure_image() {
  local lock
  [ "${1:-}" = --force ] || ! image_exists || return 0
  wait_for_lock lock "$STATE/image.lock" -x "the image build lock"
  if [ "${1:-}" = --force ] || ! image_exists; then
    echo "dc: building the workspace image app-workspace:$DEVCONTAINER_IMAGE_TAG (shared by every stack)." >&2
    docker build -t "app-workspace:$DEVCONTAINER_IMAGE_TAG" --build-arg "PLAYWRIGHT_VERSION=$PLAYWRIGHT_VERSION" "$ROOT/.devcontainer" >&2
  fi
  lock_release "$lock"
}

# Lists tags of the workspace image that this work tree does not use; docker refuses to remove any a container uses.
older_image_tags() {
  docker images app-workspace --format '{{.Tag}}' | grep -vxE "local|$DEVCONTAINER_IMAGE_TAG" || true
}

prune_images() {
  local tag
  for tag in $(older_image_tags); do
    if [ "${1:-}" = --dry-run ]; then
      echo "would remove image app-workspace:$tag"
    else
      docker rmi "app-workspace:$tag" >/dev/null 2>&1 && echo "removed image app-workspace:$tag"
    fi
  done
}
