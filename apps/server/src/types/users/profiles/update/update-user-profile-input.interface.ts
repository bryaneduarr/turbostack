import type {
  UserProfileNames,
  UserProfileParams,
} from "@workspace/schemas/server/routes/users/profiles/user-profile.interface";

/* Identifies the profile to replace and supplies its validated new names. */
export interface UpdateUserProfileInput {
  /* Identifies the profile whose names are replaced. */
  profileId: UserProfileParams["profileId"];
  /* Contains the validated names that replace the current ones. */
  names: UserProfileNames;
}
