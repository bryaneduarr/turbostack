import { createRoute, z } from "@hono/zod-openapi";
import { jsonContent } from "@/middleware/defaults/json-content";
import { INTERNAL_SERVER_ERROR, OK } from "@/utils/http-status-codes";

// Response schema for the route, defining the structure of the response object.
const responseSchema = z.object({
  error: z.record(z.string(), z.array(z.string())),
  message: z.string(),
  success: z.boolean(),
});

// Okay response when fetching a good request.
const ok = jsonContent(
  responseSchema.openapi({
    description: "Correct response by the request.",
    example: {
      error: {},
      message: "Hello World!",
      success: true,
    },
  }),
  "The response for saying hello world was successful.",
);

// Internal server error response when an unexpected server error happens.
const internalServerError = jsonContent(
  responseSchema.openapi({
    description: "Unexpected server error.",
    example: {
      error: {
        server: ["An unexpected error occurred while processing the request."],
      },
      message: "Internal server error.",
      success: false,
    },
  }),
  "Internal server error, something went wrong on the server.",
);

/**
 * Defines a route that responds with a hello world to verify that the server is working.
 *
 * @route GET /hello-world
 * @tags Hello World
 * @summary Say hello world
 * @description Respond with a hello world to check if the route is working.
 * @responses
 *   - 200 OK: Response resolved correctly.
 *   - 500 INTERNAL_SERVER_ERROR: Unexpected server error.
 */
export const helloWorldRoute = createRoute({
  path: "/hello-world",
  method: "get",
  tags: ["Hello World"],
  summary: "Say Hello, World!",
  description: "Respond with a hello world to check if the route is working.",
  responses: {
    [OK]: ok,
    [INTERNAL_SERVER_ERROR]: internalServerError,
  },
});

export type HelloWorldRoute = typeof helloWorldRoute;
