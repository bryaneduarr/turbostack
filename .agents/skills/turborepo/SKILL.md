---
name: turborepo
description: |
  Turborepo monorepo build system guidance. Triggers on: turbo.json, task pipelines,
  dependsOn, caching, remote cache, the "turbo" CLI, --filter, --affected, CI optimization, environment
  variables, internal packages, monorepo structure/best practices, and boundaries.

  Use when user: configures tasks/workflows/pipelines, creates packages, sets up
  monorepo, shares code between apps, runs changed/affected packages, debugs cache,
  or has apps/packages directories.
metadata:
  version: 2.10.11
---

# Turborepo Skill

Build system for JavaScript/TypeScript monorepos. Turborepo caches task outputs and runs tasks in parallel based on dependency graph.

This local guide is self-contained; the upstream reference bundle is not installed. Use the configurations and anti-patterns below rather than assuming supplemental files exist. Mandatory repository conventions take precedence over generic package names, paths, lint tools, and dependency examples. Test examples require an explicit user request. The metadata version records the imported documentation version, not a required Turbo dependency version; confirm version-specific features against the installed tool before applying them.

## IMPORTANT: Package Tasks, Not Root Tasks

**Prefer package tasks over Root Tasks.**

When creating tasks/scripts/pipelines, you MUST default to package tasks:

1. Add the script to each relevant package's `package.json`
2. Register the task in root `turbo.json`
3. Root `package.json` only delegates via `turbo run <task>`

**DO NOT** put task logic in root `package.json` when it can live in packages. This defeats Turborepo's parallelization.

```json
// DO THIS: Scripts in each package
// apps/web/package.json
{ "scripts": { "build": "next build", "lint": "eslint .", "test": "vitest" } }

// apps/api/package.json
{ "scripts": { "build": "tsc", "lint": "eslint .", "test": "vitest" } }

// packages/ui/package.json
{ "scripts": { "build": "tsc", "lint": "eslint .", "test": "vitest" } }
```

```json
// turbo.json - register tasks
{
  "tasks": {
    "build": { "dependsOn": ["^build"], "outputs": ["dist/**"] },
    "lint": {},
    "test": { "dependsOn": ["build"] }
  }
}
```

```json
// Root package.json - ONLY delegates, no task logic
{
  "scripts": {
    "build": "turbo run build",
    "lint": "turbo run lint",
    "test": "turbo run test"
  }
}
```

```json
// DO NOT DO THIS - defeats parallelization
// Root package.json
{
  "scripts": {
    "build": "cd apps/web && next build && cd ../api && tsc",
    "lint": "eslint apps/ packages/",
    "test": "vitest"
  }
}
```

Root Tasks (`//#taskname`) are ONLY for tasks that truly cannot exist in packages, such as Vitest Projects' `//#test`, repo-wide release scripts, or tooling that does not invoke `turbo` itself.

## Secondary Rule: `turbo run` vs `turbo`

**Always use `turbo run` when the command is written into code:**

```json
// package.json - ALWAYS "turbo run"
{
  "scripts": {
    "build": "turbo run build"
  }
}
```

```yaml
# CI workflows - ALWAYS "turbo run"
- run: turbo run build --affected
```

**The shorthand `turbo <tasks>` is ONLY for one-off terminal commands** typed directly by humans or agents. Never write `turbo build` into package.json, CI, or scripts.

## Quick Decision Trees

### "I need to configure a task"

```
Configure a task?
├─ Define task dependencies → dependsOn: ^build for dependencies, build for the same package
├─ Lint/check-types (parallel + caching) → Use Transit Nodes pattern (see below)
├─ Specify build outputs → Match actual generated files (see Missing outputs below)
├─ Handle environment variables → Declare env and .env inputs (examples below)
├─ Set up dev/watch tasks → See Common Task Configurations below
└─ Package-specific config → Package turbo.json with extends: ["//"] (example below)
```

### "My cache isn't working"

