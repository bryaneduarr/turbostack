import { getUserProfileRoute } from "@workspace/schemas/server/routes/users/profiles/get/get-user-profile.route";
import type { UserProfileParams } from "@workspace/schemas/server/routes/users/profiles/user-profile.interface";
import { OK } from "@workspace/utils/http/status-codes/http-status-code.constant";
import type { Context } from "elysia";
import { createSuccessResponse } from "@/services/responses/success/create-success-response.service";
import { getUserProfile } from "@/services/users/profiles/get/get-user-profile.service";

export const getUserProfileHandler = async ({
  request,
  params,
}: Pick<Context, "request"> & { params: UserProfileParams }) => {
  const profile = await getUserProfile(params);
  return createSuccessResponse({
    request,
    schema: getUserProfileRoute.response,
    data: { profile },
    message: "User profile found.",
    status: OK,
  });
};
