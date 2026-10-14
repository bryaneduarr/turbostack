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
| [Elysia](https://elysiajs.com/)                  |
| [Tailwind CSS](https://tailwindcss.com/)      |
| [TypeScript](https://www.typescriptlang.org/) |
| [Biome](https://biomejs.dev/)                 |

## Project Structure

This repo is organized into three main sections:

1. **[Configuration](./config/)**: Centralized config for project dependencies:
   - [Biome](./config/biome/) - Shared linting and formatting rules
   - [TypeScript](./config/typescript/) - Shared TypeScript configuration
   - [Tailwind CSS](./config/tailwind/) - Shared styling and theme

2. **[Packages](./packages/)**: Shared code and UI components:
   - [@workspace/ui](./packages/ui/) - Our own React components, with no UI library dependencies
   - [@workspace/schemas](./packages/schemas/) - Zod validation and schema-derived contracts
   - [@workspace/utils](./packages/utils/) - Runtime-neutral utilities and canonical HTTP status constants
   - [@workspace/api-client](./packages/api-client/) - Typed API requests built from shared route definitions

3. **[Applications](./apps/)**: Main apps:
   - **[web-client](./apps/client/)**: Next.js 16 + React 19 with Turbopack
   - **[api-server](./apps/server/)**: Elysia + TypeScript backend running on Bun
     - Fast, modern API server
     - Auto-generated OpenAPI docs with Scalar
     - Type-safe, Zod-validated environment config

## Setup Instructions

### Prerequisites

- [Node.js](https://nodejs.org/) v22.9 or newer (used by the Next.js client)
- [Bun](https://bun.sh/) v1.4.0 or newer; CI uses the exact version in the root `packageManager` field
- [Docker](https://docs.docker.com/get-docker/) for the local PostgreSQL database and production images

#### Install Bun

- **Windows** (via PowerShell):

  ```powershell
  powershell -c "irm bun.sh/install.ps1 | iex"
  ```

- **Linux/macOS**:

  ```sh
  curl -fsSL https://bun.sh/install | bash
  ```

- **Using npm** (alternative):

  ```sh
  npm install -g bun
  ```

#### Clone and Install

1. Clone the repository:

   ```sh
   git clone https://github.com/bryaneduarr/turbostack.git
   cd turbostack
   ```

2. Install dependencies:

   ```sh
   bun install
   ```

#### Environment Setup

1. Copy the example env files. Docker Compose reads the server's `DB_*` values, so
   the local database is created with the credentials and port the server uses.
   The client's `SERVER_URL` points at the API server:

   ```sh
   cp apps/server/.env.example apps/server/.env
   cp apps/client/.env.example apps/client/.env
   ```

#### First-Time Setup

Installs dependencies from the lockfile, then applies the committed migrations;
Turborepo starts PostgreSQL in Docker first:

```sh
bun run setup
```

If port 5432 is already used by another PostgreSQL, change `DB_PORT` in
`apps/server/.env` (for example to `55432`); the container and the server both use it.

#### Start Development

```sh
bun run dev
```

Turborepo starts PostgreSQL first, then the API server and the web client with hot
reloading, and shows every task's logs.

#### Run the Production Build Locally

```sh
bun run start
```

Builds every app, starts PostgreSQL, then runs the bundled API server with
`NODE_ENV=production` and the Next.js production server.

---

## Quality Checks and CI

`bun run check` runs the same checks as CI: Biome (lint, formatting, and import
order), Turborepo boundaries, type checks, tests, and builds. CI also checks that
committed migrations match the Drizzle tables.

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

A wrong path, method, input, or response type fails `check-types`. The home page
of the web client calls `/health/ready` this way from a Server Component.

## Reference Feature: User Profiles

User profiles are a complete example of a feature through every layer. Copy
their structure when adding a feature:

| Layer | Where | What it shows |
|---|---|---|
| Database | `apps/server/src/db/tables/users/profile/` and migration `0001` | Required columns, an index for listing, a generated migration |
| Contracts | `packages/schemas/src/server/routes/users/profiles/` | Shared schemas and one route definition per operation, using `params`, `query`, and `body` |
| Server | `apps/server/src/routes/users/profiles/` and `src/services/users/profiles/` | Contracts, handlers, database services, `NOT_FOUND` failures, and a database-backed workflow test |
| Client | `apps/client/src/app/profiles/` and `src/actions/users/profiles/` | Server Components that read through the api-client, and Server Actions that validate form data before calling the API |
| UI | `packages/ui/src/components/text-field/` | A labeled input that shows validation messages |

The API serves `GET` and `POST /api/v1/users/profiles` (list with `limit` and
`offset`, and create) and `GET` and `PUT /api/v1/users/profiles/:profileId` (read
and replace names). The web client shows them at `/profiles`. Its forms work
without JavaScript, keep what was typed when validation fails, and refresh only
the affected pages after a change. Delete or rename the feature when your project
has its own domain.

## Tests

Tests use Bun's built-in runner (`bun:test`) and live next to the code as
`<responsibility>.test.ts`. Server route tests send requests through
`app.handle(new Request(...))`, so no port is opened. Write tests for workflows
and logic that need verification, not for every function.

The server's `test` task starts PostgreSQL with Docker and applies migrations
first, so `bun run test` and CI run database-backed tests the same way. Tests
remove the rows they create.

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
| `config` | May depend only on other config packages |

[`.github/workflows/ci.yml`](./.github/workflows/ci.yml) runs on pull requests and
pushes to `main`. Biome checks the whole repository; type checks, tests, and builds
run only for packages affected by the change (`turbo --affected`), including
packages that depend on a changed workspace package. Set the optional `TURBO_TOKEN`
secret and `TURBO_TEAM` variable to share Turborepo's remote cache with CI.

## Production and Deployment

Each deployable app owns a `Dockerfile`, built from the repository root. The API
server image contains one bundled file, so no `node_modules` ship. The web client
image contains the Next.js standalone server on Node.js and reads `SERVER_URL` at
runtime, so the same image runs in every environment:

```sh
docker build -f apps/server/Dockerfile -t api-server .
docker build -f apps/client/Dockerfile -t web-client .
```

To run the production containers locally (PostgreSQL, migrations, the API server,
then the web client on port 3000), using the settings in `apps/server/.env`:

```sh
bun run start:docker
```

Images are named after their package: `ghcr.io/<owner>/<repository>/api-server`.

[`.github/workflows/release-images.yml`](./.github/workflows/release-images.yml)
runs after CI passes on `main`. It builds every app that has a `Dockerfile` and
publishes it to GitHub Container Registry tagged `sha-<commit>` and `latest`.
Building every app means a failed release never leaves an app without a later
change; Docker layer caching keeps unchanged apps fast.

When adding a deploy job for the chosen hosting platform, deploy in this order:

1. Run migrations with the new server image:
   `bun db/migrate/apply-migrations.script.js`. Concurrent runs wait on a
   PostgreSQL advisory lock, and `DB_MIGRATION_LOCK_TIMEOUT_SECONDS` stops a
   migration that cannot get a table lock from blocking traffic.
2. Deploy the API server, then the web client, using the same `sha-<commit>` tag.
3. Point readiness probes at `GET /health/ready` and liveness probes at
   `GET /health/live`.

Behind a load balancer, set `SHUTDOWN_DRAIN_DELAY_SECONDS` a little longer than its
health-check interval, and keep `HTTP_IDLE_TIMEOUT_SECONDS` above its idle
timeout. Make schema changes backward compatible (add, deploy, then remove in a
later release), because old and new server versions run together during a deploy.

## Dependency Updates

The committed `bun.lock` is the source of truth; CI installs with
`--frozen-lockfile`. [Dependabot](./.github/dependabot.yml) opens weekly pull
requests: grouped minor and patch updates, separate major updates, and GitHub
Actions and Docker Compose image updates.

Bun and Turbo are pinned in more than one place: the root `packageManager` field,
the root `turbo` version, and every app `Dockerfile`. Update them together with:

```sh
bun run update:toolchain
```

It reads the latest versions from npm, updates those files and `bun.lock`, and
reminds you to run `bun upgrade` for your local Bun. Dependabot ignores `turbo`
so the two never disagree.

---

## UI Components

`@workspace/ui` contains our own components, built on native elements and Tailwind
classes with no UI library dependencies. Each component lives in
`packages/ui/src/components/<component>/<component>.component.tsx`, and its props
interface in `packages/ui/src/types/components/<component>/`. Props such as
`variant`, `size`, and `type` are required, so every use states its intent:

```tsx
import { Button } from "@workspace/ui/components/button/button.component";

<Button type="button" variant="primary" size="medium">
  Save
</Button>;
```

Variants: `primary`, `secondary`, `outline`, `ghost`, `destructive`. Sizes:
`small`, `medium`, `large`.

---

## Tailwind CSS

[Tailwind CSS v4](https://tailwindcss.com/docs/v4-beta) is configured with CSS variables for theming. Configuration is centralized in [config/tailwind/](./config/tailwind/).

The global styles in [globals.css](./config/tailwind/globals.css) provide:

- Light and dark mode color schemes
- Color, border, ring, and radius tokens used by `@workspace/ui`

---

## Available Scripts

All scripts are run from the project root using [Bun](https://bun.sh/) and [Turborepo](https://turbo.build/repo/docs). These commands work across all apps and packages:

- **bun install**: Install all dependencies for the monorepo.

  ```sh
  bun install
  ```

- **bun run build**: Build all apps and packages (Next.js client, Elysia server, shared packages).

  ```sh
  bun run build
  ```

- **bun run clean**: Remove build files and node_modules for a fresh start.

  ```sh
  bun run clean
  ```

- **bun run check-types**: Type-check all TypeScript codebases.

  ```sh
  bun run check-types
  ```

- **bun run dev**: Start PostgreSQL, then every app with hot reloading.

  ```sh
  bun run dev
  ```

- **bun run check**: Run Biome CI checks, type checks, tests, and builds, as CI does.

  ```sh
  bun run check
  ```

- **bun run test**: Run Bun tests in every package that defines them.

  ```sh
  bun run test
  ```

- **bun run db:up** / **bun run db:down**: Start or stop the local PostgreSQL container.

  ```sh
  bun run db:up
  ```

- **bun run format**: Format code, apply safe lint fixes, and organize imports using Biome.

  ```sh
  bun run format
  ```

- **bun run lint**: Lint all code using Biome.

  ```sh
  bun run lint
  ```

- **bun run outdated**: List outdated dependencies in every workspace.

  ```sh
  bun run outdated
  ```

- **bun run update**: Choose dependency updates interactively in every workspace; the lockfile is kept.

  ```sh
  bun run update
  ```

- **bun run update:toolchain**: Pin the latest Bun and Turbo in `package.json`, every app `Dockerfile`, and `bun.lock`.

  ```sh
  bun run update:toolchain
  ```

- **bun run setup**: Install from the lockfile, start PostgreSQL, and apply migrations (first-time setup).

  ```sh
  bun run setup
  ```

- **bun run start**: Build every app, start PostgreSQL, and run the production servers.

  ```sh
  bun run start
  ```

- **bun run start:docker**: Build and run the production API server containers with PostgreSQL and migrations.

  ```sh
  bun run start:docker
  ```

- **bun run rename-scope**: Rename the internal package scope in every tracked file, reinstall, and
  reformat. Set `NEW_SCOPE` in
  [`scripts/rename-workspace-scope.script.ts`](./scripts/rename-workspace-scope.script.ts) first.

  ```sh
  bun run rename-scope
  ```

---

## License

MIT
