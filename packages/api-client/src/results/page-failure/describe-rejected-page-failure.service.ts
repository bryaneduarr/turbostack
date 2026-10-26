import type { FailedMutationState } from "@workspace/api-client/types/results/mutation-failure.interface";
import { SUPPORT_ERROR_CODE } from "@workspace/schemas/support/errors/codes/support-error-code.constant";

export function describeRejectedPageFailure(
  message: string,
): FailedMutationState {
  return {
    kind: "failed",
    message,
    reference: { code: SUPPORT_ERROR_CODE.PAGE_REJECTED, requestId: null },
  };
}