```
Cache problems?
├─ Tasks run but outputs not restored → Missing `outputs` key
├─ Cache misses unexpectedly → Inspect inputs, env, and globalDependencies
├─ Need to debug hash inputs → Use --summarize or --dry
├─ Want to skip cache entirely → Use --force or cache: false
└─ Environment causing misses → Check env hashing and .env inputs (examples below)
```

### "I want to run only changed packages"

```
Run only what changed?
├─ Changed packages + dependents (RECOMMENDED) → turbo run build --affected
├─ Custom base branch → TURBO_SCM_BASE=origin/develop turbo run build --affected
└─ Manual git comparison → --filter=...[origin/main]
```

**`--affected` is the primary way to run only changed packages.** It compares against `main` (falling back to `master`) — not the repo's configured default branch — and includes dependents. Set `TURBO_SCM_BASE` for any other base branch.

### "I want to filter packages"

```
Filter packages?
├─ Only changed packages → --affected (see above)
├─ By package name → --filter=web
├─ By directory → --filter=./apps/*
├─ Package + dependencies → --filter=web...
└─ Package + dependents → --filter=...web
```

### "Environment variables aren't working"

```
Environment issues?
├─ Vars not available at runtime → Strict mode filtering (default)
├─ Cache hits with wrong env → Var not in `env` key
├─ .env changes not causing rebuilds → .env not in `inputs`
├─ CI variables missing → See Strict Mode Filtering CI Variables below
└─ Framework vars (NEXT_PUBLIC_*) → Auto-included via inference
```

### "I need to set up CI"

```
CI setup?
├─ Invoke package tasks → turbo run build (CI example below)
├─ Only build changed packages → --affected flag
└─ Skip unnecessary builds/container setup → turbo-ignore, if available and authorized
```

### "I want to watch for changes during development"

```
Watch mode?
├─ Re-run tasks on change → turbo watch (dev/watch example below)
├─ Dev servers with dependencies → Use `with` instead of --parallel
├─ Restart dev server on dep change → Use `interruptible: true`
└─ Persistent dev tasks → Use `persistent: true`
```

### "I need to create/structure a package"

```
Package creation/structure?
├─ Repository layout and ownership → Follow the mandatory repository structure rules
├─ Dependency management → Declare workspace dependencies in the owning package
├─ Build ordering → ^build follows declared dependencies (prebuild example below)
└─ Reusable code between apps → Respect capability ownership and runtime boundaries
```

### "How should I structure my monorepo?"

```
Monorepo structure?
├─ Standard layout (apps/, packages/) → Preserve existing workspace boundaries
├─ Root dependencies → Follow the mandatory repository dependency restrictions
├─ TypeScript configuration → Inspect the owning package's tsconfig
├─ Lint configuration → Use the repository's existing Biome conventions
└─ Package boundaries → Use declared dependencies and directly exported alias subpaths
```

### "I want to enforce architectural boundaries"

```
Enforce boundaries?
├─ Check for violations → turbo boundaries, if supported by the installed version
└─ Prevent cross-package file imports → Use exported package subpaths (example below)
```

## Critical Anti-Patterns

### Using `turbo` Shorthand in Code

**`turbo run` is recommended in package.json scripts and CI pipelines.** The shorthand `turbo <task>` is intended for interactive terminal use.

```json
// WRONG - using shorthand in package.json
{
  "scripts": {
    "build": "turbo build",
    "dev": "turbo dev"
  }
}

// CORRECT
{
  "scripts": {
    "build": "turbo run build",
    "dev": "turbo run dev"
  }
}
```

```yaml
# WRONG - using shorthand in CI
- run: turbo build --affected

# CORRECT
- run: turbo run build --affected
```

### Root Scripts Bypassing Turbo

Root `package.json` scripts MUST delegate to `turbo run`, not run tasks directly.

```json
// WRONG - bypasses turbo entirely
{
  "scripts": {
    "build": "bun build",
    "dev": "bun dev"
  }
}

// CORRECT - delegates to turbo
{
  "scripts": {
    "build": "turbo run build",
    "dev": "turbo run dev"
  }
}
```

