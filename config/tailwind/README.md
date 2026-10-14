# @workspace/tailwind

Shared [Tailwind CSS](https://tailwindcss.com/) configuration for the workspace.

## Overview

This package provides a standardized [Tailwind CSS v4](https://tailwindcss.com/docs/v4-beta) configuration used across all packages and applications within the workspace. It ensures consistent styling and theme support throughout the project.

## Technology Stack

| Technology |
|------------|
| [Tailwind CSS](https://tailwindcss.com/) |
| [shadcn/ui](https://ui.shadcn.com/) |
| [tw-animate-css](https://github.com/romboHQ/tailwindcss-animated) |

## Features

- **Tailwind CSS v4** - Latest version with all new features and optimizations
- **shadcn/ui Integration** - Pre-configured design tokens and theme variables
- **Dark Mode Support** - Light and dark color schemes with CSS variables
- **Animation Utilities** - Smooth animations via tw-animate-css
- **Shared Theme System** - Unified color scheme and design tokens

## Key Files

- **`globals.css`** - Global styles, CSS variables, and theme configuration
- **`postcss.config.ts`** - PostCSS configuration for Tailwind

## Theme Configuration

The `globals.css` file includes:

### Color Variables

```css
:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.141 0.005 285.823);
  --primary: oklch(0.67 0.16 58);
  --secondary: oklch(0.967 0.001 286.375);
  --muted: oklch(0.967 0.001 286.375);
  --accent: oklch(0.67 0.16 58);
  --destructive: oklch(0.577 0.245 27.325);
  /* ... and more */
}

.dark {
  --background: oklch(0.141 0.005 285.823);
  --foreground: oklch(0.985 0 0);
  /* ... dark mode overrides */
}
```

### shadcn/ui Integration

The configuration imports shadcn's Tailwind styles:

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";
```

## Usage

To use this configuration in a workspace package:

### Import Global Styles

Import the global styles in your main CSS or layout file:

```typescript
import "@workspace/tailwind/globals.css";
```

### PostCSS Configuration

For PostCSS configuration, create a `postcss.config.ts`:

```typescript
export { default } from "@workspace/tailwind/postcss.config";
```

## Using Theme Colors

The theme colors are available as Tailwind utilities:

```tsx
// Background colors
<div className="bg-background" />
<div className="bg-primary" />
<div className="bg-secondary" />
<div className="bg-muted" />

// Text colors
<p className="text-foreground" />
<p className="text-primary-foreground" />
<p className="text-muted-foreground" />

// Border colors
<div className="border-border" />
<div className="border-input" />
```

## Scripts

- **bun run clean** - Remove generated directories
