import { databaseTargetEnvSchema } from "@workspace/schemas/database/environment/target/database-target-env.schema";
import { DATABASE_ROLES } from "@workspace/schemas/database/roles/database-role.constant";
import { z } from "zod";

export const databaseMigratorEnvSchema = databaseTargetEnvSchema.extend({
  /** Identifies the role that owns the schema and applies migrations. */
  DB_MIGRATOR_USER: z.literal(DATABASE_ROLES.migrator),
  /** Contains the migrator's nonempty password without trimming or transformation. */
  DB_MIGRATOR_PASSWORD: z.string().min(1),
  /** Fails a migration statement that waits longer than this many seconds for a table lock. */
  DB_MIGRATION_LOCK_TIMEOUT_SECONDS: z.coerce
    .number()
    .int()
    .positive()
    .default(10),
});
