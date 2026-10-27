import { describeApiFailure } from "@workspace/api-client/results/api-failure/describe-api-failure.service";
import { describeSupportReference } from "@workspace/api-client/results/support-reference/describe-support-reference.service";
import type { ApiFailureResult } from "@workspace/api-client/types/requests/send-api-request.interface";
import type { FailedMutationState } from "@workspace/api-client/types/results/mutation-failure.interface";

export function describeFailedMutation(
  result: ApiFailureResult,
): FailedMutationState {
  return {
    kind: "failed",
    message: describeApiFailure(result),
    reference: describeSupportReference(result),
  };
}
