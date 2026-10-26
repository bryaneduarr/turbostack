import { sendApiRequest } from "@workspace/api-client/requests/send-api-request.service";
import type { RouteDefinition } from "@workspace/schemas/server/routes/definition/route-definition.interface";
import { E2E_API_URL } from "@/e2e/config/servers/e2e-servers.constant";
import type { RequestApiInput } from "@/types/api/requests/request-api-input.interface";

export function requestE2eApi<Route extends RouteDefinition>(
  input: RequestApiInput<Route>,
) {
  return sendApiRequest<Route>({ ...input, baseUrl: E2E_API_URL, init: {} });
}
