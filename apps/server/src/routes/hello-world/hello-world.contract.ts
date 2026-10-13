import { OK } from "@workspace/utils/http/status-codes/http-status-code.constant";
import { helloWorldResponseSchema } from "@workspace/schemas/server/routes/hello-world/hello-world-response.schema";
import { jsonContent } from "@/config/openapi/responses/content/json-response-content.config";

export const helloWorldContract = {
  detail: {
    tags: ["Hello World"],
    summary: "Say Hello, World!",
    description:
      "Verify that the server is working. No request body is required. The standard envelope has data=null for this route.",
    responses: {
      [OK]: jsonContent(
        helloWorldResponseSchema,
        "Successful greeting in the standard response envelope.",
      ),
    },
  },
};
