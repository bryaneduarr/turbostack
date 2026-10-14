import { sendApiRequest } from "@workspace/api-client/requests/send-api-request.service";
import { healthReadyRoute } from "@workspace/schemas/server/routes/health/ready/health-ready.route";
import { getClientEnvironment } from "@/config/environment/client-env.config";

export function getServerReadiness() {
  return sendApiRequest({
    baseUrl: getClientEnvironment().SERVER_URL,
    route: healthReadyRoute,
    params: null,
    query: null,
    body: null,
    init: { cache: "no-store", signal: AbortSignal.timeout(5000) },
  });
}
