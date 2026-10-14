import type { SuccessResponse } from "@workspace/schemas/server/responses/success/success-response.interface";
import type { z } from "zod";

/* Describes one API endpoint so the server and its clients share a single typed contract. */
export interface RouteDefinition {
  /* Selects the HTTP method the server registers and clients send. */
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  /* Contains the full request path, including any version prefix and `:name` path parameters. */
  path: `/${string}`;
  /* Validates path parameters, or null when the path declares none. */
  params: z.ZodObject | null;
  /* Validates query-string values, or null when the route reads no query string. */
  query: z.ZodObject | null;
  /* Validates the JSON request body, or null when the route accepts no body. */
  body: z.ZodType | null;
  /* Validates the complete success envelope the route returns. */
  response: z.ZodType<SuccessResponse>;
}

/* Resolves the raw value a caller supplies for one route input, or null when the route declares none. */
export type RouteInput<InputSchema extends z.ZodType | null> =
  InputSchema extends z.ZodType ? z.input<InputSchema> : null;