### Using `&&` to Chain Turbo Tasks

Don't chain turbo tasks with `&&`. Let turbo orchestrate.

```json
// WRONG - turbo task not using turbo run
{
  "scripts": {
    "changeset:publish": "bun build && changeset publish"
  }
}

// CORRECT
{
  "scripts": {
    "changeset:publish": "turbo run build && changeset publish"
  }
}
```

### `prebuild` Scripts That Manually Build Dependencies

Scripts like `prebuild` that manually build other packages bypass Turborepo's dependency graph.

```json
// WRONG - manually building dependencies
{
  "scripts": {
    "prebuild": "cd ../../packages/types && bun run build && cd ../utils && bun run build",
    "build": "next build"
  }
}
```

**However, the fix depends on whether workspace dependencies are declared:**

1. **If dependencies ARE declared** (e.g., `"@repo/types": "workspace:*"` in package.json), remove the `prebuild` script. Turbo's `dependsOn: ["^build"]` handles this automatically.

2. **If dependencies are NOT declared**, the `prebuild` exists because `^build` won't trigger without a dependency relationship. The fix is to:
   - Add the dependency to package.json: `"@repo/types": "workspace:*"`
   - Then remove the `prebuild` script

```json
// CORRECT - declare dependency, let turbo handle build order
// package.json
{
  "dependencies": {
    "@repo/types": "workspace:*",
    "@repo/utils": "workspace:*"
  },
  "scripts": {
    "build": "next build"
  }
}

// turbo.json
{
  "tasks": {
    "build": {
      "dependsOn": ["^build"]
    }
  }
}
```

**Key insight:** `^build` only runs build in packages listed as dependencies. No dependency declaration = no automatic build ordering.

### Overly Broad `globalDependencies`

`globalDependencies` affects ALL tasks in ALL packages via the **global hash** — tasks cannot opt out of specific files, even with negation globs in `inputs`. Be specific.

```json
// WRONG - heavy hammer, affects all hashes
{
  "globalDependencies": ["**/.env.*local"]
}

// BETTER - move to task-level inputs
{
  "globalDependencies": [".env"],
  "tasks": {
    "build": {
      "inputs": ["$TURBO_DEFAULT$", ".env*"],
      "outputs": ["dist/**"]
    }
  }
}
```

With `futureFlags.globalConfiguration`, this problem is reduced because `global.inputs` files are folded into each task's inputs (not the global hash). Tasks can exclude specific files:

```json
// BEST - global.inputs with per-task exclusion
{
  "futureFlags": { "globalConfiguration": true },
  "global": {
    "inputs": [".env"]
  },
  "tasks": {
    "build": { "outputs": ["dist/**"] },
    "lint": {
      "inputs": ["$TURBO_DEFAULT$", "!$TURBO_ROOT$/.env"]
    }
  }
}
```

### Repetitive Task Configuration

Look for repeated configuration across tasks that can be collapsed. Turborepo supports shared configuration patterns.

```json
// WRONG - repetitive env and inputs across tasks
{
  "tasks": {
    "build": {
      "env": ["API_URL", "DATABASE_URL"],
      "inputs": ["$TURBO_DEFAULT$", ".env*"]
    },
    "test": {
      "env": ["API_URL", "DATABASE_URL"],
      "inputs": ["$TURBO_DEFAULT$", ".env*"]
    },
    "dev": {
      "env": ["API_URL", "DATABASE_URL"],
      "inputs": ["$TURBO_DEFAULT$", ".env*"],
      "cache": false,
      "persistent": true
    }
  }
}

// BETTER - use globalEnv and globalDependencies for shared config
{
  "globalEnv": ["API_URL", "DATABASE_URL"],
  "globalDependencies": [".env*"],
  "tasks": {
    "build": {},
    "test": {},
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

**When to use global vs task-level:**

- `globalEnv` / `globalDependencies` - affects ALL tasks, use for truly shared config
- Task-level `env` / `inputs` - use when only specific tasks need it

### NOT an Anti-Pattern: Large `env` Arrays

A large `env` array (even 50+ variables) is **not** a problem. It usually means the user was thorough about declaring their build's environment dependencies. Do not flag this as an issue.

### Using `--parallel` Flag

The `--parallel` flag bypasses Turborepo's dependency graph. It is deprecated and will be removed in a future major version—use task configuration (`persistent`, `with`) instead.

```bash
# WRONG - bypasses dependency graph
turbo run lint --parallel

