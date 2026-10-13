import { errorResponseSchema } from "@workspace/schemas/server/responses/errors/error-response.schema";
import { getRequestLog } from "@/services/logging/requests/get-request-log.service";
import { errorResponseMessages } from "@/services/responses/errors/error-response-messages.config";
import type { ErrorResponseInput } from "@/types/responses/errors/error-response-input.interface";

export function createErrorResponse({
  request,
  code,
  status,
}: ErrorResponseInput) {
  const entry = getRequestLog(request);
  const requestId = entry.requestId;
  const body = errorResponseSchema.parse({
    success: false,
    message: errorResponseMessages[code],
    data: null,
    error: { code },
    status,
    requestId,
  });
  entry.outcome = { kind: "failed", code: body.error.code };
  return Response.json(body, {
    status: body.status,
    headers: { "x-request-id": body.requestId },
  });
}
