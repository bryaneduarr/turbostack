# Turbostack

A **monorepo** template for full-stack web apps, powered by [Turborepo](https://turbo.build/repo/docs).

Includes [Shadcn/ui](https://ui.shadcn.com/docs) for rapid UI development.

> For details on each app or package, see their respective **README.md** files.

## Project Structure

This repo is organized into three main sections:

1. **[Configuration files](./config/)**: Centralized config for project dependencies:
   - [ESLint](./config/eslint/)
   - [Prettier](./config/prettier/)
   - [TypeScript](./config/typescript/)
   - [Tailwind CSS](./config/tailwind/)

2. **[Packages](./packages/)**: Shared code and UI components:
   - Reusable React components and utilities (see [ui](./packages/ui/))
   - Easily add new components via [Shadcn/ui](https://ui.shadcn.com/docs) CLI

3. **[Applications](./apps/)**: Main apps:
   - **Client**: [Next.js](https://nextjs.org/docs) 15 + [React 19](https://reactjs.org/) with [Turbopack](https://turbo.build/pack)
   - **Server**: [Hono.js](https://hono.dev/) + [TypeScript](https://www.typescriptlang.org/) backend
     - Fast, modern API server.
     - Auto-generated OpenAPI docs.
     - Type-safe, Zod-validated environment config.
     - Modular routing structure.
     - TypeScript path aliases for clean imports.
     - See [apps/server/README.md](./apps/server/README.md) for details.

## Setup Instructions

### Prerequisites

- [Node.js](https://nodejs.org/) v20 or newer
- [PNPM](https://pnpm.io/)

#### Install PNPM

- **Windows**:
  1. Open the terminal
  2. Run: `npm install -g pnpm`
- **Linux/macOS**:
  1. Open the terminal
  2. Run: `npm install -g pnpm`

#### Clone and Install

1. Clone the repository:

   ```sh
   git clone https://github.com/bryaneduarr/turbostack.git
   cd turbostack

   ```

2. Install dependencies:
   ```sh
   pnpm install
   ```

#### Environment Setup (Server)

1. Copy the example env file:

   ```sh
   cp apps/server/.env.example apps/server/.env
   ```

#### Start Development

```sh
pnpm run dev
```

#### Full Setup (Recommended)

Runs clean, install, format, lint, type-check, build, and dev:

```sh
pnpm run setup
```

---

## Package Manager

Package manager used for this template is [PNPM](https://pnpm.io/motivation).

## Tailwind CSS

[Tailwind CSS v.4](https://tailwindcss.com/docs/installation/using-vite) is in the latest version `v4`. You can find all the configuration in [here](./config/tailwind/).

The file [globals.css](./packages/ui/src/styles/globals.css) is based on the file from [this external file](https://github.com/shadcn/app-tailwind-v4/blob/main/app/globals.css).

## Available Scripts

All scripts are run from the project root using [PNPM](https://pnpm.io/) and [Turborepo](https://turbo.build/repo/docs). These commands work across all apps and packages:

- **pnpm install**: Install all dependencies for the monorepo.

  ```sh
  pnpm install
  ```

- **pnpm run build**: Build all apps and packages (Next.js client, Hono.js server, shared packages).

  ```sh
  pnpm run build
  ```

- **pnpm run clean**: Remove build files and node_modules for a fresh start.

  ```sh
  pnpm run clean
  ```

- **pnpm run check-types**: Type-check all TypeScript codebases.

  ```sh
  pnpm run check-types
  ```

- **pnpm run dev**: Start development servers for all apps (Next.js client, Hono.js server) with hot reloading.

  ```sh
  pnpm run dev
  ```

- **pnpm run format**: Format all code using Prettier, following project rules that are specified in [here](./config/prettier/base.js).

  ```sh
  pnpm run format
  ```

- **pnpm run lint**: Lint all code using ESLint, following project rules that are specified in [here](./config/eslint/index.ts).

  ```sh
  pnpm run lint
  ```

- **pnpm run update**: Update all dependencies to their latest versions **USE IT WITH CAUTION FOR DEPENDENCY CONFLICTS**.

  ```sh
  pnpm run update
  ```

- **pnpm run setup**: Clean, install, format, lint, type-check, build, and start dev servers (recommended for first-time setup).

  ```sh
  pnpm run setup
  ```

- **pnpm run setup:update**: Like `setup`, but also updates all dependencies before running setup tasks.

  ```sh
  pnpm run setup:update
  ```

- **pnpm run start**: Start all apps in production mode (after build).
  ```sh
  pnpm run start
  ```
