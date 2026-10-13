import {
  MAX_HTTP_STATUS,
  OK,
} from "@workspace/utils/http/status-codes/http-status-code.constant";
import { z } from "zod";

export const responseEnvelopeSchema = z.object({
  /* Indicates which response variant determines the payload shape. */
  success: z.boolean().describe("Whether the request succeeded."),
  /* Provides a safe summary rather than a client branching discriminator. */
  message: z
    .string()
    .describe(
      "A safe summary. Clients should branch on status or error.code, not this text.",
    ),
  /* Contains route-specific data or the protocol's explicit failure null. */
  data: z
    .unknown()
    .nonoptional()
    .describe("Route-specific data on success; null on failure."),
  /* Contains a safe error classification or the protocol's explicit success null. */
  error: z
    .unknown()
    .nonoptional()
    .describe("A safe error code on failure; null on success."),
  /* Matches the actual HTTP response status. */
  status: z
    .number()
    .int()
    .min(OK)
    .max(MAX_HTTP_STATUS)
    .describe("The actual HTTP response status."),
  /* Correlates the response with server logs and the X-Request-ID header. */
  requestId: z
    .uuid()
    .describe(
      "Server-generated correlation ID, also returned in X-Request-ID.",
    ),
});
