import type { ErrorResponse } from "@workspace/schemas/server/responses/errors/error-response.interface";

export const errorResponseMessages = {
  NOT_FOUND: "Not found.",
  VALIDATION: "Invalid request input.",
  PARSE: "Malformed request.",
  UNAUTHORIZED: "Authentication required.",
  FORBIDDEN: "Access denied.",
  REQUEST_ERROR: "Request rejected.",
  INTERNAL_SERVER_ERROR: "Internal server error.",
} satisfies Record<ErrorResponse["error"]["code"], ErrorResponse["message"]>;
