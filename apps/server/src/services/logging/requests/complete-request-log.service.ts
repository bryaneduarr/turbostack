import {
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
} from "@workspace/utils/http/status-codes/http-status-code.constant";
import { requestLogs } from "@/services/logging/requests/request-log-state.service";
import type { CompleteRequestLogInput } from "@/types/logging/requests/complete-request-log-input.interface";

export function completeRequestLog({
  request,
  status,
  route,
}: CompleteRequestLogInput) {
  const entry = requestLogs.get(request);
  // Preflight and favicon hooks may have already completed this request.
  if (entry === undefined) return;
  requestLogs.delete(request);

  const fields = {
    event: "request.completed",
    route,
    status,
    durationMs: Math.round(performance.now() - entry.started),
    ...(entry.outcome.kind === "failed"
      ? { errorCode: entry.outcome.code }
      : {}),
    ...(entry.diagnostic.kind === "captured"
      ? { err: entry.diagnostic.cause }
      : {}),
  };
  if (status >= INTERNAL_SERVER_ERROR)
    entry.logger.error(fields, "Request failed");
  else if (status >= BAD_REQUEST && status !== NOT_FOUND)
    entry.logger.warn(fields, "Request rejected");
  else entry.logger.info(fields, "Request completed");
}
