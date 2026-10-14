# Production-foundation handoff

Evidence: 2026-10-14; branch `feat/production-foundation` at `dd078d8` plus uncommitted changes listed in `git status`.

- Objective: deploy-ready template; user-confirmed scope excludes auth, rate limiting, security headers, OpenTelemetry, generators, and cloud deploy jobs.
- Owner: coordinating agent. Status: implemented, uncommitted, awaiting user review.
- Done: route definitions, own UI library, Bun tests, client Docker image, migration lock/checks, draining, toolchain command, rule updates.
- Checks: Biome, boundaries, types, tests, builds, local and Compose runs, scratch type-misuse checks passed; GitHub workflows not run remotely.
- Next: user review, then commit/PR only when asked.
