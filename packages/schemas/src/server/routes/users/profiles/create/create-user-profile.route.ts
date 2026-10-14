import type { RouteDefinition } from "@workspace/schemas/server/routes/definition/route-definition.interface";
import {
  userProfileNamesSchema,
  userProfileResponseSchema,
} from "@workspace/schemas/server/routes/users/profiles/user-profile.schema";
import { API_V1_PREFIX } from "@workspace/schemas/server/routes/versioning/api-version-prefix.constant";

export const createUserProfileRoute = {
  method: "POST",
  path: `${API_V1_PREFIX}/users/profiles`,
  params: null,
  query: null,
  body: userProfileNamesSchema,
  response: userProfileResponseSchema,
} as const satisfies RouteDefinition;
