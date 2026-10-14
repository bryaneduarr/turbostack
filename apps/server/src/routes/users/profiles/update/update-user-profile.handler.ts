import { updateUserProfileRoute } from "@workspace/schemas/server/routes/users/profiles/update/update-user-profile.route";
import type {
  UserProfileNames,
  UserProfileParams,
} from "@workspace/schemas/server/routes/users/profiles/user-profile.interface";
import { OK } from "@workspace/utils/http/status-codes/http-status-code.constant";
import type { Context } from "elysia";
import { createSuccessResponse } from "@/services/responses/success/create-success-response.service";
import { updateUserProfile } from "@/services/users/profiles/update/update-user-profile.service";

export const updateUserProfileHandler = async ({
  request,
  params,
  body,
}: Pick<Context, "request"> & {
  params: UserProfileParams;
  body: UserProfileNames;
}) => {
  const profile = await updateUserProfile({
    profileId: params.profileId,
    names: body,
  });
  return createSuccessResponse({
    request,
    schema: updateUserProfileRoute.response,
    data: { profile },
    message: "User profile updated.",
    status: OK,
  });
};
