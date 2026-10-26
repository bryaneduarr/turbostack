// Adding a role is an architecture decision; update the structure rules with it.
export const fileRoles: ReadonlySet<string> = new Set([
  "action",
  "check",
  "column",
  "component",
  "config",
  "constant",
  "contract",
  "e2e",
  "error",
  "fixture",
  "handler",
  "hook",
  "interface",
  "middleware",
  "module",
  "route",
  "router",
  "schema",
  "script",
  "service",
  "table",
  "test",
]);

export const nextAppFileNames: ReadonlySet<string> = new Set([
  "default.tsx",
  "error.tsx",
  "global-error.tsx",
  "layout.tsx",
  "loading.tsx",
  "not-found.tsx",
  "page.tsx",
  "route.ts",
  "template.tsx",
]);

export const nextRootFileNames: ReadonlySet<string> = new Set([
  "instrumentation-client.ts",
  "instrumentation.ts",
  "proxy.ts",
  "proxy.test.ts",
]);

export const nextAppPattern = /^apps\/[a-z-]+\/src\/app\//;

export const nextRootPattern = /^apps\/[a-z-]+\/src\/[^/]+$/;
