# `@workspace/tailwind`

Shared [Tailwind CSS](https://tailwindcss.com/blog/tailwindcss-v4) configuration for the Turborepo workspace.

## Overview

This package provides a standardized [Tailwind CSS V.4](https://tailwindcss.com/blog/tailwindcss-v4) configuration used across all packages and applications within the monorepo. It ensures consistent styling and theme support throughout the project.

## Features

- **Tailwind CSS v4** - Latest version with all new features and optimizations
- **Shared Theme System** - Unified color scheme and design tokens
- **CSS Variables** - Custom properties for colors, spacing, and more
- **Animation Support** - Via `tailwindcss-animate` plugin
- **Custom Components** - Pre-configured for shadcn/ui components

## Key Files

- **`tailwind.config.ts`** - Main configuration with theme settings
- **`globals.css`** - Global styles and CSS variables
- **`postcss.config.mjs`** - PostCSS configuration for Tailwind

## Usage

To use this configuration in a workspace package:

Import the Tailwind configuration in your `tailwind.config.ts`:

```typescript
export { default } from "@workspace/tailwind/tailwind.config";
```

Import the global styles in your main CSS or layout file:

```typescript
import "@workspace/tailwind/globals.css";
```

For PostCSS configuration, create a `postcss.config.mjs`:

```javascript
export { default } from "@workspace/tailwind/postcss.config";
```

## Scripts

- `pnpm clean` - Remove generated directories
- `pnpm check-types` - Verify TypeScript types
- `pnpm update` - Update dependencies to latest versions
