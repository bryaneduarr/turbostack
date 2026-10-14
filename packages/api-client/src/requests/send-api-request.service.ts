import type {
  ApiResult,
  SendApiRequestInput,
} from "@workspace/api-client/types/requests/send-api-request.interface";
import { errorResponseSchema } from "@workspace/schemas/server/responses/errors/error-response.schema";
import type { SuccessResponse } from "@workspace/schemas/server/responses/success/success-response.interface";
import type { z } from "zod";

export async function sendApiRequest<
  Schema extends z.ZodType<SuccessResponse>,
>({
  baseUrl,
  path,
  init,
  schema,
}: SendApiRequestInput<Schema>): Promise<ApiResult<Schema>> {
  const response = await fetch(new URL(path, baseUrl), init);
  const body: unknown = await response.json();

  if (response.ok) return { kind: "success", response: schema.parse(body) };
  return { kind: "failure", response: errorResponseSchema.parse(body) };
}
