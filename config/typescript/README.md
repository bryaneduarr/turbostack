# @workspace/typescript

Shared [TypeScript](https://www.typescriptlang.org/) configuration for the workspace.

## Overview

This package provides standardized TypeScript configurations used across all TypeScript packages and applications within the workspace. It ensures consistent type checking, module resolution, and compiler options throughout the project.

## Technology Stack

| Technology |
|------------|
| [TypeScript](https://www.typescriptlang.org/) |

## Features

- **Base Configuration** - Core TypeScript settings for all projects
- **Modern JavaScript** - Targets ES2022 with latest features
- **Strict Type Checking** - Enables TypeScript's strict mode for maximum type safety
- **Path Resolution** - Consistent module resolution strategy
- **NodeNext Module Resolution** - Modern ESM-compatible module handling

## Configuration Files

### Base Configuration (`base.json`)

The foundation for all TypeScript projects with:

```json
{
  "compilerOptions": {
    "declaration": true,
    "declarationMap": true,
    "esModuleInterop": true,
    "exactOptionalPropertyTypes": true,
    "incremental": false,
    "isolatedModules": true,
    "lib": ["es2022", "DOM", "DOM.Iterable"],
    "module": "NodeNext",
    "moduleDetection": "force",
    "moduleResolution": "NodeNext",
    "noUncheckedIndexedAccess": true,
    "resolveJsonModule": true,
    "skipLibCheck": true,
    "strict": true,
    "target": "ES2022"
  }
}
```

## Usage

To use these configurations in your workspace package:

### For Basic TypeScript Projects

```json
{
  "extends": "@workspace/typescript/base",
  "compilerOptions": {
    // Project-specific options
  }
}
```

### With Path Aliases

```json
{
  "extends": "@workspace/typescript/base",
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

## Scripts

- **bun run clean** - Remove generated directories
- **bun run update** - Update dependencies to latest versions
