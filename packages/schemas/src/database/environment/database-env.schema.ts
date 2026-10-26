import { databaseTargetEnvSchema } from "@workspace/schemas/database/environment/target/database-target-env.schema";
import { DATABASE_ROLES } from "@workspace/schemas/database/roles/database-role.constant";
import { z } from "zod";

export const databaseEnvSchema = databaseTargetEnvSchema.extend({
  /** Identifies the API's least-privilege database role, which migrations grant access to. */
  DB_USER: z.literal(DATABASE_ROLES.runtime),
  /** Contains the nonempty database password without trimming or transformation. */
  DB_PASSWORD: z.string().min(1),
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
});
