import type { ListUserProfilesQuery } from "@workspace/schemas/server/routes/users/profiles/list/list-user-profiles.interface";
import { listUserProfilesRoute } from "@workspace/schemas/server/routes/users/profiles/list/list-user-profiles.route";
import { OK } from "@workspace/utils/http/status-codes/http-status-code.constant";
import type { Context } from "elysia";
import { createSuccessResponse } from "@/services/responses/success/create-success-response.service";
import { listUserProfiles } from "@/services/users/profiles/list/list-user-profiles.service";

export const listUserProfilesHandler = async ({
  request,
  query,
}: Pick<Context, "request"> & { query: ListUserProfilesQuery }) => {
  const profiles = await listUserProfiles(query);
  return createSuccessResponse({
    request,
    schema: listUserProfilesRoute.response,
    data: { profiles },
    message: "User profiles listed.",
    status: OK,
  });
};
