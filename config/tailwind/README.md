# `@workspace/tailwind`

Shared [Tailwind CSS](https://tailwindcss.com/blog/tailwindcss-v4) configuration for the workspace.

## Overview

This package provides a standardized [Tailwind CSS V.4](https://tailwindcss.com/blog/tailwindcss-v4) configuration used across all packages and applications within the workspace. It ensures consistent styling and theme support throughout the project.

## Features

- **Tailwind CSS v4** - Latest version with all new features and optimizations
- **Shared Theme System** - Unified color scheme and design tokens
- **CSS Variables** - Custom properties for colors, spacing, and more
- **Animation Support** - Via `tw-animate-css` plugin
- **Custom Components** - Pre-configured styles for shadcn/ui components

## Key Files

- **`globals.css`** - Global styles and CSS variables
- **`postcss.config.mjs`** - PostCSS configuration for Tailwind

## Usage

To use this configuration in a workspace package:

Import the global styles in your main CSS or layout file (not needed in the default template, if needed you can create a new file `globals.css` and import the default styles from [here](./globals.css)).

```typescript
import "@workspace/tailwind/globals.css";
```

For PostCSS configuration, create a `postcss.config.mjs` (not needed in the default template, if needed you can create a new file `globals.css` and import the default styles from [here](./globals.css)):

```javascript
export { default } from "@workspace/tailwind/postcss.config";
```

## Scripts

- `pnpm clean` - Remove generated directories
- `pnpm update` - Update dependencies to latest versions
