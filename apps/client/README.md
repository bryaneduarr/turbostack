# Client Application

A [Next.js](https://nextjs.org) frontend application that's part of the Turbostack monorepo.

## Technology Stack

| Technology |
|------------|
| [Next.js](https://nextjs.org/) |
| [React](https://react.dev/) |
| [Tailwind CSS](https://tailwindcss.com/) |
| [Turbopack](https://turbo.build/pack) |
| [TypeScript](https://www.typescriptlang.org/) |

## Features

- **Next.js 16** - Latest Next.js framework with App Router
- **React 19** - Latest React version with new features
- **Tailwind CSS v4** - Using shared Tailwind configuration
- **shadcn/ui** - Beautiful, accessible UI components from the workspace
- **TypeScript** - Full type safety throughout the application
- **Turbopack** - Fast development server with hot reloading

## Getting Started

First, run the development server:

```sh
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`.

## Building the Application

Build the app with the integrated command:

```sh
bun run build
```

This will build the entire Next.js app for production.

Now start the production application:

```sh
bun run start
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Using UI Components

The application uses shadcn/ui components from the shared UI library:

```tsx
// Import UI components from the shared package
import { Button } from "@workspace/ui/components/ui/button";

// Use with different variants
<Button variant="default">Primary Action</Button>
<Button variant="outline">Secondary Action</Button>
<Button variant="destructive">Delete</Button>

// Use with different sizes
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
<Button size="icon"><ChevronRight /></Button>
```

### Adding New shadcn Components

To add new components to the shared UI library:

```sh
cd packages/ui
bunx shadcn@latest add [component-name]
```

Then import them in your client application:

```tsx
import { Card, CardHeader, CardTitle, CardContent } from "@workspace/ui/components/ui/card";
```

## Configuration

This application uses shared configurations from the workspace:

- **Biome** - Config from [@workspace/biome](../../config/biome/)
- **Tailwind CSS** - Config from [@workspace/tailwind](../../config/tailwind/)
- **TypeScript** - Config from [@workspace/typescript](../../config/typescript/)

## Available Scripts

- **bun run build** - Builds the Next.js application for production
- **bun run clean** - Removes generated directories (node_modules, .turbo, .next)
- **bun run check-types** - Checks TypeScript types without emitting files
- **bun run dev** - Starts the development server with Turbopack
- **bun run format** - Formats code with Biome
- **bun run lint** - Lints code with Biome
- **bun run start** - Starts the production server

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
