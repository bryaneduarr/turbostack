# Veyra template port

## Request

> "Take all the concepts that I've gathered in that project [`~/veyra`], not the actual code of sign in a user or things like that, but processes: the Docker image, how it is composed, how it has a database. Skip the local bucket. I want the skills in here, the configuration that we have done... make a better template of what we have gathered. The files will be replaced, instructions, and everything so it aligns with the other project."

- Date: 2026-10-26 (UTC). Turbostack revision `31c5212` (clean tree). Veyra source revision `f089c77e`.
- Planned with veyra's `workflow/thinking-distill` skill.

## Goal

Make turbostack a clean, product-free template that carries what veyra taught: agent instructions and skills, rule enforcement, one-command setup, devcontainer, Docker, a least-privilege database package, e2e testing, docs, and generic runtime infrastructure. Veyra's product features (authentication, organizations, restrictions, appeals, tickets, avatars, inbox, admin console) are excluded. Turbostack's current instructions and config are replaced, not merged, so both projects follow the same conventions. Turbostack differs from the request in one way: it also drops email and GitHub CI, by user choice.

## Done when

- `grep -rni veyra` over Git-tracked files, excluding `.agents/plans/template-port/`, returns nothing.
- From a fresh clone with only Git, Bun, and Docker: `bun run dev` installs, writes env files, provisions Postgres roles, migrates, seeds, and serves client and server.
- `bun run verify`, `bun run check`, `bun run check:rules`, and `bun run test:e2e` (api + chromium) pass locally.
- The devcontainer builds, and `scripts/dc` plus `scripts/dc-smoke-test` work.
- No Mailpit, RustFS, email package, worker, `SMTP_*`, `EMAIL_*`, `WORKER_*`, `MAILPIT_*`, or `S3_*` references remain.
- `.github/` is gone. Skills `grilling`, `domain-modeling`, `grill-with-docs`, `retro`, `context-review`, and `finish-feature` are gone.
- `AGENTS.md`, the rules, `start-here.md`, and `capabilities.md` describe only this template.

## Decisions

1. **Skip Mailpit and RustFS completely.** Rejected: keep Mailpit with email; keep Mailpit without the outbox.
2. **Example app code:** `apps/client` + `apps/server`, health plus one example feature. Rejected: health only; also an empty `admin` app.
3. **Instructions:** replace turbostack's `AGENTS.md`, rules, and skills with veyra's, rewritten to fit this project with no veyra-specific rules. Remove `grilling`, `domain-modeling`, `retro`, `context-review` (and `grill-with-docs`, `finish-feature`, which veyra also dropped). Rejected: keep turbostack-only skills.
4. **Enforcement:** port the 9 Grit plugins and the `config/rules` checker, removing veyra-specific checks. Rejected: plugins only; neither.
5. **Setup:** port the devcontainer, `scripts/dc`, `config/setup` (env, session keys, doctor), and one-command `bun run dev`. Rejected: devcontainer only; setup only.
6. **Email removed entirely:** `packages/emails`, outbox, worker, `dev:worker`, and their env. Rejected: keep an empty worker example.
7. **Database ported as veyra has it** for reliability: separate `packages/database`, migrator/runtime/CLI roles, grants, initdb provisioning, seeds, drift check. The worker role goes with the worker. Rejected: one database user; drizzle inside `apps/server`.
8. **Example feature:** rebuild turbostack's existing `user-profiles` under the new rules. Rejected: new `notes` CRUD; no feature.
9. **E2E:** Playwright with `api` + `chromium`, plus the `testing/verify-e2e` skill. Firefox/WebKit projects stay defined but optional (no CI runs them now). Rejected: all browsers locally; no e2e.
10. **UI:** port `ui-and-styling.md` with neutral design tokens, not veyra's look. Rejected: copy veyra's look; skip the rule.
11. **Naming:** neutral names (`app_migrator`, `app_runtime`, `app_cli`, `DEVCONTAINER`, `@workspace/*`), keeping `rename-scope`. Rejected: `turbostack_*` everywhere.
12. **Docs:** port `docs/` minus product pages (`seeded-accounts.md`, `first-production-owner.md`). **No GitHub CI for this project.** Rejected: CI only with the long README.
13. **Plans and context:** port `workflow/deliver-plan` and the `.agents/plans/` conventions; restart `project-context` with a fresh `start-here.md` and `capabilities.md` for this template. Rejected: empty context folder.
14. **Generic runtime pieces, all of them:** support error codes and request IDs, `api-client` results, logger factory, security headers, same-origin redirects, `dev-stack` and `verify` scripts. Rejected: a subset; none.
15. **Delivery:** one stack of PRs in 5 steps (below). Rejected: one big PR; commit to `main`.
- **A (confirmed 2026-10-26):** delete all of `.github/` (`ci.yml`, `release-images.yml`, `dependabot.yml`).
- **B (confirmed 2026-10-26):** drop `scripts/merge-stack.script.ts`, since it waits on GitHub checks.
- **Push and PRs (confirmed 2026-10-26):** push each step and open its stacked PR.
- **During delivery:** `config/setup`, `doctor`, and `verify` moved from step 2 to step 3 because they need the database roles; session-key generation was dropped because the template has no sign-in; `app_cli` stays as a read-only operator role; `seed:dev` adds two example profiles.

