import type { RouteDefinition } from "@workspace/schemas/server/routes/definition/route-definition.interface";
import { healthLiveResponseSchema } from "@workspace/schemas/server/routes/health/live/health-live-response.schema";

export const healthLiveRoute = {
  method: "GET",
  path: "/health/live",
  params: null,
  query: null,
  body: null,
  response: healthLiveResponseSchema,
} as const satisfies RouteDefinition;
