import { sendApiRequest } from "@workspace/api-client/requests/send-api-request.service";
import type { RouteDefinition } from "@workspace/schemas/server/routes/definition/route-definition.interface";
import { getClientEnvironment } from "@/config/environment/client-env.config";
import type { RequestApiInput } from "@/types/api/requests/request-api-input.interface";

const requestTimeoutMilliseconds = 5000;

export function requestApi<Route extends RouteDefinition>(
  input: RequestApiInput<Route>,
) {
  return sendApiRequest<Route>({
    ...input,
    baseUrl: getClientEnvironment().SERVER_URL,
    init: {
      cache: "no-store",
      signal: AbortSignal.timeout(requestTimeoutMilliseconds),
    },
  });
}
