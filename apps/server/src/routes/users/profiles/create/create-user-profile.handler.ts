import { createUserProfileRoute } from "@workspace/schemas/server/routes/users/profiles/create/create-user-profile.route";
import type { UserProfileNames } from "@workspace/schemas/server/routes/users/profiles/user-profile.interface";
import { CREATED } from "@workspace/utils/http/status-codes/http-status-code.constant";
import type { Context } from "elysia";
import { createSuccessResponse } from "@/services/responses/success/create-success-response.service";
import { createUserProfile } from "@/services/users/profiles/create/create-user-profile.service";

export const createUserProfileHandler = async ({
  request,
  body,
}: Pick<Context, "request"> & { body: UserProfileNames }) => {
  const profile = await createUserProfile(body);
  return createSuccessResponse({
    request,
    schema: createUserProfileRoute.response,
    data: { profile },
    message: "User profile created.",
    status: CREATED,
  });
};
