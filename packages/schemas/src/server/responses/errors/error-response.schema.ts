import { responseEnvelopeSchema } from "@workspace/schemas/server/responses/envelope/response-envelope.schema";
import {
  BAD_REQUEST,
  MAX_HTTP_STATUS,
} from "@workspace/utils/http/status-codes/http-status-code.constant";
import { z } from "zod";

export const errorResponseSchema = responseEnvelopeSchema.extend({
  /* Discriminates failures from success responses. */
  success: z.literal(false),
  /* Explicitly marks the absence of success data in the published envelope. */
  data: z.null(),
  /* Contains only the safe classification, never raw exception details. */
  error: z.object({
    /* Classifies the failure for client branching without message matching. */
    code: z.enum([
      "NOT_FOUND",
      "VALIDATION",
      "PARSE",
      "UNAUTHORIZED",
      "FORBIDDEN",
      "REQUEST_ERROR",
      "INTERNAL_SERVER_ERROR",
    ]),
  }),
  /* Requires an HTTP error status rather than a success or redirect status. */
  status: z.number().int().min(BAD_REQUEST).max(MAX_HTTP_STATUS),
});
