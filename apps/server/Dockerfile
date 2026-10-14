# syntax=docker/dockerfile:1

ARG BUN_VERSION=1.4.0
# Updated with the root package.json by `bun run update:toolchain`.
ARG TURBO_VERSION=2.11.8

FROM oven/bun:${BUN_VERSION} AS prune
ARG TURBO_VERSION
WORKDIR /repo
COPY . .
RUN bunx turbo@${TURBO_VERSION} prune api-server --docker

FROM oven/bun:${BUN_VERSION} AS build
WORKDIR /repo
COPY --from=prune /repo/out/json/ .
RUN bun install --frozen-lockfile --ignore-scripts
COPY --from=prune /repo/out/full/ .
RUN bun run --cwd apps/server build

FROM oven/bun:${BUN_VERSION}-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3001
COPY --from=build --chown=bun:bun /repo/apps/server/dist ./
USER bun
EXPOSE 3001
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD ["bun", "-e", "const r = await fetch(`http://127.0.0.1:${process.env.PORT}/health/live`); process.exit(r.ok ? 0 : 1)"]
CMD ["bun", "index.js"]
