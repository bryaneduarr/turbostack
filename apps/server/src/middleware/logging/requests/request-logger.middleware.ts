import { OK } from "@workspace/utils/http/status-codes/http-status-code.constant";
import { Elysia, StatusMap } from "elysia";
import { completeRequestLog } from "@/services/logging/requests/complete-request-log.service";
import { getRequestLog } from "@/services/logging/requests/get-request-log.service";

export const requestLogger = new Elysia({ name: "request-logger" })
  .onRequest(({ request, set }) => {
    const { requestId } = getRequestLog(request);
    set.headers["x-request-id"] = requestId;
  })
  .derive({ as: "global" }, ({ request }) => {
    const { logger, requestId } = getRequestLog(request);
    return { logger, requestId };
  })
  .onAfterResponse(
    { as: "global" },
    ({ request, set, route, responseValue }) => {
      const setStatus =
        typeof set.status === "string"
          ? StatusMap[set.status]
          : (set.status ?? OK);
      // Elysia preserves a non-OK Response status; otherwise it applies set.status.
      const status =
        responseValue instanceof Response && responseValue.status !== OK
          ? responseValue.status
          : setStatus;
      completeRequestLog({ request, status, route: route || "<unmatched>" });
    },
  );
