# `@workspace/prettier`

Shared [Prettier](https://prettier.io/) configuration for the Turborepo workspace.

## Overview

This package provides a standardized [Prettier](https://prettier.io/) configuration used across all packages and applications within the monorepo. It ensures consistent code formatting and style throughout the project.

## Features

- **Consistent Code Style** - Unified formatting across all packages and applications
- **Import Sorting** - Organized imports using `@ianvs/prettier-plugin-sort-imports`
- **Tailwind CSS Integration** - Support for formatting Tailwind CSS classes with `prettier-plugin-tailwindcss`
- **Path Aliases** - Configuration for handling monorepo path aliases
- **TypeScript Support** - Full integration with TypeScript files
- **JSX/React Support** - Special handling for React components

## Included Plugins

- `@ianvs/prettier-plugin-sort-imports` - Smart import sorting
- `prettier-plugin-tailwindcss` - Class sorting for Tailwind CSS

## Configuration Details

The configuration includes:

- **Import Order** - Structured import sorting with type imports prioritized
- **Tailwind Integration** - Points to the workspace's global Tailwind stylesheet
- **Formatting Rules**:
  - Print width: 80 characters
  - Tab width: 2 spaces
  - Double quotes
  - Trailing commas in all multiline constructs
  - OS-specific line endings with `auto`

## Usage

To use this configuration in a workspace package:

Create a `prettier.config.mjs` file in your package root:

```javascript
// Import the shared configuration
export { default } from "@workspace/prettier/base";
```

For packages that need specific overrides, extend the base config:

```javascript
// Import the shared configuration
import baseConfig from "@workspace/prettier/base";

/** @type {import("prettier").Config} */
export default {
  ...baseConfig,
  // Your package-specific overrides
};
```

## Type Definitions

The package includes TypeScript type definitions in `base.d.ts` to provide proper type support when importing the configuration.

## Scripts

- `pnpm clean` - Remove generated directories
- `pnpm update` - Update dependencies to latest versions
