import { listUserProfilesRoute } from "@workspace/schemas/server/routes/users/profiles/list/list-user-profiles.route";
import { OK } from "@workspace/utils/http/status-codes/http-status-code.constant";
import { jsonContent } from "@/config/openapi/responses/content/json-response-content.config";
import type { RouteContract } from "@/types/http/routes/route-contract.interface";

export const listUserProfilesContract = {
  query: listUserProfilesRoute.query,
  detail: {
    tags: ["User profiles"],
    summary: "List user profiles",
    description: "Returns one page of profiles, newest first.",
    responses: {
      [OK]: jsonContent(
        listUserProfilesRoute.response,
        "One page of profiles.",
      ),
    },
  },
} satisfies RouteContract<typeof listUserProfilesRoute>;