# CORRECT - configure tasks to allow parallel execution
# In turbo.json, set dependsOn appropriately (or use transit nodes)
turbo run lint
```

### Package-Specific Task Overrides in Root turbo.json

When multiple packages need different task configurations, use **Package Configurations** (`turbo.json` in each package) instead of cluttering root `turbo.json` with `package#task` overrides.

```json
// WRONG - root turbo.json with many package-specific overrides
{
  "tasks": {
    "test": { "dependsOn": ["build"] },
    "@repo/web#test": { "outputs": ["coverage/**"] },
    "@repo/api#test": { "outputs": ["coverage/**"] },
    "@repo/utils#test": { "outputs": [] },
    "@repo/cli#test": { "outputs": [] },
    "@repo/core#test": { "outputs": [] }
  }
}

// CORRECT - use Package Configurations
// Root turbo.json - base config only
{
  "tasks": {
    "test": { "dependsOn": ["build"] }
  }
}

// packages/web/turbo.json - package-specific override
{
  "extends": ["//"],
  "tasks": {
    "test": { "outputs": ["coverage/**"] }
  }
}

// packages/api/turbo.json
{
  "extends": ["//"],
  "tasks": {
    "test": { "outputs": ["coverage/**"] }
  }
}
```

**Benefits of Package Configurations:**

- Keeps configuration close to the code it affects
- Root turbo.json stays clean and focused on base patterns
- Easier to understand what's special about each package
- Works with `$TURBO_EXTENDS$` to inherit + extend arrays

**When to use `package#task` in root:**

- Single package needs a unique dependency (e.g., `"deploy": { "dependsOn": ["web#build"] }`)
- Temporary override while migrating

### Using `../` to Traverse Out of Package in `inputs`

Don't use relative paths like `../` to reference files outside the package. Use `$TURBO_ROOT$` instead.

```json
// WRONG - traversing out of package
{
  "tasks": {
    "build": {
      "inputs": ["$TURBO_DEFAULT$", "../shared-config.json"]
    }
  }
}

// CORRECT - use $TURBO_ROOT$ for repo root
{
  "tasks": {
    "build": {
      "inputs": ["$TURBO_DEFAULT$", "$TURBO_ROOT$/shared-config.json"]
    }
  }
}
```

### Missing `outputs` for File-Producing Tasks

**Before flagging missing `outputs`, check what the task actually produces:**

1. Read the package's script (e.g., `"build": "tsc"`, `"test": "vitest"`)
2. Determine if it writes files to disk or only outputs to stdout
3. Only flag if the task produces files that should be cached

```json
// WRONG: build produces files but they're not cached
{
  "tasks": {
    "build": {
      "dependsOn": ["^build"]
    }
  }
}

// CORRECT: build outputs are cached
{
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    }
  }
}
```

Common outputs by framework:

- Next.js: `[".next/**", "!.next/cache/**", "!.next/dev/**"]`
- Vite/Rollup: `["dist/**"]`
- tsc: `["dist/**"]` or custom `outDir`

**TypeScript `--noEmit` can still produce cache files:**

When `incremental: true` in tsconfig.json, `tsc --noEmit` writes `.tsbuildinfo` files even without emitting JS. Check the tsconfig before assuming no outputs:

```json
// If tsconfig has incremental: true, tsc --noEmit produces cache files
{
  "tasks": {
    "typecheck": {
      "outputs": ["node_modules/.cache/tsbuildinfo.json"] // or wherever tsBuildInfoFile points
    }
  }
}
```

