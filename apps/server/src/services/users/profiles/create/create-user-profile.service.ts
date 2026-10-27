import { usersProfile } from "@workspace/database/tables/users/profile/user-profile.table";
import type {
  UserProfile,
  UserProfileNames,
} from "@workspace/schemas/server/routes/users/profiles/user-profile.interface";
import { db } from "@/config/database/database-connection.config";
import { serializeUserProfile } from "@/services/users/profiles/serialize-user-profile.service";

export async function createUserProfile(
  names: UserProfileNames,
): Promise<UserProfile> {
  const [record] = await db.insert(usersProfile).values(names).returning();
  if (record === undefined) {
    throw new Error("Inserting a user profile returned no row.");
  }
  return serializeUserProfile(record);
}
