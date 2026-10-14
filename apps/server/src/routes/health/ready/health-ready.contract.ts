import { healthReadyResponseSchema } from "@workspace/schemas/server/routes/health/ready/health-ready-response.schema";
import {
  OK,
  SERVICE_UNAVAILABLE,
} from "@workspace/utils/http/status-codes/http-status-code.constant";
import { jsonContent } from "@/config/openapi/responses/content/json-response-content.config";

export const healthReadyContract = {
  detail: {
    tags: ["Health"],
    summary: "Readiness probe",
    description:
      "Confirms the database answers a query. Load balancers should stop routing traffic while this fails.",
    responses: {
      [OK]: jsonContent(healthReadyResponseSchema, "The instance is ready."),
      [SERVICE_UNAVAILABLE]: {
        $ref: "#/components/responses/ServiceUnavailable",
      },
    },
  },
};
