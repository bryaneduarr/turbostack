# `@workspace/eslint`

Shared **ESLint** configuration for the Turborepo workspace.

## Overview

This package provides a general [ESLint](https://eslint.org/) configuration that is used across all packages and applications within the monorepo. It ensures consistent code quality and style throughout the project.

## Features

- **Unified Configuration** - Consistent rules applied across all TypeScript and JavaScript files
- **React Support** - Specialized rules for React components and JSX
- **TypeScript Integration** - Full type checking with @typescript-eslint
- **Next.js Support** - Includes Next.js-specific linting rules
- **Turbo Integration** - Configuration optimized for monorepo packages with Turborepo
- **Modern JavaScript** - Based on latest ESLint flat config format

## Usage

To use this configuration in a workspace package:

Create an `eslint.config.ts` file in your package root:

```typescript
// Import the shared configuration
import { eslintConfig as sharedConfig } from "@workspace/eslint/index";

// Export with any package-specific overrides
export default [...sharedConfig];
```

For more specific configurations, extend the base config:

```typescript
import { eslintConfig as sharedConfig } from "@workspace/eslint/index";

export default [
  ...sharedConfig,
  {
    files: ["**/*.ts"],
    rules: {
      // Your package-specific rules
    }
  }
];
```

## Configuration Details

The configuration enforces:

- Double quotes
- Semicolons
- Modern React practices (no need for React imports with JSX)
- TypeScript best practices
- Ignores common build artifacts and dependencies

## Scripts

- `pnpm clean` - Remove generated directories
- `pnpm check-types` - Verify TypeScript types
- `pnpm update` - Update dependencies to latest versions
