# @workspace/biome

Shared [Biome](https://biomejs.dev/) configuration for the workspace.

## Overview

This package provides a standardized Biome configuration used across all packages and applications within the workspace. It ensures consistent code formatting and linting throughout the project.

## Technology Stack

| Technology |
|------------|
| [Biome](https://biomejs.dev/) |

## Features

- **Fast Performance** - Biome is written in Rust for blazing-fast execution
- **Unified Tooling** - Single tool for both formatting and linting
- **TypeScript Support** - First-class TypeScript and JSX support
- **Zero Config** - Works out of the box with sensible defaults
- **Editor Integration** - VS Code extension available

## Configuration

The `biome.json` file configures:

### Formatter Settings

```json
{
  "formatter": {
    "enabled": true,
    "lineWidth": 80,
    "indentStyle": "space",
    "indentWidth": 2
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "double",
      "trailingCommas": "all",
      "semicolons": "always"
    }
  }
}
```

### Linter Rules

```json
{
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,
      "style": {
        "useConst": "warn"
      },
      "correctness": {
        "noUnusedVariables": "error"
      }
    }
  }
}
```

### Module Import Policy

The shared `style.noRestrictedImports` rule rejects filesystem module imports
and JavaScript/TypeScript extensions on `@/...` and `@workspace/...` aliases.
This includes type-only imports. Package modules use their owning
`@workspace/<package>/...` alias even within the same package; app-local modules
use `@/...`. Package exports and declared dependencies must resolve cross-package
imports without consumer-side source mappings.

Keep bare external dependency imports direct. Stylesheets and JSON imports use
aliases with their required non-code extensions. The generated Next.js
`next-env.d.ts` file is excluded so framework-maintained references remain intact.
`correctness.useImportExtensions` stays disabled because source module aliases
are extensionless.

### Import Organization

```json
{
  "assist": {
    "enabled": true,
    "actions": {
      "source": {
        "organizeImports": "on"
      }
    }
  }
}
```

### Rule Plugins

`plugins/` holds GritQL rules for project conventions that Biome has no built-in
rule for, such as hardcoded HTTP statuses, loose Zod schemas, manual
memoization, and unvalidated environment access. Each diagnostic names the fix.

Biome resolves plugin paths from the folder of the configuration that lists
them, so the plugins are declared once in the root `biome.json` with root-relative
paths. To add one, create `plugins/<area>/<rule>.grit`, list it there, and prove
it fires on a throwaway file before relying on it. Use non-capturing `(?:...)`
groups in GritQL regular expressions; capturing groups bind variables and make
the plugin error.

## Usage

The root `biome.json` extends this configuration and declares the rule plugins.
Each package's `biome.json` uses `"extends": "//"` to inherit the root
configuration, plugins included.

### Running Biome

From the workspace root:

```sh
# Format all files
bun run format

# Lint all files
bun run lint
```

### VS Code Integration

Install the [Biome VS Code extension](https://marketplace.visualstudio.com/items?itemName=biomejs.biome) for editor integration with:

- Format on save
- Real-time linting
- Quick fixes

Add to your `.vscode/settings.json`:

```json
{
  "editor.defaultFormatter": "biomejs.biome",
  "editor.formatOnSave": true,
  "[javascript]": {
    "editor.defaultFormatter": "biomejs.biome"
  },
  "[typescript]": {
    "editor.defaultFormatter": "biomejs.biome"
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "biomejs.biome"
  }
}
```

## File Filtering

The configuration includes specific file patterns:

```json
{
  "files": {
    "includes": [
      "**/*.{js,jsx,mjs,cjs,ts,tsx,mts,cts}",
      "!**/next-env.d.ts",
      "!**/dist",
      "!**/build",
      "!**/.turbo",
      "!**/.next",
      "!**/node_modules"
    ]
  }
}
```

## Scripts

- **bun run clean** - Remove generated directories