To determine correct outputs for TypeScript tasks:

1. Check if `incremental` or `composite` is enabled in tsconfig
2. Check `tsBuildInfoFile` for custom cache location (default: alongside `outDir` or in project root)
3. If no incremental mode, `tsc --noEmit` produces no files

### `^build` vs `build` Confusion

```json
{
  "tasks": {
    // ^build = run build in DEPENDENCIES first (other packages this one imports)
    "build": {
      "dependsOn": ["^build"]
    },
    // build (no ^) = run build in SAME PACKAGE first
    "test": {
      "dependsOn": ["build"]
    },
    // pkg#task = specific package's task
    "deploy": {
      "dependsOn": ["web#build"]
    }
  }
}
```

### Environment Variables Not Hashed

```json
// WRONG: API_URL changes won't cause rebuilds
{
  "tasks": {
    "build": {
      "outputs": ["dist/**"]
    }
  }
}

// CORRECT: API_URL changes invalidate cache
{
  "tasks": {
    "build": {
      "outputs": ["dist/**"],
      "env": ["API_URL", "API_KEY"]
    }
  }
}
```

### `.env` Files Not in Inputs

Turbo does NOT load `.env` files - your framework does. But Turbo needs to know about changes:

```json
// WRONG: .env changes don't invalidate cache
{
  "tasks": {
    "build": {
      "env": ["API_URL"]
    }
  }
}

// CORRECT: .env file changes invalidate cache
{
  "tasks": {
    "build": {
      "env": ["API_URL"],
      "inputs": ["$TURBO_DEFAULT$", ".env", ".env.*"]
    }
  }
}
```

### Root `.env` File in Monorepo

A `.env` file at the repo root is an anti-pattern — even for small monorepos or starter templates. It creates implicit coupling between packages and makes it unclear which packages depend on which variables.

```
// WRONG - root .env affects all packages implicitly
my-monorepo/
├── .env              # Which packages use this?
├── apps/
│   ├── web/
│   └── api/
└── packages/

// CORRECT - .env files in packages that need them
my-monorepo/
├── apps/
│   ├── web/
│   │   └── .env      # Clear: web needs DATABASE_URL
│   └── api/
│       └── .env      # Clear: api needs API_KEY
└── packages/
```

**Problems with root `.env`:**

