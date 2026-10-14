import { healthReadyRoute } from "@workspace/schemas/server/routes/health/ready/health-ready.route";
import { OK } from "@workspace/utils/http/status-codes/http-status-code.constant";
import type { Context } from "elysia";
import { assertDatabaseReady } from "@/services/health/readiness/assert-database-ready.service";
import { getRequestLog } from "@/services/logging/requests/get-request-log.service";
import { ExpectedFailure } from "@/services/responses/errors/expected-failure.error";
import { createSuccessResponse } from "@/services/responses/success/create-success-response.service";
import { isServerDraining } from "@/services/server/lifecycle/server-draining-state.service";

export const healthReadyHandler = async ({
  request,
}: Pick<Context, "request">) => {
  if (isServerDraining()) {
    throw new ExpectedFailure({
      code: "SERVICE_UNAVAILABLE",
      message: "Server is shutting down.",
    });
  }
  await assertDatabaseReady(getRequestLog(request).logger);
  return createSuccessResponse({
    request,
    schema: healthReadyRoute.response,
    data: { status: "ready", database: "up" },
    message: "Server is ready.",
    status: OK,
  });
};
