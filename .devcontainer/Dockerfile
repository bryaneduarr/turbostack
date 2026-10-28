# syntax=docker/dockerfile:1

FROM node:24-bookworm-slim AS node

FROM oven/bun:1.4.0
ARG PLAYWRIGHT_VERSION=latest
COPY --from=node /usr/local/bin/node /usr/local/bin/node
RUN apt-get update \
  && apt-get install -y --no-install-recommends git curl ca-certificates lsof procps util-linux \
  && bunx playwright@${PLAYWRIGHT_VERSION} install-deps chromium firefox \
  && rm -rf /var/lib/apt/lists/* \
  && git config --system safe.directory /workspace \
  && mkdir -p /home/dev/.bun-cache /home/dev/.playwright-browsers /home/dev/.turbo-cache \
  && chmod 1777 /home/dev /home/dev/.bun-cache /home/dev/.playwright-browsers /home/dev/.turbo-cache
ENV HOME=/home/dev \
  BUN_INSTALL_CACHE_DIR=/home/dev/.bun-cache \
  PLAYWRIGHT_BROWSERS_PATH=/home/dev/.playwright-browsers
WORKDIR /workspace
