import { OK } from "@workspace/utils/http/status-codes/http-status-code.constant";
import { helloWorldResponseSchema } from "@workspace/schemas/server/routes/hello-world/hello-world-response.schema";
import type { Context } from "elysia";
import { createSuccessResponse } from "@/services/responses/success/create-success-response.service";

export const helloWorldHandler = ({ request }: Pick<Context, "request">) => {
  return createSuccessResponse({
    request,
    schema: helloWorldResponseSchema,
    data: null,
    message: "Hello World!",
    status: OK,
  });
};
