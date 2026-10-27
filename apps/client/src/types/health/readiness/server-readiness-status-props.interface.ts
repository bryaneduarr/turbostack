import type { ApiResult } from "@workspace/api-client/types/requests/send-api-request.interface";
import type { healthReadyRoute } from "@workspace/schemas/server/routes/health/ready/health-ready.route";

/** Supplies the readiness check result shown on the home page. */
export interface ServerReadinessStatusProps {
  /** Contains the validated outcome of calling the API readiness route. */
  readiness: ApiResult<typeof healthReadyRoute>;
}
