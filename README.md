# Turbostack

A **monorepo** template for full-stack web applications, powered by [Turborepo](https://turbo.build/repo/docs) and [Bun](https://bun.sh/).

Build modern applications with **Next.js** on the frontend and **Elysia** on the backend, sharing code through a unified workspace structure.

> For details on each app or package, see their respective **README.md** files.

## Technology Stack

| Technology                                    |
| --------------------------------------------- |
| [Bun](https://bun.sh/)                        |
| [Node.js](https://nodejs.org/)                |
| [Turborepo](https://turbo.build/repo)         |
| [Next.js](https://nextjs.org/)                |
| [React](https://react.dev/)                   |
| [Elysia](https://elysiajs.com/)               |
| [PostgreSQL](https://www.postgresql.org/) and [Drizzle](https://orm.drizzle.team/) |
| [Tailwind CSS](https://tailwindcss.com/)      |
| [TypeScript](https://www.typescriptlang.org/) |
| [Biome](https://biomejs.dev/)                 |
| [Playwright](https://playwright.dev/)         |

## Project Structure

This repo is organized into three main sections:

1. **[Configuration](./config/)**: Centralized config for project dependencies:
   - [Biome](./config/biome/) - Shared linting and formatting rules, plus GritQL rule plugins
   - [TypeScript](./config/typescript/) - Shared TypeScript configuration
   - [Tailwind CSS](./config/tailwind/) - Shared styling, design tokens, and motion utilities
   - [Rules](./config/rules/) - The project structure checker behind `bun run check:rules`
   - [Setup](./config/setup/) - Env files, the `doctor` checks, and the `bun run dev` entry point

2. **[Packages](./packages/)**: Shared code and UI components:
   - [@workspace/ui](./packages/ui/) - Our own React components, with no UI library dependencies
   - [@workspace/schemas](./packages/schemas/) - Zod validation, schema-derived contracts, and support error codes
   - [@workspace/utils](./packages/utils/) - Runtime-neutral utilities and canonical HTTP status constants
   - [@workspace/api-client](./packages/api-client/) - Typed API requests built from shared route definitions
   - [@workspace/database](./packages/database/) - Drizzle tables, migrations, and Drizzle Kit commands

3. **[Applications](./apps/)**: Main apps:
   - **[web-client](./apps/client/)**: Next.js 16 + React 19 with Turbopack
   - **[api-server](./apps/server/)**: Elysia + TypeScript backend running on Bun
     - Auto-generated OpenAPI docs with Scalar
     - Type-safe, Zod-validated environment config
     - Least-privilege database roles

## Quick Start

```sh
git clone <repository>
cd <repository>
bun run dev
```

`bun run dev` installs dependencies, writes the env files, starts PostgreSQL in
Docker, creates the database roles, applies the migrations, seeds example
profiles, and starts both apps with hot reloading. The web client runs at
http://localhost:3000 and the API server at http://localhost:3001.

The [documentation index](./docs/README.md) covers the details, including the
[dev container](./docs/devcontainer.md) for machines without Bun.

---

## Quality Checks

`bun run verify` is the single local gate. It runs, in order and stopping at the
first failure: the lockfile check, Biome (lint, formatting, import order, and the
project's GritQL rule plugins), Turborepo boundaries, the project structure rules,
the Compose file check, the migration check against the tables, type checks and
builds, and the Playwright browser tests for the API and Chromium. It prints each
step's time and a summary, and exits non-zero on failure. After a failure, fix the
cause and run `bun run verify --failed`, which repeats the fast checks and builds
and only the browser tests that failed. There is no hosted CI, so run it locally.

The rules in `.agents/rules/` are enforced in two layers. Everything mechanical
fails the build: `config/biome/plugins/` holds the code-pattern rules, and
`config/rules` (`bun run check:rules`) checks naming, placement, file size,
contract documentation, route definitions, comments, and dependencies.

## End-to-End Type Safety

Each API endpoint has one route definition in `@workspace/schemas` that declares
its method, full path, `params`, `query`, `body`, and response schema, using
`null` for inputs it does not consume. The server registers the route from that
definition and Elysia validates its inputs with the same Zod schemas. Clients call
it through `@workspace/api-client`, which derives the input and response types from
the same definition and validates the response at runtime:

```typescript
const result = await sendApiRequest({
  baseUrl: getClientEnvironment().SERVER_URL,
  route: healthReadyRoute,
  params: null,
  query: null,
  body: null,
  init: { cache: "no-store" },
});
```

A wrong path, method, input, or response type fails `check-types`. Every failed
response carries a request ID, and the client maps it to a support code such as
`API-002`, which alerts, toasts, and error pages show beside the ID.

## Reference Feature: User Profiles

User profiles are a complete example of a feature through every layer. Copy
their structure when adding a feature:

| Layer | Where | What it shows |
|---|---|---|
| Database | `packages/database/src/tables/users/profile/` and its migrations | Required columns, a listing index, and a grant migration for the runtime role |
| Contracts | `packages/schemas/src/server/routes/users/profiles/` | Shared schemas and one route definition per operation |
| Server | `apps/server/src/routes/users/profiles/` and `src/services/users/profiles/` | Handlers, database services, and `NOT_FOUND` failures |
| Client | `apps/client/src/app/profiles/` and `src/actions/users/profiles/` | Server Components that read through the api-client, and Server Actions with browser and server validation |
| End to end | `apps/client/src/e2e/users/profiles/` and `src/e2e/api-contracts/` | A browser flow and an API contract test |

The API serves `GET` and `POST /api/v1/users/profiles` (list with `limit` and
`offset`, and create) and `GET` and `PUT /api/v1/users/profiles/:profileId` (read
and replace names). The web client shows them at `/profiles`. Delete or rename the
feature when your project has its own domain.

## Database

Each process connects as its own role: migrations as `app_migrator`, which owns
the schema; the API as `app_runtime`, which holds only the grants that migrations
give it; and manual inspection as the read-only `app_cli`. See the
[database package](./packages/database/README.md) and the
[server database notes](./apps/server/src/db/README.md).

## Tests

Browser tests are the only tests. They live in `apps/client/src/e2e/` as
`<responsibility>.e2e.ts` files. Write one for each behavior that needs
verification, such as user flows, validation and error messages, permissions, and
bug fixes, not for every function. Unit test files (`*.test.ts`) are rejected by
`bun run check:rules`.

The browser tests start from a separate `<DB_NAME>_test` database that the
server's `db:test:prepare` task recreates with the same roles and migrations, so
tests never touch development data.

### End-to-End Tests

Playwright tests in `apps/client/src/e2e/` drive production builds of both apps
in real browsers against the test database. They use ports 3100 and 3101, so they
run beside `bun run dev`.

```sh
bun run test:e2e:install                   # once: Chromium and Firefox
bun run verify                             # every check, then the api and chromium browser tests
bun run test:e2e -- --project=firefox      # other browsers, when needed
bun run --cwd apps/client test:e2e:report  # open the last report
```

Pass Playwright options after `--`, such as `bun run test:e2e -- --project=chromium`.
Failed tests keep a trace, video, and screenshot under `apps/client/test-results/`.
On NixOS the config builds the libraries the browsers need with Nix, and skips
WebKit, whose downloaded build needs older system libraries.

### Package Boundaries

`turbo boundaries` rejects imports of undeclared packages and files outside a
package, plus these tag rules from the root `turbo.json` (tags live in each
package's `turbo.json`):

| Tag | Rule |
|---|---|
| `app` | Nothing may depend on an app |
| `package` | Shared packages may not depend on apps |
| `runtime-neutral` | May depend only on other runtime-neutral packages and configs |
| `server` | May not depend on browser packages such as `@workspace/ui` |
| `config` | May depend only on other config and runtime-neutral packages |

## Production and Deployment

Each deployable app owns a `Dockerfile`, built from the repository root. The API
server image contains bundled files, so no `node_modules` ship. The web client
image contains the Next.js standalone server on Node.js and reads `SERVER_URL` at
runtime, so the same image runs in every environment:

```sh
docker build -f apps/server/Dockerfile -t api-server .
docker build -f apps/client/Dockerfile -t web-client .
```

To run the production containers locally (PostgreSQL, migrations, the API server,
then the web client on port 3000), using the settings in `apps/server/.env` and
`apps/client/.env`, see [run production locally](./docs/run-production-locally.md):

```sh
bun run start:docker
```

When adding a deploy job for the chosen hosting platform, deploy in this order:

1. Once per database, create the least-privilege roles with the provider's admin
   user: `bun db/provision/provision-database.script.js`. Then run migrations
   with the new server image: `bun db/migrate/apply-migrations.script.js`.
   Concurrent runs wait on a PostgreSQL advisory lock, and
   `DB_MIGRATION_LOCK_TIMEOUT_SECONDS` stops a migration that cannot get a table
   lock from blocking traffic.
2. Deploy the API server, then the web client, using the same image tag.
3. Point readiness probes at `GET /health/ready` and liveness probes at
   `GET /health/live`.

Behind a load balancer, set `SHUTDOWN_DRAIN_DELAY_SECONDS` a little longer than its
health-check interval, and keep `HTTP_IDLE_TIMEOUT_SECONDS` above its idle
timeout. Make schema changes backward compatible (add, deploy, then remove in a
later release), because old and new server versions run together during a deploy.

## Dependency Updates

The committed `bun.lock` is the source of truth; `bun run verify` checks it with
`--frozen-lockfile`. List and apply updates with `bun run outdated` and
`bun run update`.

Bun and Turbo are pinned in more than one place: the root `packageManager` field,
the root `turbo` version, and every app `Dockerfile`. Update them together with:

```sh
bun run update:toolchain
```

It reads the latest versions from npm, updates those files and `bun.lock`, and
reminds you to run `bun upgrade` for your local Bun.

---

## UI Components

`@workspace/ui` contains our own components, built on native elements and the
shared design tokens with no UI library dependencies: typography, links, buttons,
fields, layout, feedback, toasts, data display, navigation, dialogs, and motion.
Base components are the only code that applies visual classes; everything else
composes them. Props such as `variant`, `size`, and `type` are required, so every
use states its intent:

```tsx
import { Button } from "@workspace/ui/components/button/button.component";

<Button type="button" variant="primary" size="medium">
  Save
</Button>;
```

See the [UI package](./packages/ui/README.md) and the
[UI and styling rules](./.agents/rules/ui-and-styling.md).

---

## Tailwind CSS

[Tailwind CSS v4](https://tailwindcss.com/docs) is configured with CSS variables
for theming. Configuration is centralized in [config/tailwind/](./config/tailwind/).

The global styles in [globals.css](./config/tailwind/globals.css) provide:

- Neutral light and dark color schemes that follow the system setting
- Color, border, ring, radius, shadow, and motion tokens used by `@workspace/ui`
- Lucide icons through Iconify utility classes

---

## Available Scripts

Run every script from the project root with [Bun](https://bun.sh/):

| Script | What it does |
|---|---|
| `bun run dev` | Set up everything a fresh clone needs, then start both apps with hot reloading |
| `bun run dev:start` / `dev:status` / `dev:stop` | Run the dev stack in the background, check it, or stop it |
| `bun run setup` | Install from the lockfile and write the env files |
| `bun run doctor` | Check the toolchain, workspaces, env files, and ports |
| `bun run db:up` / `db:down` | Start or stop the local PostgreSQL container |
| `bun run db:provision` | Create the database roles with the admin credentials |
| `bun run drizzle:generate` / `drizzle:migrate` | Generate a migration from the tables, or apply migrations |
| `bun run seed:dev` | Add example profiles to an empty development database |
| `bun run check:rules` | Check naming, placement, size, documentation, comments, and dependencies |
| `bun run verify` | Every check, including migration drift, types, builds, and the API and Chromium browser tests, with a summary |
| `bun run verify --failed` | After a failed run: repeat the fast checks and builds, and only the browser tests that failed |
| `bun run test:e2e` | Build both apps and run the Playwright suite |
| `bun run build` / `start` | Build every app, or run the built apps |
| `bun run start:docker` | Build and run the production containers |
| `bun run format` / `lint` | Format and fix, or lint, with Biome |
| `bun run outdated` / `update` | List or interactively apply dependency updates |
| `bun run update:toolchain` | Pin the latest Bun and Turbo everywhere they appear |
| `bun run rename-scope` | Rename the `@workspace` package scope and the container name prefix; set `NEW_SCOPE` and `NEW_CONTAINER_PREFIX` in [the script](./scripts/rename-workspace-scope.script.ts) first |
| `bun run clean` | Remove build output and `node_modules` |

## License

MIT
