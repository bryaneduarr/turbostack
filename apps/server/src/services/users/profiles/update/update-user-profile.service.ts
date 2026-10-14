import type { UserProfile } from "@workspace/schemas/server/routes/users/profiles/user-profile.interface";
import { eq } from "drizzle-orm";
import { db } from "@/db/config/connection/database-connection.config";
import { usersProfile } from "@/db/tables/users/profile/user-profile.table";
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
