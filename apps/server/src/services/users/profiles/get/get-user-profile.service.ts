import { usersProfile } from "@workspace/database/tables/users/profile/user-profile.table";
import type {
  UserProfile,
  UserProfileParams,
} from "@workspace/schemas/server/routes/users/profiles/user-profile.interface";
import { eq } from "drizzle-orm";
import { db } from "@/config/database/database-connection.config";
import { ExpectedFailure } from "@/services/responses/errors/expected-failure.error";
import { serializeUserProfile } from "@/services/users/profiles/serialize-user-profile.service";

export async function getUserProfile({
  profileId,
}: UserProfileParams): Promise<UserProfile> {
  const [record] = await db
    .select()
    .from(usersProfile)
    .where(eq(usersProfile.id, profileId));
  if (record === undefined) {
    throw new ExpectedFailure({
      code: "NOT_FOUND",
      message: "User profile not found.",
    });
  }
  return serializeUserProfile(record);
}
