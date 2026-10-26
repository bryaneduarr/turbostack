import type { ApiFailureResult } from "@workspace/api-client/types/requests/send-api-request.interface";
import {
  API_SUPPORT_ERROR_CODE,
  SUPPORT_ERROR_CODE,
} from "@workspace/schemas/support/errors/codes/support-error-code.constant";
import type { SupportReference } from "@workspace/schemas/support/errors/codes/support-reference.interface";

export function describeSupportReference(
  result: ApiFailureResult,
): SupportReference {
  if (result.kind === "failure") {
    return {
      code: API_SUPPORT_ERROR_CODE[result.response.error.code],
      requestId: result.response.requestId,
    };
  }
  if (result.kind === "unexpected-response") {
    return {
      code: SUPPORT_ERROR_CODE.NET_UNEXPECTED_RESPONSE,
      requestId: result.requestId,
    };
  }
  return { code: SUPPORT_ERROR_CODE.NET_UNREACHABLE, requestId: null };
}
