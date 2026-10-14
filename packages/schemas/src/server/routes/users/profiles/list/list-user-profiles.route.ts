import type { RouteDefinition } from "@workspace/schemas/server/routes/definition/route-definition.interface";
import {
  listUserProfilesQuerySchema,
  listUserProfilesResponseSchema,
} from "@workspace/schemas/server/routes/users/profiles/list/list-user-profiles.schema";
import { API_V1_PREFIX } from "@workspace/schemas/server/routes/versioning/api-version-prefix.constant";

export const listUserProfilesRoute = {
  method: "GET",
  path: `${API_V1_PREFIX}/users/profiles`,
  params: null,
  query: listUserProfilesQuerySchema,
  body: null,
  response: listUserProfilesResponseSchema,
} as const satisfies RouteDefinition;
