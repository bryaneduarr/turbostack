import { updateUserProfileRoute } from "@workspace/schemas/server/routes/users/profiles/update/update-user-profile.route";
import { OK } from "@workspace/utils/http/status-codes/http-status-code.constant";
import { jsonContent } from "@/config/openapi/responses/content/json-response-content.config";
import type { RouteContract } from "@/types/http/routes/route-contract.interface";

export const updateUserProfileContract = {
  params: updateUserProfileRoute.params,
  body: updateUserProfileRoute.body,
  detail: {
    tags: ["User profiles"],
    summary: "Replace a user profile's names",
    description:
      "Replaces both names, or returns NOT_FOUND when the profile does not exist.",
    responses: {
      [OK]: jsonContent(
        updateUserProfileRoute.response,
        "The updated profile.",
      ),
    },
  },
} satisfies RouteContract<typeof updateUserProfileRoute>;
