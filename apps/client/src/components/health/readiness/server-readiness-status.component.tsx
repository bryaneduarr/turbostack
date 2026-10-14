import { describeApiFailure } from "@/services/api/results/describe-api-failure.service";
import type { ServerReadinessStatusProps } from "@/types/health/readiness/server-readiness-status-props.interface";

export function ServerReadinessStatus({
  readiness,
}: ServerReadinessStatusProps) {
  if (readiness.kind === "success") {
    return (
      <p className="text-success">
        API ready: {readiness.response.message} Database{" "}
        {readiness.response.data.database}.
      </p>
    );
  }

  return (
    <p className="text-destructive">
      API not ready: {describeApiFailure(readiness)}
    </p>
  );
}
