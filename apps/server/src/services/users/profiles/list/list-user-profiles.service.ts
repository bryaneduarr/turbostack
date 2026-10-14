import type { ListUserProfilesQuery } from "@workspace/schemas/server/routes/users/profiles/list/list-user-profiles.interface";
import type { UserProfile } from "@workspace/schemas/server/routes/users/profiles/user-profile.interface";
import { desc } from "drizzle-orm";
import { db } from "@/db/config/connection/database-connection.config";
import { usersProfile } from "@/db/tables/users/profile/user-profile.table";
import { serializeUserProfile } from "@/services/users/profiles/serialize-user-profile.service";

export async function listUserProfiles({
  limit,
  offset,
}: ListUserProfilesQuery): Promise<UserProfile[]> {
  const records = await db
    .select()
    .from(usersProfile)
    .orderBy(desc(usersProfile.createdAt), desc(usersProfile.id))
    .limit(limit)
    .offset(offset);
  return records.map(serializeUserProfile);
}
