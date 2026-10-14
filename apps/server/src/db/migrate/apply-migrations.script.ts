import { fileURLToPath } from "node:url";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import { databaseCredentials } from "@/db/config/environment/database-credentials.config";

// The build copies src/db/migrations into dist, so this path resolves in both.
const migrationsFolder = fileURLToPath(
  new URL("../migrations", import.meta.url),
);
const client = postgres({ ...databaseCredentials, max: 1 });

try {
  await migrate(drizzle({ client }), { migrationsFolder });
  console.info("Database migrations applied.");
} catch (error) {
  console.error("Database migrations failed.", error);
  process.exitCode = 1;
} finally {
  await client.end();
}
