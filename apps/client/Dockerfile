# syntax=docker/dockerfile:1

ARG BUN_VERSION=1.4.4
ARG NODE_VERSION=24
# Updated with the root package.json by `bun run update:toolchain`.
ARG TURBO_VERSION=2.11.10

FROM oven/bun:${BUN_VERSION} AS prune
ARG TURBO_VERSION
WORKDIR /repo
COPY . .
RUN bunx turbo@${TURBO_VERSION} prune web-client --docker

FROM node:${NODE_VERSION}-slim AS node

FROM oven/bun:${BUN_VERSION} AS build
# Next.js builds with Node.js; Bun only installs dependencies.
COPY --from=node /usr/local/bin/node /usr/local/bin/node
WORKDIR /repo
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=prune /repo/out/json/ .
RUN bun install --frozen-lockfile --ignore-scripts
COPY --from=prune /repo/out/full/ .
RUN bun run --cwd apps/client build

FROM node:${NODE_VERSION}-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME=0.0.0.0
ENV PORT=3000
COPY --from=build --chown=node:node /repo/apps/client/.next/standalone ./
USER node
EXPOSE 3000
CMD ["node", "apps/client/server.js"]
