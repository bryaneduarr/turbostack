import { jsonResponseDataSchema } from "@workspace/schemas/server/responses/success/success-response.schema";
import type { SuccessResponse } from "@workspace/schemas/server/responses/success/success-response.interface";
import type { z } from "zod";
import { getRequestLog } from "@/services/logging/requests/get-request-log.service";
import type { SuccessResponseInput } from "@/types/responses/success/success-response-input.interface";

export function createSuccessResponse<
  Schema extends z.ZodType<SuccessResponse>,
>({ request, schema, data, message, status }: SuccessResponseInput<Schema>) {
  const requestId = getRequestLog(request).requestId;
  // Parsing strips undeclared payload fields before data reaches the client.
  const body = schema.parse({
    success: true,
    message,
    data,
    error: null,
    status,
    requestId,
  });
  // Undefined, non-finite numbers, and non-JSON values must not alter the wire shape.
  const response = { ...body, data: jsonResponseDataSchema.parse(body.data) };
  return Response.json(response, {
    status: response.status,
    headers: { "x-request-id": response.requestId },
  });
}