- Unclear which packages consume which variables
- All packages get all variables (even ones they don't need)
- Cache invalidation is coarse-grained (root .env change invalidates everything)
- Security risk: packages may accidentally access sensitive vars meant for others
- Bad habits start small — starter templates should model correct patterns

**If you must share variables**, use `globalEnv` to be explicit about what's shared, and document why.

### Strict Mode Filtering CI Variables

By default, Turborepo filters environment variables to only those in `env`/`globalEnv`. CI variables may be missing:

```json
// If CI scripts need GITHUB_TOKEN but it's not in env:
{
  "globalPassThroughEnv": ["GITHUB_TOKEN", "CI"],
  "tasks": {}
}
```

Or use `--env-mode=loose` (not recommended for production).

### Shared Code in Apps (Should Be a Package)

```
// WRONG: Shared code inside an app
apps/
  web/
    shared/          # This breaks monorepo principles!
      utils.ts

// CORRECT: Extract to a package
packages/
  utils/
    src/utils.ts
```

### Accessing Files Across Package Boundaries

```typescript
// WRONG: Reaching into another package's internals
import { Button } from "../../packages/ui/src/button";

// CORRECT: Install and import properly
import { Button } from "@repo/ui/button";
```

### Too Many Root Dependencies

```json
// WRONG: App dependencies in root
{
  "dependencies": {
    "react": "^18",
    "next": "^14"
  }
}

// CORRECT: Only repo tools in root
{
  "devDependencies": {
    "turbo": "latest"
  }
}
```

## Common Task Configurations

### Standard Build Pipeline

```json
{
  "$schema": "https://v2-10-11.turborepo.dev/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**", "!.next/cache/**", "!.next/dev/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

Add a `transit` task if you have tasks that need parallel execution with cache invalidation (see below).

### Dev Task with `^dev` Pattern (for `turbo watch`)

A `dev` task with `dependsOn: ["^dev"]` and `persistent: false` in root turbo.json may look unusual but is **correct for `turbo watch` workflows**:

```json
// Root turbo.json
{
  "tasks": {
    "dev": {
      "dependsOn": ["^dev"],
      "cache": false,
      "persistent": false  // Packages have one-shot dev scripts
    }
  }
}

// Package turbo.json (apps/web/turbo.json)
{
  "extends": ["//"],
  "tasks": {
    "dev": {
      "persistent": true  // Apps run long-running dev servers
    }
  }
}
```

**Why this works:**

- **Packages** (e.g., `@acme/db`, `@acme/validators`) have `"dev": "tsc"` — one-shot type generation that completes quickly
- **Apps** override with `persistent: true` for actual dev servers (Next.js, etc.)
- **`turbo watch`** re-runs the one-shot package `dev` scripts when source files change, keeping types in sync

**Intended usage:** Run `turbo watch dev` (not `turbo run dev`). Watch mode re-executes one-shot tasks on file changes while keeping persistent tasks running.

**Alternative pattern:** Use a separate task name like `prepare` or `generate` for one-shot dependency builds to make the intent clearer:

```json
{
  "tasks": {
    "prepare": {
      "dependsOn": ["^prepare"],
      "outputs": ["dist/**"]
    },
    "dev": {
      "dependsOn": ["prepare"],
      "cache": false,
      "persistent": true
    }
  }
}
```

### Transit Nodes for Parallel Tasks with Cache Invalidation

Some tasks can run in parallel (don't need built output from dependencies) but must invalidate cache when dependency source code changes.

**The problem with `dependsOn: ["^taskname"]`:**

- Forces sequential execution (slow)

**The problem with `dependsOn: []` (no dependencies):**

- Allows parallel execution (fast)
- But cache is INCORRECT - changing dependency source won't invalidate cache

**Transit Nodes solve both:**

```json
{
  "tasks": {
    "transit": { "dependsOn": ["^transit"] },
    "my-task": { "dependsOn": ["transit"] }
  }
}
```

The `transit` task creates dependency relationships without matching any actual script, so tasks run in parallel with correct cache invalidation.

**How to identify tasks that need this pattern:** Look for tasks that read source files from dependencies but don't need their build outputs.

### With Environment Variables

```json
{
  "globalEnv": ["NODE_ENV"],
  "globalDependencies": [".env"],
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"],
      "env": ["API_URL", "DATABASE_URL"]
    }
  }
}
```

With `futureFlags.globalConfiguration`, the same config moves global settings under `global` — and `.env` becomes a per-task input instead of a global hash input:

```json
{
  "futureFlags": { "globalConfiguration": true },
  "global": {
    "env": ["NODE_ENV"],
    "inputs": [".env"]
  },
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"],
      "env": ["API_URL", "DATABASE_URL"]
    }
  }
}
```

## Guide Index

- [Quick decision trees](#quick-decision-trees): task setup, cache diagnostics, filtering, environment variables, and workspace boundaries.
- [Critical anti-patterns](#critical-anti-patterns): concrete configuration mistakes and corrected examples.
- [Common task configurations](#common-task-configurations): build, dev/watch, and environment examples.
- [Transit nodes](#transit-nodes-for-parallel-tasks-with-cache-invalidation): parallel source-reading tasks with dependency-aware cache invalidation.

Detailed provider-specific CI, remote-cache setup, compilation strategies, and experimental boundary configuration are not bundled in this checkout. If those details are required, report the missing guidance rather than assuming local reference files or fetching them without authorization.

## Source Documentation

This skill is based on the official Turborepo documentation at:

- Source: `apps/docs/content/docs/` in the Turborepo repository
- Live: https://turborepo.dev/docs
