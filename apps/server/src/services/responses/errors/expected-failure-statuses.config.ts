import type { ErrorResponse } from "@workspace/schemas/server/responses/errors/error-response.interface";
import {
  CONFLICT,
  FORBIDDEN,
  NOT_FOUND,
  SERVICE_UNAVAILABLE,
  UNAUTHORIZED,
} from "@workspace/utils/http/status-codes/http-status-code.constant";

// Each code that route logic may raise deliberately maps to exactly one status.
export const expectedFailureStatuses = {
  UNAUTHORIZED,
  FORBIDDEN,
  NOT_FOUND,
  CONFLICT,
  SERVICE_UNAVAILABLE,
} as const satisfies Partial<
  Record<ErrorResponse["error"]["code"], ErrorResponse["status"]>
>;
