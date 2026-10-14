import { getUserProfileRoute } from "@workspace/schemas/server/routes/users/profiles/get/get-user-profile.route";
import { OK } from "@workspace/utils/http/status-codes/http-status-code.constant";
import { jsonContent } from "@/config/openapi/responses/content/json-response-content.config";
import type { RouteContract } from "@/types/http/routes/route-contract.interface";

export const getUserProfileContract = {
  params: getUserProfileRoute.params,
  detail: {
    tags: ["User profiles"],
    summary: "Get a user profile",
    description: "Returns one profile, or NOT_FOUND when it does not exist.",
    responses: {
      [OK]: jsonContent(getUserProfileRoute.response, "The requested profile."),
    },
  },
} satisfies RouteContract<typeof getUserProfileRoute>;
