import type {
  userProfileNamesSchema,
  userProfileParamsSchema,
  userProfileResponseSchema,
  userProfileSchema,
} from "@workspace/schemas/server/routes/users/profiles/user-profile.schema";
import type { z } from "zod";

/* Represents a profile as the API returns it. */
export interface UserProfile extends z.output<typeof userProfileSchema> {}

/* Represents raw profile names before trimming and length validation. */
export interface UserProfileNamesInput
  extends z.input<typeof userProfileNamesSchema> {}

/* Represents validated profile names used to create or replace a profile. */
export interface UserProfileNames
  extends z.output<typeof userProfileNamesSchema> {}

/* Represents the validated path parameters that identify one profile. */
export interface UserProfileParams
  extends z.output<typeof userProfileParamsSchema> {}

/* Represents the validated envelope returned for a single profile. */
export interface UserProfileResponse
  extends z.output<typeof userProfileResponseSchema> {}
