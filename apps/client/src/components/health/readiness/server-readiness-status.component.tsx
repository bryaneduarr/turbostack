import { Alert } from "@workspace/ui/components/feedback/alert/alert.component";
import { ApiFailureAlert } from "@workspace/ui/components/feedback/api-failure-alert/api-failure-alert.component";
import type { ServerReadinessStatusProps } from "@/types/health/readiness/server-readiness-status-props.interface";

export function ServerReadinessStatus({
  readiness,
}: ServerReadinessStatusProps) {
  if (readiness.kind === "success") {
    return (
      <Alert tone="success">
        API ready: {readiness.response.message} Database{" "}
        {readiness.response.data.database}.
      </Alert>
    );
  }

  return <ApiFailureAlert result={readiness} />;
}
