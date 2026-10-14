import { createUserProfileRoute } from "@workspace/schemas/server/routes/users/profiles/create/create-user-profile.route";
import { CREATED } from "@workspace/utils/http/status-codes/http-status-code.constant";
import { jsonContent } from "@/config/openapi/responses/content/json-response-content.config";
import type { RouteContract } from "@/types/http/routes/route-contract.interface";

export const createUserProfileContract = {
  body: createUserProfileRoute.body,
  detail: {
    tags: ["User profiles"],
    summary: "Create a user profile",
    description: "Creates a profile from trimmed, nonempty names.",
    responses: {
      [CREATED]: jsonContent(
        createUserProfileRoute.response,
        "The created profile.",
      ),
    },
  },
} satisfies RouteContract<typeof createUserProfileRoute>;
