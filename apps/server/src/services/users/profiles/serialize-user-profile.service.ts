import type { UserProfileRecord } from "@workspace/database/types/users/profile/user-profile-record.interface";
import type { UserProfile } from "@workspace/schemas/server/routes/users/profiles/user-profile.interface";

export function serializeUserProfile(record: UserProfileRecord): UserProfile {
  return {
    id: record.id,
    firstName: record.firstName,
    lastName: record.lastName,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  };
}
