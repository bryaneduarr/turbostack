import { usersProfile } from "@workspace/database/tables/users/profile/user-profile.table";
import type { UserProfile } from "@workspace/schemas/server/routes/users/profiles/user-profile.interface";
import { eq } from "drizzle-orm";
import { db } from "@/config/database/database-connection.config";
import { ExpectedFailure } from "@/services/responses/errors/expected-failure.error";
import { serializeUserProfile } from "@/services/users/profiles/serialize-user-profile.service";
import type { UpdateUserProfileInput } from "@/types/users/profiles/update/update-user-profile-input.interface";

export async function updateUserProfile({
  profileId,
  names,
}: UpdateUserProfileInput): Promise<UserProfile> {
  const [record] = await db
    .update(usersProfile)
    .set(names)
    .where(eq(usersProfile.id, profileId))
    .returning();
  if (record === undefined) {
    throw new ExpectedFailure({
      code: "NOT_FOUND",
      message: "User profile not found.",
    });
  }
  return serializeUserProfile(record);
}
