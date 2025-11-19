import { config } from "dotenv";
import { z } from "zod";

config();

/**
 * -- Zod schema for server environment variables. --
 *
 * Throws an error if any required variable is missing or invalid.
 */
const EnvSchema = z
  .object({
    // Add all of the ENV variables to check and have type safety.
    SERVER_URL: z.url().describe("The base URL for the server."),
    PORT: z.coerce.number().describe("The port the server runs on."),
    NODE_ENV: z
      .enum(["development", "production", "test"])
      .describe("The environment mode."),
    LOG_LEVEL: z
      .enum(["info", "warn", "error", "debug", "fatal", "trace", "silent"])
      .describe("The log level used in pino-logger."),
  })
  .describe("Server environment variables schema.");

// Parse and validate environment variables. Here we check if we really have the variables in '.env'.
const env = EnvSchema.parse(process.env);

export type Env = z.infer<typeof EnvSchema>;
export default env;
