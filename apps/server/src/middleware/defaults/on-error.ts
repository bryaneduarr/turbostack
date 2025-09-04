import type { ErrorHandler } from "hono";
import type { StatusCode } from "hono/utils/http-status";
import env from "@/env";
import { INTERNAL_SERVER_ERROR, OK } from "@/utils/http-status-codes";

/**
 * Global error handler for the application.
 *
 * This function handles errors thrown during request processing and returns a JSON response
 * with the error message, stack trace (if not in production), and appropriate HTTP status code.
 *
 * @param err - The error object thrown during request handling.
 * @param c - The context object, providing request/response utilities and environment variables.
 * @returns A JSON response containing the error details and HTTP status code.
 */
const onError: ErrorHandler = (err, c) => {
  // If the error has a current status code, use it. If not then create a new response with the default status.
  const currentStatus =
    "status" in err ? err.status : c.newResponse(null).status;

  // If the status code is not (OK 200) then use it an (INTERNAL_SERVER_ERROR 500)
  const statusCode =
    currentStatus !== OK
      ? (currentStatus as StatusCode)
      : INTERNAL_SERVER_ERROR;

  // Determine the current environment node.
  const nodeEnv = c.env.NODE_ENV || env.NODE_ENV;

  return c.json({
    message: err.message,
    stack: nodeEnv === "production" ? undefined : err.stack, // Stack error only shown in production.
    status: statusCode,
  });
};

export default onError;
