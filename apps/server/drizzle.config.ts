import { defineConfig } from "drizzle-kit";
import { databaseCredentials } from "@/db/config/environment/database-credentials.config";

export default defineConfig({
  schema: "./src/db/tables/users/profile/user-profile.table.ts",
  out: "./src/db/migrations",
  dialect: "postgresql",
  dbCredentials: databaseCredentials,
});
