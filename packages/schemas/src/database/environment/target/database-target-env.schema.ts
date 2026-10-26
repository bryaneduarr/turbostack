import { z } from "zod";

export const databaseTargetEnvSchema = z.object({
  /** Identifies the PostgreSQL host after trimming surrounding whitespace. */
  DB_HOST: z.string().trim().min(1),
  /** Selects the PostgreSQL port after integer conversion and range validation. */
  DB_PORT: z.coerce.number().int().min(1).max(65535),
  /** Selects the database after trimming surrounding whitespace. */
  DB_NAME: z.string().trim().min(1),
  /** Controls connection TLS, defaulting to full certificate and hostname verification. */
  DB_SSL_MODE: z.enum(["disable", "verify-full"]).default("verify-full"),
});
