# Client Application

This is a [Next.js](https://nextjs.org) application that's part of a apps workspace structure.

The application uses **Next.js 16** with **React 19** and **Tailwind CSS v4**.

## Features

- **Next.js 16** - Latest Next.js framework with App Router.
- **React 19** - Latest React version.
- **Tailwind CSS v4** - Using shared Tailwind configuration.
- **UI Components** - Reusable UI components from the workspace.
- **TypeScript** - Full type safety throughout the application.
- **Turbopack** - Fast development server with hot reloading.

## Getting Started

First, run the development server:

```shell
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`.

## Building the Application

Build the app with the integrated command:

```shell
pnpm run build
```

This will build the entire Next.js app into one.

Now start the production application.

```shell
pnpm run start
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Using UI Components

The application uses components from the shared UI library. For example:

```tsx
import { Button } from "@workspace/ui/button";
```

## Configuration

This application uses shared configurations from the workspace:

- **Biome** - Config from [@workspace/biome](../../config/biome)
- **TypeScript** - Config from [@workspace/typescript](../../config/typescript/)

## Available Scripts

- **pnpm build** - Builds the Next.js application for production
- **pnpm clean** - Removes generated directories (node_modules, .turbo, .next)
- **pnpm check-types** - Checks TypeScript types without emitting files
- **pnpm dev** - Starts the development server with Turbopack
- **pnpm format** - Formats code with Biome
- **pnpm lint** - Lints code with Biome
- **pnpm start** - Starts the production server
- **pnpm update** - Updates dependencies to their latest versions

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
