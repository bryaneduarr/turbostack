import type { usersProfile } from "@workspace/database/tables/users/profile/user-profile.table";

/** Represents one stored user profile row as the database returns it. */
export type UserProfileRecord = typeof usersProfile.$inferSelect;
