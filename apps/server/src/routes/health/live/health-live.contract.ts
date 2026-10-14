import { healthLiveRoute } from "@workspace/schemas/server/routes/health/live/health-live.route";
import { OK } from "@workspace/utils/http/status-codes/http-status-code.constant";
import { jsonContent } from "@/config/openapi/responses/content/json-response-content.config";
import type { RouteContract } from "@/types/http/routes/route-contract.interface";

export const healthLiveContract = {
  detail: {
    tags: ["Health"],
    summary: "Liveness probe",
    description:
      "Confirms the process serves HTTP. It checks no dependencies, so restart the instance only when this fails.",
    responses: {
      [OK]: jsonContent(healthLiveRoute.response, "The process is alive."),
    },
  },
} satisfies RouteContract<typeof healthLiveRoute>;
