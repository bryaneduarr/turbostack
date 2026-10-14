import { healthLiveResponseSchema } from "@workspace/schemas/server/routes/health/live/health-live-response.schema";
import { OK } from "@workspace/utils/http/status-codes/http-status-code.constant";
import type { Context } from "elysia";
import { createSuccessResponse } from "@/services/responses/success/create-success-response.service";

export const healthLiveHandler = ({ request }: Pick<Context, "request">) => {
  return createSuccessResponse({
    request,
    schema: healthLiveResponseSchema,
    data: { status: "alive" },
    message: "Server is alive.",
    status: OK,
  });
};
