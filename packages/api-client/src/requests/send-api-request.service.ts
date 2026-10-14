import { buildRequestUrl } from "@workspace/api-client/requests/urls/build-request-url.service";
import type {
  ApiResult,
  SendApiRequestInput,
} from "@workspace/api-client/types/requests/send-api-request.interface";
import { errorResponseSchema } from "@workspace/schemas/server/responses/errors/error-response.schema";
import type { RouteDefinition } from "@workspace/schemas/server/routes/definition/route-definition.interface";
import { z } from "zod";

export async function sendApiRequest<Route extends RouteDefinition>({
  baseUrl,
  route,
  params,
  query,
  body,
  init,
}: SendApiRequestInput<Route>): Promise<ApiResult<Route>> {
  const url = buildRequestUrl({ baseUrl, path: route.path, params, query });
  const headers = new Headers(init.headers);
  headers.set("accept", "application/json");
  if (body !== null) headers.set("content-type", "application/json");

  let response: Response;
  try {
    response = await fetch(url, {
      ...init,
      method: route.method,
      headers,
      ...(body === null ? {} : { body: JSON.stringify(body) }),
    });
  } catch (cause) {
    return { kind: "unreachable", cause };
  }

  // A success that violates its route contract is a defect, so it throws.
  if (response.ok) {
    return {
      kind: "success",
      response: z.parse<Route["response"]>(
        route.response,
        await response.json(),
      ),
    };
  }

  // Proxies and older servers can answer with HTML or unknown error codes.
  let failureBody: unknown;
  try {
    failureBody = await response.json();
  } catch {
    return { kind: "unexpected-response", status: response.status };
  }
  const failure = errorResponseSchema.safeParse(failureBody);
  return failure.success
    ? { kind: "failure", response: failure.data }
    : { kind: "unexpected-response", status: response.status };
}
