import { describeApiFailure } from "@workspace/api-client/results/api-failure/describe-api-failure.service";
import type { ApiResult } from "@workspace/api-client/types/requests/send-api-request.interface";
import type { RouteDefinition } from "@workspace/schemas/server/routes/definition/route-definition.interface";
import type { z } from "zod";

export function requireApiSuccess<Route extends RouteDefinition>(
  result: ApiResult<Route>,
): z.output<Route["response"]> {
  if (result.kind === "success") return result.response;
  throw new Error(`Expected API success: ${describeApiFailure(result)}`);
}
