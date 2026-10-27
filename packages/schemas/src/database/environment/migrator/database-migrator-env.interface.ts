import type { databaseMigratorEnvSchema } from "@workspace/schemas/database/environment/migrator/database-migrator-env.schema";
import type { z } from "zod";

type ValidatedDatabaseMigratorData = z.output<typeof databaseMigratorEnvSchema>;

/** Contains the validated settings that migrations, Drizzle Kit, and the development seed connect with. */
export interface ValidatedDatabaseMigratorEnvironment
  extends ValidatedDatabaseMigratorData {
  /** Identifies the schema-owning migrator role. */
  DB_MIGRATOR_USER: ValidatedDatabaseMigratorData["DB_MIGRATOR_USER"];
  /** Contains the migrator's password preserved without transformation. */
  DB_MIGRATOR_PASSWORD: ValidatedDatabaseMigratorData["DB_MIGRATOR_PASSWORD"];
  /** Limits how long a migration statement waits for a table lock in seconds. */
  DB_MIGRATION_LOCK_TIMEOUT_SECONDS: ValidatedDatabaseMigratorData["DB_MIGRATION_LOCK_TIMEOUT_SECONDS"];
}
