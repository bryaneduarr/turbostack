import { createUserProfileRoute } from "@workspace/schemas/server/routes/users/profiles/create/create-user-profile.route";
import { getUserProfileRoute } from "@workspace/schemas/server/routes/users/profiles/get/get-user-profile.route";
import { listUserProfilesRoute } from "@workspace/schemas/server/routes/users/profiles/list/list-user-profiles.route";
import { updateUserProfileRoute } from "@workspace/schemas/server/routes/users/profiles/update/update-user-profile.route";
import { createRouter } from "@/config/http/routing/http-router.config";
import { createUserProfileContract } from "@/routes/users/profiles/create/create-user-profile.contract";
import { createUserProfileHandler } from "@/routes/users/profiles/create/create-user-profile.handler";
import { getUserProfileContract } from "@/routes/users/profiles/get/get-user-profile.contract";
import { getUserProfileHandler } from "@/routes/users/profiles/get/get-user-profile.handler";
import { listUserProfilesContract } from "@/routes/users/profiles/list/list-user-profiles.contract";
import { listUserProfilesHandler } from "@/routes/users/profiles/list/list-user-profiles.handler";
import { updateUserProfileContract } from "@/routes/users/profiles/update/update-user-profile.contract";
import { updateUserProfileHandler } from "@/routes/users/profiles/update/update-user-profile.handler";

const userProfilesRouter = createRouter()
  .route(
    listUserProfilesRoute.method,
    listUserProfilesRoute.path,
    listUserProfilesHandler,
    listUserProfilesContract,
  )
  .route(
    createUserProfileRoute.method,
    createUserProfileRoute.path,
    createUserProfileHandler,
    createUserProfileContract,
  )
  .route(
    getUserProfileRoute.method,
    getUserProfileRoute.path,
    getUserProfileHandler,
    getUserProfileContract,
  )
  .route(
    updateUserProfileRoute.method,
    updateUserProfileRoute.path,
    updateUserProfileHandler,
    updateUserProfileContract,
  );

export default userProfilesRouter;
