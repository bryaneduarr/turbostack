import type { databaseEnvSchema } from "@workspace/schemas/database/environment/database-env.schema";
import type { z } from "zod";

type ValidatedDatabaseEnvironmentData = z.output<typeof databaseEnvSchema>;

/** Contains validated PostgreSQL environment settings with defaults resolved. */
export interface ValidatedDatabaseEnvironment
  extends ValidatedDatabaseEnvironmentData {
  /** Identifies the trimmed PostgreSQL hostname or address. */
  DB_HOST: ValidatedDatabaseEnvironmentData["DB_HOST"];
  /** Selects the validated PostgreSQL listening port. */
  DB_PORT: ValidatedDatabaseEnvironmentData["DB_PORT"];
  /** Identifies the trimmed database account used to authenticate. */
  DB_USER: ValidatedDatabaseEnvironmentData["DB_USER"];
  /** Contains the database password preserved without transformation. */
  DB_PASSWORD: ValidatedDatabaseEnvironmentData["DB_PASSWORD"];
  /** Identifies the trimmed database name used for the connection. */
  DB_NAME: ValidatedDatabaseEnvironmentData["DB_NAME"];
  /** Selects verified TLS or explicitly disabled TLS for the connection. */
  DB_SSL_MODE: ValidatedDatabaseEnvironmentData["DB_SSL_MODE"];
  /** Limits the connections allocated to the process's pool. */
  DB_POOL_MAX: ValidatedDatabaseEnvironmentData["DB_POOL_MAX"];
  /** Limits connection establishment time in seconds. */
  DB_CONNECT_TIMEOUT_SECONDS: ValidatedDatabaseEnvironmentData["DB_CONNECT_TIMEOUT_SECONDS"];
  /** Limits idle connection lifetime in seconds, with zero keeping connections open. */
  DB_IDLE_TIMEOUT_SECONDS: ValidatedDatabaseEnvironmentData["DB_IDLE_TIMEOUT_SECONDS"];
  /** Controls whether queries use prepared statements. */
  DB_PREPARE: ValidatedDatabaseEnvironmentData["DB_PREPARE"];
  /** Limits query-drain time in seconds when closing the pool. */
  DB_SHUTDOWN_TIMEOUT_SECONDS: ValidatedDatabaseEnvironmentData["DB_SHUTDOWN_TIMEOUT_SECONDS"];
  /** Limits each application query in seconds, with zero disabling the limit. */
  DB_STATEMENT_TIMEOUT_SECONDS: ValidatedDatabaseEnvironmentData["DB_STATEMENT_TIMEOUT_SECONDS"];
  /** Limits how long a migration statement waits for a table lock in seconds. */
  DB_MIGRATION_LOCK_TIMEOUT_SECONDS: ValidatedDatabaseEnvironmentData["DB_MIGRATION_LOCK_TIMEOUT_SECONDS"];
}
