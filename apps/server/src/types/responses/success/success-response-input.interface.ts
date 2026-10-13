import type { SuccessResponse } from "@workspace/schemas/server/responses/success/success-response.interface";
import type { z } from "zod";

/* Supplies a concrete schema and all required values for a JSON success response. */
export interface SuccessResponseInput<
  Schema extends z.ZodType<SuccessResponse>,
> {
  /* Identifies the request whose correlation ID accompanies the response. */
  request: Request;
  /* Validates the complete route-specific response before serialization. */
  schema: Schema;
  /* Contains route data before any schema transformations. */
  data: z.input<Schema> extends { data: infer Data } ? Data : never;
  /* Summarizes the completed operation without defining client branching logic. */
  message: SuccessResponse["message"];
  /* Contains the explicit HTTP success status, excluding bodyless statuses. */
  status: SuccessResponse["status"];
}
