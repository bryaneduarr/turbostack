# syntax=docker/dockerfile:1

FROM node:24-bookworm-slim AS node

FROM oven/bun:1.4.0
COPY --from=node /usr/local/bin/node /usr/local/bin/node
RUN apt-get update \
  && apt-get install -y --no-install-recommends git curl ca-certificates lsof procps \
  && rm -rf /var/lib/apt/lists/* \
  && git config --system safe.directory /workspace \
  && mkdir -p /home/dev/.bun-cache \
  && chmod 1777 /home/dev /home/dev/.bun-cache
ENV HOME=/home/dev \
  BUN_INSTALL_CACHE_DIR=/home/dev/.bun-cache
WORKDIR /workspace
