import logger from "@/services/logging/output/logger.config";
import { requestLogs } from "@/services/logging/requests/request-log-state.service";
import type { RequestLogEntry } from "@/types/logging/requests/request-log-entry.interface";

const methods = new Set([
  "GET",
  "HEAD",
  "POST",
  "PUT",
  "PATCH",
  "DELETE",
  "OPTIONS",
  "QUERY",
  "CONNECT",
  "TRACE",
]);

export function getRequestLog(request: Request): RequestLogEntry {
  const existing = requestLogs.get(request);
  if (existing !== undefined) return existing;

  // Early errors can precede middleware; initialize one correlation ID per request.
  const requestId = crypto.randomUUID();
  const entry: RequestLogEntry = {
    started: performance.now(),
    requestId,
    logger: logger.child({
      requestId,
      method: methods.has(request.method) ? request.method : "OTHER",
    }),
    outcome: { kind: "pending" },
    diagnostic: { kind: "none" },
  };
  requestLogs.set(request, entry);
  return entry;
}
