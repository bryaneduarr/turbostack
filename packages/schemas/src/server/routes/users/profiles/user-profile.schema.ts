import { createSuccessResponseSchema } from "@workspace/schemas/server/responses/success/create-success-response.schema";
import { z } from "zod";

export const userProfileSchema = z.object({
  /* Identifies the profile with its database-generated UUID. */
  id: z.uuid(),
  /* Contains the profile's given name. */
  firstName: z.string(),
  /* Contains the profile's family name. */
  lastName: z.string(),
  /* Records when the profile was created, as an ISO 8601 UTC timestamp. */
  createdAt: z.iso.datetime(),
  /* Records when the profile was last changed, as an ISO 8601 UTC timestamp. */
  updatedAt: z.iso.datetime(),
});

export const userProfileNamesSchema = z.object({
  /* Contains the given name, trimmed and limited to 1-100 characters. */
  firstName: z
    .string()
    .trim()
    .min(1, { error: "Enter a first name." })
    .max(100, { error: "Use at most 100 characters." }),
  /* Contains the family name, trimmed and limited to 1-100 characters. */
  lastName: z
    .string()
    .trim()
    .min(1, { error: "Enter a last name." })
    .max(100, { error: "Use at most 100 characters." }),
});

export const userProfileParamsSchema = z.object({
  /* Identifies the requested profile by its UUID path segment. */
  profileId: z.uuid(),
});

export const userProfileResponseSchema = createSuccessResponseSchema(
  z.object({
    /* Contains the created, requested, or updated profile. */
    profile: userProfileSchema,
  }),
);
