import { healthReadyRoute } from "@workspace/schemas/server/routes/health/ready/health-ready.route";
import { OK } from "@workspace/utils/http/status-codes/http-status-code.constant";
import type { Context } from "elysia";
import { assertDatabaseReady } from "@/services/health/readiness/assert-database-ready.service";
import { getRequestLog } from "@/services/logging/requests/get-request-log.service";
import { createSuccessResponse } from "@/services/responses/success/create-success-response.service";

export const healthReadyHandler = async ({
  request,
}: Pick<Context, "request">) => {
  await assertDatabaseReady(getRequestLog(request).logger);
  return createSuccessResponse({
    request,
    schema: healthReadyRoute.response,
    data: { status: "ready", database: "up" },
    message: "Server is ready.",
    status: OK,
  });
};
