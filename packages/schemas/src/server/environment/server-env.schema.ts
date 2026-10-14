import { databaseEnvSchema } from "@workspace/schemas/database/environment/database-env.schema";
import { z } from "zod";

// Tests stay quiet unless a run explicitly overrides LOG_LEVEL.
const defaultLogLevels = {
  development: "debug",
  test: "silent",
  production: "info",
} as const;

export const serverEnvSchema = z
  .object({
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
    /* Rejects request bodies larger than this many bytes, defaulting to 1 MiB. */
    MAX_REQUEST_BODY_BYTES: z.coerce
      .number()
      .int()
      .positive()
      .default(1_048_576)
      .describe("The maximum accepted request body size in bytes."),
    /* Selects environment-specific behavior, logging defaults, and docs exposure. */
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .describe("The environment mode."),
    /* Allows an omitted raw override; the parsed output always has a concrete level. */
    LOG_LEVEL: z
      .enum(["info", "warn", "error", "debug", "fatal", "trace", "silent"])
      .optional()
      .describe(
        "The log level. Defaults to debug in development, silent in test, and info in production.",
      ),
    /* Allows an omitted raw override; the parsed output always decides docs exposure. */
    OPENAPI_ENABLED: z
      .stringbool({ truthy: ["true"], falsy: ["false"] })
      .optional()
      .describe(
        "Whether the OpenAPI document and reference are served. Defaults to false in production.",
      ),
  })
  .extend(databaseEnvSchema.shape)
  .transform((environment) => ({
    ...environment,
    LOG_LEVEL: environment.LOG_LEVEL ?? defaultLogLevels[environment.NODE_ENV],
    OPENAPI_ENABLED:
      environment.OPENAPI_ENABLED ?? environment.NODE_ENV !== "production",
  }))
  .describe(
    "Validated server environment with a required logging level and docs exposure.",
  );
