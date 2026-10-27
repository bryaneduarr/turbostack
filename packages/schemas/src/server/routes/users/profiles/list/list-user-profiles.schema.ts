import { createSuccessResponseSchema } from "@workspace/schemas/server/responses/success/create-success-response.schema";
import { userProfileSchema } from "@workspace/schemas/server/routes/users/profiles/user-profile.schema";
import { z } from "zod";

export const listUserProfilesQuerySchema = z.object({
  /** Limits the page to 1-100 profiles; query strings are converted to numbers. */
  limit: z.coerce.number<number>().int().min(1).max(100),
  /** Skips this many profiles, newest first, to reach later pages. */
  offset: z.coerce.number<number>().int().min(0),
});

export const listUserProfilesResponseSchema = createSuccessResponseSchema(
  z.object({
    /** Contains one page of profiles ordered from newest to oldest. */
    profiles: z.array(userProfileSchema),
  }),
);
