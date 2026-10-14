import { healthLiveRoute } from "@workspace/schemas/server/routes/health/live/health-live.route";
import { OK } from "@workspace/utils/http/status-codes/http-status-code.constant";
import type { Context } from "elysia";
import { createSuccessResponse } from "@/services/responses/success/create-success-response.service";

export const healthLiveHandler = ({ request }: Pick<Context, "request">) => {
  return createSuccessResponse({
    request,
    schema: healthLiveRoute.response,
    data: { status: "alive" },
    message: "Server is alive.",
    status: OK,
  });
};
