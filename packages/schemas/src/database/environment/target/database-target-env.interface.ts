import type { databaseTargetEnvSchema } from "@workspace/schemas/database/environment/target/database-target-env.schema";
import type { z } from "zod";

type ValidatedDatabaseTargetData = z.output<typeof databaseTargetEnvSchema>;

/** Contains the validated server, database, and TLS policy every database role connects to. */
export interface ValidatedDatabaseTarget extends ValidatedDatabaseTargetData {
  /** Identifies the trimmed PostgreSQL hostname or address. */
  DB_HOST: ValidatedDatabaseTargetData["DB_HOST"];
  /** Selects the validated PostgreSQL listening port. */
  DB_PORT: ValidatedDatabaseTargetData["DB_PORT"];
  /** Identifies the trimmed database name used for the connection. */
  DB_NAME: ValidatedDatabaseTargetData["DB_NAME"];
  /** Selects verified TLS or explicitly disabled TLS for the connection. */
  DB_SSL_MODE: ValidatedDatabaseTargetData["DB_SSL_MODE"];
}
