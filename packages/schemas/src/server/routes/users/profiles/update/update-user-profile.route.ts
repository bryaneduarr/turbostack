import type { RouteDefinition } from "@workspace/schemas/server/routes/definition/route-definition.interface";
import {
  userProfileNamesSchema,
  userProfileParamsSchema,
  userProfileResponseSchema,
} from "@workspace/schemas/server/routes/users/profiles/user-profile.schema";
import { API_V1_PREFIX } from "@workspace/schemas/server/routes/versioning/api-version-prefix.constant";

export const updateUserProfileRoute = {
  method: "PUT",
  path: `${API_V1_PREFIX}/users/profiles/:profileId`,
  params: userProfileParamsSchema,
  query: null,
  body: userProfileNamesSchema,
  response: userProfileResponseSchema,
} as const satisfies RouteDefinition;
