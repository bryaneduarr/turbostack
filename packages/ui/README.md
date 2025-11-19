# @workspace/components

A shared UI component library for the workspace built with Tailwind CSS v.4. This package provides reusable, accessible components that can be imported throughout the workspace.

## Adding a Custom Component with the shared UI library

You can also create custom components using existing components in the shared UI library following these steps:

1. Create a new file in [src/components/](./src/components/) directory.

2. For example, to create a new component called `basic-date-picker`, create a file named [basic-date-picker.tsx](./src/components/basic-date-picker.tsx)

## Using the Components

Components can be imported directly from [@workspace/ui](../../packages/ui/) into any other package in the workspace.

For example, guide yourself with the next example on how to import components into your packages:

```tsx
// Import Custom Components from the shared UI library.
import DatePicker from "@workspace/ui/components/basic-date-picker";
// Import Individual Components.
import { Button } from "@workspace/ui/components/button";
import { Calendar } from "@workspace/ui/components/calendar";
```

## Configuration

This application uses shared configurations from the workspace:

- **Biome** - Config from [@workspace/biome](../../config/biome)
- **Tailwind CSS** - Config from [@workspace/tailwind](../../config/tailwind/)
- **TypeScript** - Config from [@workspace/typescript](../../config/typescript/)

## Available Scripts

- **pnpm check-types** - Check TypeScript types without emitting files
- **pnpm clean** - Remove generated directories (dist, node_modules, .turbo)
- **pnpm format** - Format code with Biome
- **pnpm lint** - Lint code with Biome
- **pnpm update** - Update dependencies to their latest versions
