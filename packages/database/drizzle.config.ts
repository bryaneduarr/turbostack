import { databaseMigratorCredentials } from "@workspace/database/config/environment/database-migrator-credentials.config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/tables/**/*.table.ts",
  out: "./src/migrations",
  dialect: "postgresql",
  dbCredentials: databaseMigratorCredentials,
});
