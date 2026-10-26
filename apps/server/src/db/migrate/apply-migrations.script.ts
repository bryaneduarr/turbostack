import { fileURLToPath } from "node:url";
import { databaseMigratorCredentials } from "@workspace/database/config/environment/database-migrator-credentials.config";
import type { ValidatedDatabaseMigratorEnvironment } from "@workspace/schemas/database/environment/migrator/database-migrator-env.interface";
import { databaseMigratorEnvSchema } from "@workspace/schemas/database/environment/migrator/database-migrator-env.schema";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

const migratorEnv: ValidatedDatabaseMigratorEnvironment =
  databaseMigratorEnvSchema.parse(process.env);
// The build copies the database package's migrations into dist/db/migrations.
const migrationsFolder = fileURLToPath(
  new URL("../migrations", import.meta.url),
);
// Drizzle recreates its bookkeeping schema and table with IF NOT EXISTS on every run.
const alreadyExistsNoticeCodes = new Set(["42P06", "42P07"]);
// One connection keeps the advisory lock and lock timeout on the migrating session.
const client = postgres({
  ...databaseMigratorCredentials,
  max: 1,
  onnotice: (notice) => {
    const code = notice.code;
    if (code === undefined || !alreadyExistsNoticeCodes.has(code)) {
      console.warn(notice);
    }
  },
});

try {
  // Concurrent deployments wait here instead of applying the same migrations twice.
  await client`SELECT pg_advisory_lock(hashtext('api-server:migrations'))`;
  await client`SELECT set_config('lock_timeout', ${`${migratorEnv.DB_MIGRATION_LOCK_TIMEOUT_SECONDS}s`}, false)`;
  await migrate(drizzle({ client }), { migrationsFolder });
  console.info("Database migrations applied.");
} catch (error) {
  console.error("Database migrations failed.", error);
  process.exitCode = 1;
} finally {
  await client.end();
}
