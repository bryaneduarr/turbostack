import { describeApiFailure } from "@workspace/api-client/results/api-failure/describe-api-failure.service";
import { describeSupportReference } from "@workspace/api-client/results/support-reference/describe-support-reference.service";
import type { ApiFailureResult } from "@workspace/api-client/types/requests/send-api-request.interface";

export function createApiFailureError(result: ApiFailureResult): Error {
  const { code, requestId } = describeSupportReference(result);

  return new Error(
    `${describeApiFailure(result)} Support code: ${code}. Request ID: ${requestId ?? "none"}.`,
  );
}
