import type { RouteDefinition } from "@workspace/schemas/server/routes/definition/route-definition.interface";
import { healthReadyResponseSchema } from "@workspace/schemas/server/routes/health/ready/health-ready-response.schema";

export const healthReadyRoute = {
  method: "GET",
  path: "/health/ready",
  params: null,
  query: null,
  body: null,
  response: healthReadyResponseSchema,
} as const satisfies RouteDefinition;
