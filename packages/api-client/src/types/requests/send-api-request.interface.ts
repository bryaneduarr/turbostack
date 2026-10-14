import type { ErrorResponse } from "@workspace/schemas/server/responses/errors/error-response.interface";
import type { SuccessResponse } from "@workspace/schemas/server/responses/success/success-response.interface";
import type { z } from "zod";

/* Describes one JSON request to the API and the schema of its success envelope. */
export interface SendApiRequestInput<
  Schema extends z.ZodType<SuccessResponse>,
> {
  /* Identifies the API origin, such as the configured public server URL. */
  baseUrl: string;
  /* Identifies the endpoint path, including the API version prefix when present. */
  path: string;
  /* Supplies the HTTP method, headers, and body passed to fetch. */
  init: RequestInit;
  /* Validates the route-specific success envelope. */
  schema: Schema;
}

/* Represents a validated API response as either route data or a documented failure. */
export type ApiResult<Schema extends z.ZodType<SuccessResponse>> =
  | { kind: "success"; response: z.output<Schema> }
  | { kind: "failure"; response: ErrorResponse };
