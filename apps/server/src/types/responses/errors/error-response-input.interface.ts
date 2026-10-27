import type { ErrorResponse } from "@workspace/schemas/server/responses/errors/error-response.interface";

/** Supplies the request context and explicit HTTP failure classification. */
export interface ErrorResponseInput {
  /** Identifies the request whose correlation ID accompanies the response. */
  request: Request;
  /** Classifies the failure without exposing private exception details. */
  code: ErrorResponse["error"]["code"];
  /** Contains the client-safe summary, either standard or deliberately specific. */
  message: ErrorResponse["message"];
  /** Contains the actual HTTP error status, validated before serialization. */
  status: ErrorResponse["status"];
}
