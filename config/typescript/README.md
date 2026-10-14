# @workspace/typescript

Shared [TypeScript](https://www.typescriptlang.org/) configuration for the workspace.

## Overview

This package provides standardized TypeScript configurations used across all TypeScript packages and applications within the workspace. It ensures consistent type checking, module resolution, and compiler options throughout the project.

## Technology Stack

| Technology |
|------------|
| [TypeScript](https://www.typescriptlang.org/) |

## Presets

| Preset | Extends | Use for |
|---|---|---|
| `@workspace/typescript/base` | none | Strict, runtime-neutral settings (ES2022, no DOM) |
| `@workspace/typescript/bundler` | `base` | Packages and apps resolved by a bundler or Bun; no emit |
| `@workspace/typescript/react-library` | `bundler` | React packages; adds DOM types and `react-jsx` |
| `@workspace/typescript/nextjs` | `bundler` | Next.js apps; adds DOM types, `preserve` JSX, and the Next plugin |

`base` enables `strict`, `noUncheckedIndexedAccess`, and
`exactOptionalPropertyTypes`. DOM types are only available through the React and
Next.js presets, so runtime-neutral and server code cannot use browser globals by
accident.

## Usage

Extend the narrowest preset and add only package-specific options, such as path
aliases:

```json
{
  "extends": "@workspace/typescript/bundler",
  "compilerOptions": {
    "paths": {
      "@workspace/example/*": ["./src/*"]
    }
  }
}
```

## Scripts

- **bun run clean** - Remove generated directories
