import { databaseEnvSchema } from "@workspace/schemas/database/environment/database-env.schema";
import { z } from "zod";

export const serverEnvSchema = z
  .object({
    /* Contains the public base URL for the server. */
    SERVER_URL: z.url().describe("The base URL for the server."),
    /* Defines the allowed CORS origin, defaulting to local development. */
    CLIENT_URL: z
      .url()
      .default("http://localhost:3000")
      .describe("The allowed client origin for CORS."),
    /* Contains the listening port after numeric conversion and range validation. */
    PORT: z.coerce
      .number()
      .int()
      .min(1)
      .max(65535)
      .describe("The port the server runs on."),
    /* Limits how long active HTTP requests may drain before forced shutdown. */
    SHUTDOWN_TIMEOUT_SECONDS: z.coerce.number().int().positive().default(30),
    /* Selects environment-specific behavior and the default logging level. */
    NODE_ENV: z
      .enum(["development", "production"])
      .describe("The environment mode."),
    /* Allows an omitted raw override; the parsed output always has a concrete level. */
    LOG_LEVEL: z
      .enum(["info", "warn", "error", "debug", "fatal", "trace", "silent"])
      .optional()
      .describe(
        "The log level. Defaults to debug in development and info in production.",
      ),
  })
  .extend(databaseEnvSchema.shape)
  .transform((environment) => ({
    ...environment,
    LOG_LEVEL:
      environment.LOG_LEVEL ??
      (environment.NODE_ENV === "development" ? "debug" : "info"),
  }))
  .describe("Validated server environment with a required logging level.");