## Scope

- **In:** everything in Decisions.
- **Out:** veyra product features, admin app, Mailpit, RustFS and object storage, email, worker, GitHub CI, avatar utilities, Codespaces-specific docs if they require GitHub CI features.
- **Later:** none requested.
- **Skipped:** turbostack-only skills listed in decision 3.

## Risks

- **Veyra names leak in** (`veyra_*` roles, `VEYRA_*` env, `veyra-devcontainer`). Fix: `grep -rni veyra` must be empty before each PR.
- **Rules checker exceptions reference veyra paths.** Fix: rebuild `config/rules/src/config/exceptions/` from nothing, adding only reviewed template exceptions.
- **No CI, so regressions slip through.** Fix: rules and `AGENTS.md` require `bun run verify` and `bun run check` before every merge.
- **Removed email/storage leaves dangling env, schemas, doctor checks, or turbo pass-through.** Fix: grep for `SMTP_|EMAIL_|WORKER_|MAILPIT|S3_|rustfs|storage` in each step.
- **Example feature breaks the 200-line / 10-files-per-folder limits.** Fix: run `check:rules` in step 4.
- **Veyra's `.gitignore` ignores `migrations/*` yet commits migrations.** Fix: check how veyra tracks them in step 3 and make the template explicit.

## Steps

Each step is one PR stacked on the previous one; each ends with `grep -rni veyra` empty and the listed checks.

1. **Instructions and skills.** Replace `AGENTS.md` (keep the `CLAUDE.md` symlink), `.agents/rules/*` (5 files, from `~/veyra/.agents/rules/`), `.agents/methods/verification-and-tools.md`. Move skills into `coding/`, `github/` (`commit-changes`, `pr`), `testing/` (`verify-e2e`, `agent-browser`, `use-browser`), `workflow/` (`project-context`, `thinking-distill`, `deliver-plan`, `run-in-container`). Delete the skipped skills. Replace `.claude/skills` with per-skill symlinks, add `.claude/settings.json`, update `skills-lock.json`. Rewrite `.agents/project-context/` (`start-here.md`, `capabilities.md`, topic notes for this template only); remove `review-checkpoint.md` and `tasks/production-foundation/`. Strip veyra product references from rules (e.g. organization, ticket, avatar examples). Verify: Markdown links resolve, symlinks resolve, grep clean.
2. **Config, rules checker, setup.** Port `config/biome` (plugins in `~/veyra/config/biome/plugins/`), `config/rules`, `config/setup` (without storage/email doctor checks), `config/tailwind` with neutral tokens, `config/typescript` updates. Port root scripts `dev-stack`, `verify-workspace`; update root `package.json` scripts and `turbo.json` (no `SMTP_*`, `EMAIL_*`, `WORKER_*`, `MAILPIT_*`, `S3_*`, worker task). Root dependencies stay limited to `@workspace/biome`, `@workspace/typescript`, `turbo`. Verify: `biome ci .`, `bun run check:rules`, `turbo boundaries`.
3. **Docker, database, devcontainer.** `docker-compose.yml` with Postgres only plus production profiles; app Dockerfiles; `.dockerignore`. Create `packages/database` from `~/veyra/packages/database` (tables, columns, config, migrations regenerated for the template) and move provisioning from `~/veyra/apps/server/src/db/provision/` with neutral role names and no worker role. Port `.devcontainer/*`, `scripts/dc`, `scripts/dc-smoke-test`. Verify: `bun run check:compose`, `bun run db:up`, `bun run db:provision`, drift check, `scripts/dc-smoke-test`.
4. **Apps and example feature.** Port generic runtime pieces into `apps/server`, `apps/client`, `packages/schemas`, `packages/api-client`, `packages/ui`, `packages/utils` (error codes, request IDs, results, logger, security headers, redirects, env schemas). Rebuild `user-profiles` following veyra's feature slice (table, migration and grant, route definition, contract, handler, service, client page, e2e). Add Playwright (`apps/client/playwright.config.ts`, `tsconfig.test.json`, `apps/server/bunfig.toml`). Verify: `bun run check-types`, `bun run test`, `bun run test:e2e`, `bun run check:rules`.
5. **Docs and CI removal.** Port `docs/` (get-started, requirements, run-the-app, run-tests, run-production-locally, devcontainer, codespaces, troubleshooting, README index); rewrite root `README.md`. Delete `.github/` (decision A). Update `capabilities.md` and `start-here.md` to the final state. Verify: fresh clone, then `bun run dev` from nothing; `bun run verify`; all Done-when checks.
