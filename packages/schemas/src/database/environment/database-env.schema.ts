import { z } from "zod";

export const databaseEnvSchema = z.object({
  /** Identifies the PostgreSQL host after trimming surrounding whitespace. */
  DB_HOST: z.string().trim().min(1),
  /** Selects the PostgreSQL port after integer conversion and range validation. */
  DB_PORT: z.coerce.number().int().min(1).max(65535),
  /** Identifies the database account after trimming surrounding whitespace. */
  DB_USER: z.string().trim().min(1),
  /** Contains the nonempty database password without trimming or transformation. */
  DB_PASSWORD: z.string().min(1),
  /** Selects the database after trimming surrounding whitespace. */
  DB_NAME: z.string().trim().min(1),
  /** Controls connection TLS, defaulting to full certificate and hostname verification. */
  DB_SSL_MODE: z.enum(["disable", "verify-full"]).default("verify-full"),
  /** Limits the number of connections in each process's database pool. */
  DB_POOL_MAX: z.coerce.number().int().positive().default(10),
  /** Limits connection establishment time in seconds, not query execution time. */
  DB_CONNECT_TIMEOUT_SECONDS: z.coerce.number().int().positive().default(10),
  /** Closes idle connections after this many seconds; zero keeps them open. */
  DB_IDLE_TIMEOUT_SECONDS: z.coerce.number().int().nonnegative().default(0),
  /** Enables prepared statements by default and accepts only true or false overrides. */
  DB_PREPARE: z
    .stringbool({ truthy: ["true"], falsy: ["false"] })
    .default(true),
  /** Bounds the time in seconds allowed for database queries to finish during cleanup. */
  DB_SHUTDOWN_TIMEOUT_SECONDS: z.coerce.number().int().positive().default(5),
  /** Cancels application queries running longer than this many seconds; zero disables the limit. */
  DB_STATEMENT_TIMEOUT_SECONDS: z.coerce
    .number()
    .int()
    .nonnegative()
    .default(30),
  /** Fails a migration statement that waits longer than this many seconds for a table lock. */
  DB_MIGRATION_LOCK_TIMEOUT_SECONDS: z.coerce
    .number()
    .int()
    .positive()
    .default(10),
});
