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

  const description =
    readiness.kind === "failure"
      ? `${readiness.response.message} (${readiness.response.error.code}, request ${readiness.response.requestId})`
      : readiness.kind === "unexpected-response"
        ? `The API answered with an unexpected ${readiness.status} response.`
        : "The API could not be reached.";

  return <p className="text-destructive">API not ready: {description}</p>;
}
