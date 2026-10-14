import type { UserProfile } from "@workspace/schemas/server/routes/users/profiles/user-profile.interface";
import type { UserProfileRecord } from "@/db/tables/users/profile/user-profile.table";

export function serializeUserProfile(record: UserProfileRecord): UserProfile {
  return {
    id: record.id,
    firstName: record.firstName,
    lastName: record.lastName,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  };
}
