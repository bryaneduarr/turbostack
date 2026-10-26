import { describeApiFailure } from "@workspace/api-client/results/api-failure/describe-api-failure.service";
import { describeSupportReference } from "@workspace/api-client/results/support-reference/describe-support-reference.service";
import { FailureAlert } from "@workspace/ui/components/feedback/failure-alert/failure-alert.component";
import type { ApiFailureAlertProps } from "@workspace/ui/types/components/feedback/api-failure-alert-props.interface";

export function ApiFailureAlert({ result }: ApiFailureAlertProps) {
  return (
    <FailureAlert
      message={describeApiFailure(result)}
      reference={describeSupportReference(result)}
    />
  );
}
