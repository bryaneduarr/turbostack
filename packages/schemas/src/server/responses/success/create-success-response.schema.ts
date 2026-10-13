import { responseEnvelopeSchema } from "@workspace/schemas/server/responses/envelope/response-envelope.schema";
import {
  MULTIPLE_CHOICES,
  NON_AUTHORITATIVE_INFORMATION,
  OK,
  PARTIAL_CONTENT,
} from "@workspace/utils/http/status-codes/http-status-code.constant";
import { z } from "zod";

export function createSuccessResponseSchema<DataSchema extends z.ZodType>(
  dataSchema: DataSchema,
) {
  return responseEnvelopeSchema.extend({
    /* Discriminates validated route data from error responses. */
    success: z.literal(true),
    /* Requires the route's concrete payload, allowing null only if that route defines it. */
    data: dataSchema.nonoptional(),
    /* Explicitly marks the absence of an error in the published envelope. */
    error: z.null(),
    /* Excludes bodyless success statuses because they cannot carry JSON envelopes. */
    status: z.union([
      z.number().int().min(OK).max(NON_AUTHORITATIVE_INFORMATION),
      z.number().int().min(PARTIAL_CONTENT).lt(MULTIPLE_CHOICES),
    ]),
  });
}
