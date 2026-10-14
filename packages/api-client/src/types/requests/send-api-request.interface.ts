import type { ErrorResponse } from "@workspace/schemas/server/responses/errors/error-response.interface";
import type {
  RouteDefinition,
  RouteInput,
} from "@workspace/schemas/server/routes/definition/route-definition.interface";
import type { z } from "zod";

/* Describes one request to an API route, with every route input declared explicitly. */
export interface SendApiRequestInput<Route extends RouteDefinition> {
  /* Identifies the API origin, such as the configured server URL. */
  baseUrl: string;
  /* Supplies the shared route definition that fixes the method, path, inputs, and response schema. */
  route: Route;
  /* Contains the path parameter values, or null when the route declares none. */
  params: RouteInput<Route["params"]>;
  /* Contains the query-string values, or null when the route reads no query string. */
  query: RouteInput<Route["query"]>;
  /* Contains the JSON request body, or null when the route accepts no body. */
  body: RouteInput<Route["body"]>;
  /* Supplies fetch options such as headers, caching, and abort signals; the route controls method and body. */
  init: Omit<RequestInit, "method" | "body">;
}

/* Represents every outcome of an API request so callers handle each one explicitly. */
export type ApiResult<Route extends RouteDefinition> =
  | { kind: "success"; response: z.output<Route["response"]> }
  | { kind: "failure"; response: ErrorResponse }
  | { kind: "unexpected-response"; status: number }
  | { kind: "unreachable"; cause: unknown };

/* Represents every unsuccessful API outcome, which does not depend on the route. */
export type ApiFailureResult = Exclude<
  ApiResult<RouteDefinition>,
  { kind: "success" }
>;
