// Migrations grant privileges to these exact names, so they are fixed rather than configurable.
export const DATABASE_ROLES = {
  migrator: "app_migrator",
  runtime: "app_runtime",
  cli: "app_cli",
} as const;
