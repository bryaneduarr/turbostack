import { AppBindings } from "@/types/openapi";
import { UNPROCESSABLE_ENTITY } from "@/utils/http-status-codes";
import { Hook, OpenAPIHono } from "@hono/zod-openapi";

/**
 * Default validation hook for Zod OpenAPI integration.
 *
 * Handles validation failures by returning a standardized JSON error response
 * with HTTP 422 (Unprocessable Entity) status code when validation fails.
 *
 * @param result - The validation result from Zod schema validation
 * @param c - The Hono context object for handling HTTP requests/responses
 * @returns JSON response with error details and 422 status code if validation fails,
 *          otherwise returns undefined to continue processing
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const defaultHook: Hook<any, any, any, any> = (result, c) => {
  if (!result.success) {
    return c.json(
      {
        success: result.success,
        error: result.error,
      },
      UNPROCESSABLE_ENTITY, // 422 status.
    );
  }
};

/**
 * Creates and returns a new instance of OpenAPIHono router for the application.
 *
 * @returns {OpenAPIHono<AppBindings>} An instance of OpenAPIHono configured with strict mode disabled.
 */
export function createRouter(): OpenAPIHono<AppBindings> {
  return new OpenAPIHono<AppBindings>({
    defaultHook, // Custom default hook for handling OpenAPI operations.
  });
}
