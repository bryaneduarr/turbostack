# @workspace/ui

A shared UI component library for the workspace built with [Shadcn UI](https://ui.shadcn.com/docs) UI and [Tailwind CSS v.4](https://tailwindcss.com/docs/) This package provides reusable, accessible components that can be imported throughout the monorepo.

## Available Components

This package includes several pre-configured components:

- [Button](./src/components/button.tsx) - Customizable button with multiple variants
- [Calendar](./src/components/calendar.tsx) - Date picker calendar
- [Popover](./src/components/popover.tsx) - Floating content panel
- [DatePicker](./src/components/ui/basic-date-picker.tsx) - Ready-to-use date picker combining Popover and Calendar

## Adding a New Component

Take any component you desire from [Shadcn UI](https://ui.shadcn.com/docs).

Navigate to [packages/ui](../../packages/ui/)

```sh
cd packages/ui
```

Use the [Shadcn UI](https://ui.shadcn.com/docs) CLI to add a new component. For example, to add a new component called `card` use the following command:

```sh
pnpm dlx shadcn@latest add card
```

This will add the component in [src/componentsc](./src/components/) directory with the component's code and styles based on the configuration inside [components.json](./components.json).

### Creating Custom Components

You can also create custom composite components using existing Shadcn components following these steps:

1. Create a new file in [src/components/ui](./src/components/ui/) directory.

2. For example, to create a new component called `basic-date-picker`, create a file named [basic-date-picker.tsx](./src/components/ui/basic-date-picker.tsx)

3. Import the necessary components from the [Shadcn UI](https://ui.shadcn.com/docs) library and compose them together. For example, you can import the [Popover](./src/components/popover.tsx) and [Calendar](./src/components/calendar.tsx) components to create a date picker.

## Using the Components

Components can be imported directly from [@workspace/ui](../../packages/ui/) into any other package in the monorepo. For example, guide yourself with the next example on how to import components to your packages:

```tsx
// Import Individual Components.
import { Button } from "@workspace/ui/components/button";
import { Calendar } from "@workspace/ui/components/calendar";
// Import Custom Components.
import DatePicker from "@workspace/ui/components/ui/basic-date-picker";
// Import Utility Functions.
import { cn } from "@workspace/ui/lib/utils";
```

## Configuration

This application uses shared configurations from the monorepo workspace:

- **ESLint** - Config from [@workspace/eslint](../../config/eslint)
- **Prettier** - Config from [@workspace/prettier](../../config/prettier/)
- **Tailwind** - Config from [@workspace/tailwind](../../config/tailwind/)
- **TypeScript** - Config from [@workspace/typescript](../../config/typescript/)

## Available Scripts

- **pnpm check-types** - Check TypeScript types without emitting files
- **pnpm clean** - Remove generated directories (dist, node_modules, .turbo)
- **pnpm format** - Format code with Prettier
- **pnpm lint** - Lint code with ESLint
- **pnpm update** - Update dependencies to their latest versions
