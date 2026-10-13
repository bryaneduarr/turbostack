# @workspace/ui

A shared UI component library for the workspace built with [shadcn/ui](https://ui.shadcn.com/) and [Tailwind CSS v4](https://tailwindcss.com/).

This package provides reusable, accessible components that can be imported throughout the workspace.

## Technology Stack

| Technology |
|------------|
| [React](https://react.dev/) |
| [shadcn/ui](https://ui.shadcn.com/) |
| [Tailwind CSS](https://tailwindcss.com/) |
| [Base UI](https://base-ui.com/) |
| [CVA](https://cva.style/) |
| [Lucide React](https://lucide.dev/) |

## Adding shadcn/ui Components

Use the shadcn CLI to add new components to this package:

```sh
cd packages/ui
bunx shadcn@latest add button
bunx shadcn@latest add card
bunx shadcn@latest add dialog
bunx shadcn@latest add input
```

Components will be added to `src/components/ui/`.

### Browse Available Components

See the full list of available components at [ui.shadcn.com/docs/components](https://ui.shadcn.com/docs/components).

## Adding Custom Components

You can also create custom components using existing components in the shared UI library:

1. Create a new file in [src/components/](./src/components/) directory.

2. For example, to create a new component called `basic-date-picker`, create a file named [basic-date-picker.tsx](./src/components/basic-date-picker.tsx)

## Using the Components

Components can be imported directly from `@workspace/ui` into any other package in the workspace.

### Importing UI Components

```tsx
// Import UI components (shadcn/ui)
import { Button } from "@workspace/ui/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@workspace/ui/ui/card";

// Import custom components
import DatePicker from "@workspace/ui/components/basic-date-picker";

// Import the class-merging dependency directly
import { cn } from "cn";
```

### Component Examples

#### Button Component

```tsx
import { Button } from "@workspace/ui/ui/button";

// Variants: default, outline, secondary, ghost, destructive, link
<Button variant="default">Primary</Button>
<Button variant="outline">Outline</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Delete</Button>
<Button variant="link">Link</Button>

// Sizes: default, xs, sm, lg, icon, icon-xs, icon-sm, icon-lg
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
<Button size="icon"><ChevronRight /></Button>
```

#### Using the `cn` Utility

The `cn` dependency merges Tailwind classes intelligently. Import it directly
rather than through a forwarding utility module. Any consumer importing `cn`
must declare it as a dependency:

```tsx
import { cn } from "cn";

function MyComponent({ className, isActive }) {
  return (
    <div className={cn(
      "rounded-lg p-4",
      isActive && "bg-primary text-primary-foreground",
      className
    )}>
      Content
    </div>
  );
}
```

## Configuration

This package uses shared configurations from the workspace:

- **Biome** - Config from [@workspace/biome](../../config/biome/)
- **Tailwind CSS** - Config from [@workspace/tailwind](../../config/tailwind/)
- **TypeScript** - Config from [@workspace/typescript](../../config/typescript/)

### shadcn/ui Configuration

The `components.json` file configures shadcn/ui for this package:

```json
{
  "style": "base-lyra",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "css": "./src/globals.css",
    "baseColor": "zinc",
    "cssVariables": true
  },
  "iconLibrary": "lucide",
  "aliases": {
    "components": "@workspace/ui/components",
    "utils": "cn",
    "ui": "@workspace/ui/components/ui"
  }
}
```

## Available Scripts

- **bun run check-types** - Check TypeScript types without emitting files
- **bun run clean** - Remove generated directories (node_modules, .turbo)
- **bun run format** - Format code with Biome
- **bun run lint** - Lint code with Biome
- **bun run update** - Update dependencies to their latest versions

## Package Exports

This package exports component modules through extensionless package subpaths:

```json
{
  "exports": {
    "./components/*": "./src/components/*.tsx",
    "./ui/*": "./src/components/ui/*.tsx",
    "./hooks/*": "./src/hooks/*.ts"
  }
}
```
