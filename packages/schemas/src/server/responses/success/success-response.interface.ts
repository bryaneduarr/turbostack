import type { successResponseSchema } from "@workspace/schemas/server/responses/success/success-response.schema";
import type { z } from "zod";

/** Defines the success composition base; endpoints must supply concrete data schemas. */
export interface SuccessResponse
  extends z.output<typeof successResponseSchema> {}
