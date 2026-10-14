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
| [shadcn/ui](https://ui.shadcn.com/)           |
| [TypeScript](https://www.typescriptlang.org/) |
| [Biome](https://biomejs.dev/)                 |

## Project Structure

This repo is organized into three main sections:

1. **[Configuration](./config/)**: Centralized config for project dependencies:
   - [Biome](./config/biome/) - Shared linting and formatting rules
   - [TypeScript](./config/typescript/) - Shared TypeScript configuration
   - [Tailwind CSS](./config/tailwind/) - Shared styling and theme

2. **[Packages](./packages/)**: Shared code and UI components:
   - [@workspace/ui](./packages/ui/) - Reusable React components built with shadcn/ui
   - Easily add new components via the shadcn CLI
   - [@workspace/schemas](./packages/schemas/) - Zod validation and schema-derived contracts
   - [@workspace/utils](./packages/utils/) - Runtime-neutral utilities and canonical HTTP status constants
   - [@workspace/api-client](./packages/api-client/) - API requests with responses validated by the shared schemas

3. **[Applications](./apps/)**: Main apps:
   - **[web-client](./apps/client/)**: Next.js 16 + React 19 with Turbopack
   - **[api-server](./apps/server/)**: Elysia + TypeScript backend running on Bun
     - Fast, modern API server
     - Auto-generated OpenAPI docs with Scalar
     - Type-safe, Zod-validated environment config

## Setup Instructions

### Prerequisites

- [Node.js](https://nodejs.org/) v20 or newer (used by the Next.js client)
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

#### Environment Setup (Server)

1. Copy the example env file. Docker Compose reads the same `DB_*` values, so the
   local database is created with the credentials and port the server uses:

   ```sh
   cp apps/server/.env.example apps/server/.env
   ```

#### First-Time Setup

Installs dependencies from the lockfile, starts PostgreSQL in Docker, and applies
the committed migrations:

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
order), Turborepo boundaries, type checks, Vitest tests, and builds.

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

Each deployable app owns a `Dockerfile`. The API server image is built from the
repository root and contains one bundled file, so no `node_modules` ship:

```sh
docker build -f apps/server/Dockerfile -t api-server .
```

To run the production containers locally (PostgreSQL, migrations, then the API
server), using the settings in `apps/server/.env`:

```sh
bun run start:docker
```

Images are named after their package: `ghcr.io/<owner>/<repository>/api-server`.

[`.github/workflows/release-images.yml`](./.github/workflows/release-images.yml)
runs on pushes to `main`. It asks Turborepo which apps the push affected and
builds and publishes images to GitHub Container Registry only for affected apps
that have a `Dockerfile`. A documentation-only change builds nothing; a change to
`packages/schemas` rebuilds the apps that import it. Add a deploy job for the
chosen hosting platform after the publish job.

## Dependency Updates

The committed `bun.lock` is the source of truth; CI installs with
`--frozen-lockfile`. [Dependabot](./.github/dependabot.yml) opens weekly pull
requests: grouped minor and patch updates, separate major updates, and GitHub
Actions and Docker Compose image updates. Update the Bun version manually in the
root `packageManager` field and the server `Dockerfile` `BUN_VERSION` argument.

---

## shadcn/ui Components

This template uses [shadcn/ui](https://ui.shadcn.com/).

### Adding New Components

Components are added to the shared UI package at `packages/ui`. Navigate there and use the shadcn CLI:

```sh
cd packages/ui
bunx shadcn@latest add button
bunx shadcn@latest add card
bunx shadcn@latest add dialog
```

### Using Components

Import components from the shared UI package in your applications:

```tsx
// Import UI components
import { Button } from "@workspace/ui/components/ui/button";

// Use in your component
export function MyComponent() {
  return (
    <Button variant="default" size="lg">
      Click me
    </Button>
  );
}
```

### Available Button Variants

The Button component supports multiple variants and sizes:

```tsx
// Variants: default, outline, secondary, ghost, destructive, link
<Button variant="outline">Outline Button</Button>
<Button variant="destructive">Delete</Button>

// Sizes: default, xs, sm, lg, icon, icon-xs, icon-sm, icon-lg
<Button size="sm">Small Button</Button>
<Button size="icon"><IconComponent /></Button>
```

---

## Tailwind CSS

[Tailwind CSS v4](https://tailwindcss.com/docs/v4-beta) is configured with CSS variables for theming. Configuration is centralized in [config/tailwind/](./config/tailwind/).

The global styles in [globals.css](./config/tailwind/globals.css) provide:

- Light and dark mode color schemes
- shadcn/ui design tokens
- Animation utilities via `tw-animate-css`

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

- **bun run test**: Run Vitest suites in every package that defines them.

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

---

## License

MIT
