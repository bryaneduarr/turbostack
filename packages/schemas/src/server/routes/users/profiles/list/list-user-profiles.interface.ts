import type {
  listUserProfilesQuerySchema,
  listUserProfilesResponseSchema,
} from "@workspace/schemas/server/routes/users/profiles/list/list-user-profiles.schema";
import type { z } from "zod";

/** Represents validated pagination values for listing profiles. */
export interface ListUserProfilesQuery
  extends z.output<typeof listUserProfilesQuerySchema> {}

/** Represents the validated envelope containing one page of profiles. */
export interface ListUserProfilesResponse
  extends z.output<typeof listUserProfilesResponseSchema> {}
