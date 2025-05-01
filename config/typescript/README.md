# `@workspace/typescript`

Shared [TypeScript](https://www.typescriptlang.org/) configuration for the Turborepo workspace.

## Overview

This package provides standardized TypeScript configurations used across all TypeScript packages and applications within the monorepo. It ensures consistent type checking, module resolution, and compiler options throughout the project.

## Features

- **Base Configuration** - Core TypeScript settings for all projects
- **React Configuration** - Specialized settings for React applications
- **Next.js Configuration** - Optimized settings for Next.js applications
- **Modern JavaScript** - Targets ES2022 with latest features
- **Strict Type Checking** - Enables TypeScript's strict mode for maximum type safety
- **Path Resolution** - Consistent module resolution strategy

## Configuration Files

### Base Configuration (`base.json`)

The foundation for all TypeScript projects with:

```json
{
  "compilerOptions": {
    "declaration": true,
    "declarationMap": true,
    "esModuleInterop": true,
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

### React Configuration (`react.json`)

Extends the base config with React-specific settings:

```json
{
  "extends": "./base.json",
  "compilerOptions": {
    "jsx": "react-jsx"
  }
}
```

### Next.js Configuration (`next.json`)

Extends the base config with Next.js-specific settings:

```json
{
  "extends": "./base.json",
  "compilerOptions": {
    "plugins": [{ "name": "next" }],
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "allowJs": true,
    "jsx": "preserve",
    "noEmit": true
  }
}
```

## Usage

To use these configurations in your workspace package:

### For basic TypeScript projects

```json
{
  "extends": "@workspace/typescript/base.json",
  "compilerOptions": {
    // Project-specific options
  }
}
```

### For React projects

```json
{
  "extends": "@workspace/typescript/react.json",
  "compilerOptions": {
    // Project-specific options
  }
}
```

### For Next.js projects

```json
{
  "extends": "@workspace/typescript/next.json",
  "compilerOptions": {
    // Project-specific options
  }
}
```
