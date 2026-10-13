# Turbostack

A **monorepo** template for full-stack web applications, powered by [Turborepo](https://turbo.build/repo/docs) and [Bun](https://bun.sh/).

Build modern applications with **Next.js** on the frontend and **Hono.js** on the backend, sharing code through a unified workspace structure.

> For details on each app or package, see their respective **README.md** files.

## Technology Stack

| Technology                                    |
| --------------------------------------------- |
| [Bun](https://bun.sh/)                        |
| [Node.js](https://nodejs.org/)                |
| [Turborepo](https://turbo.build/repo)         |
| [Next.js](https://nextjs.org/)                |
| [React](https://react.dev/)                   |
| [Hono.js](https://hono.dev/)                  |
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
   - [@workspace/utils](./packages/utils/) - Runtime-neutral utilities and canonical HTTP status constants

3. **[Applications](./apps/)**: Main apps:
   - **[Client](./apps/client/)**: Next.js 16 + React 19 with Turbopack
   - **[Server](./apps/server/)**: Hono.js + TypeScript backend
     - Fast, modern API server
     - Auto-generated OpenAPI docs with Scalar
     - Type-safe, Zod-validated environment config

## Setup Instructions

### Prerequisites

- [Node.js](https://nodejs.org/) v20 or newer
- [Bun](https://bun.sh/) v1.3.4 or newer

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

1. Copy the example env file:

   ```sh
   cp apps/server/.env.example apps/server/.env
   ```

#### Start Development

```sh
bun run dev
```

#### Full Setup (Recommended)

Runs clean, install, format, lint, type-check, build, and dev:

```sh
bun run setup
```

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
import { Button } from "@workspace/ui/ui/button";

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

- **bun run build**: Build all apps and packages (Next.js client, Hono.js server, shared packages).

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

- **bun run dev**: Start development servers for all apps (Next.js client, Hono.js server) with hot reloading.

  ```sh
  bun run dev
  ```

- **bun run format**: Format all code using Biome.

  ```sh
  bun run format
  ```

- **bun run lint**: Lint all code using Biome.

  ```sh
  bun run lint
  ```

- **bun run update**: Update all dependencies to their latest versions **USE WITH CAUTION FOR DEPENDENCY CONFLICTS**.

  ```sh
  bun run update
  ```

- **bun run setup**: Clean, install, format, lint, type-check, build, and start dev servers (recommended for first-time setup).

  ```sh
  bun run setup
  ```

- **bun run setup:update**: Like `setup`, but also updates all dependencies before running setup tasks.

  ```sh
  bun run setup:update
  ```

- **bun run start**: Start all apps in production mode (after build).

  ```sh
  bun run start
  ```

---

## License

MIT
