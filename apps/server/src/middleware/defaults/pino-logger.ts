import env from "@/env";
import { pinoLogger } from "hono-pino";
import pino from "pino";
import pretty from "pino-pretty";

/**
 * This module exports a Pino logger instance and Hono middleware.
 *
 * Configuration:
 * - Log level is set via the LOG_LEVEL environment variable, defaulting to 'info'.
 * - Uses 'pino-pretty', readable log formatting in development.
 * - Log output is colorized and includes timestamps in standard system format.
 * - The 'pid' and 'hostname' fields are omitted from log output for brevity.
 */

// Create the actual logger instance.
const logger = pino(
  {
    level: env.LOG_LEVEL || "info", // The log level we define in the '.env' file.
  },
  env.NODE_ENV === "production" ? undefined : pretty(), // Identify if we are in production, if not we will 'prettify the logs'
);

// Create the Hono middleware.
const honoLogger = pinoLogger({
  pino: logger, // Pass the custom logger settings from above.
  http: {
    referRequestIdKey: "requestId", // Used to reference a request ID in the logs.
  },
});

// Export both the logger and the middleware
export default logger;
export { honoLogger };
