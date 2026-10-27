import { Alert } from "@workspace/ui/components/feedback/alert/alert.component";
import { ErrorReference } from "@workspace/ui/components/feedback/error-reference/error-reference.component";
import { Text } from "@workspace/ui/components/typography/text/text.component";
import type { FailureAlertProps } from "@workspace/ui/types/components/feedback/failure-alert-props.interface";

export function FailureAlert({ message, reference }: FailureAlertProps) {
  return (
    <Alert tone="error">
      <div className="flex flex-col gap-1">
        <Text as="p" size="small" tone="destructive" weight="regular">
          {message}
        </Text>
        <ErrorReference reference={reference} tone="default" />
      </div>
    </Alert>
  );
}
